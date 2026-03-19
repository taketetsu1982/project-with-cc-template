# DB Schema Spec

> データベーススキーマ定義。conceptual-model の写像。

**バージョン:** 0.3
**ステータス:** Draft
**最終更新:** 2026-03-19
**導出元:** docs/reqs/product-model.json（entities）

---

## ER 図（概要）

```
users
  │
  ├──1:1── oura_connections
  │
  └──1:N── daily_records
              │
              ├──1:1── physical_scores
              │
              └──1:1── mental_entries
```

---

## ENUM 定義

PG1ではENUM定義なし。

---

## 共通カラム規約

全テーブルに以下のカラムを持つ:

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 主キー |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 作成日時 |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 更新日時 |
| `deleted_at` | TIMESTAMPTZ | - | ソフトデリート |

---

## テーブル定義

### users
**概念モデルの対応エンティティ:** ユーザー（User） — Oura Ring所有者。本システムの利用者

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| `timezone` | TEXT | NOT NULL, DEFAULT 'Asia/Tokyo' | IANAタイムゾーン。日付境界の判定に使用 |

PG1では自分自身のみのため、認証情報（メール等）は不要。タイムゾーンはZ-score計算・日次レコードの日付境界判定に必要。

---

### oura_connections
**概念モデルの対応エンティティ:** Oura接続（OuraConnection） — Oura Cloud APIとのOAuth2接続情報

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| `user_id` | UUID | NOT NULL, UNIQUE, FK → users.id | 所有ユーザー |
| `access_token` | TEXT | NOT NULL | OAuth2アクセストークン |
| `refresh_token` | TEXT | NOT NULL | OAuth2リフレッシュトークン |
| `token_expires_at` | TIMESTAMPTZ | NOT NULL | アクセストークンの有効期限 |

**インデックス:** `oura_connections_user_id_idx` ON (`user_id`)

---

### daily_records
**概念モデルの対応エンティティ:** 日次レコード（DailyRecord） — 特定日のフィジカル+メンタルを束ねる親レコード

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| `user_id` | UUID | NOT NULL, FK → users.id | 所有ユーザー |
| `record_date` | DATE | NOT NULL | 対象日付 |

**インデックス:**
- `daily_records_user_id_idx` ON (`user_id`)
- `daily_records_user_id_record_date_key` UNIQUE ON (`user_id`, `record_date`) — 1日1レコード制約

---

### physical_scores
**概念モデルの対応エンティティ:** フィジカルスコア（PhysicalScore） — Oura APIから日次取得する身体コンディションデータ

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| `daily_record_id` | UUID | NOT NULL, UNIQUE, FK → daily_records.id | 親レコード |
| `sleep_score` | INTEGER | - | Oura Sleep Score |
| `readiness_score` | INTEGER | - | Oura Readiness Score |
| `activity_score` | INTEGER | - | Oura Activity Score |
| `hrv_rmssd` | FLOAT | - | HRV（RMSSD、ミリ秒） |
| `resting_heart_rate` | FLOAT | - | 安静時心拍数（bpm） |
| `sleep_stages` | JSONB | - | 睡眠ステージ比率（`{"rem": 0.22, "light": 0.45, "deep": 0.18, "awake": 0.15}`）|

各スコアカラムはNULLABLE。Oura APIのデータ欠損に対応するため。sleep_stagesはOura APIから取得したREM/Light/Deep/Awakeの比率（0.0〜1.0）をJSONBで保持する。

**インデックス:** `physical_scores_daily_record_id_idx` ON (`daily_record_id`)

---

### mental_entries
**概念モデルの対応エンティティ:** メンタルエントリ（MentalEntry） — ユーザーが日次で自己入力するメンタルスコア（4軸×7段階Likert）

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| `daily_record_id` | UUID | NOT NULL, UNIQUE, FK → daily_records.id | 親レコード |
| `mood` | INTEGER | NOT NULL, CHECK (mood BETWEEN 1 AND 7) | 気分（Valence） |
| `energy` | INTEGER | NOT NULL, CHECK (energy BETWEEN 1 AND 7) | エネルギー（Arousal） |
| `stress` | INTEGER | NOT NULL, CHECK (stress BETWEEN 1 AND 7) | ストレス（主観的負荷感） |
| `focus` | INTEGER | NOT NULL, CHECK (focus BETWEEN 1 AND 7) | 集中（認知パフォーマンス） |

**インデックス:** `mental_entries_daily_record_id_idx` ON (`daily_record_id`)

---

## マイグレーション方針

- ツール: Alembic（Python）またはフレームワーク付属のマイグレーション機能
- マイグレーションファイルは `backend/migrations/` に配置
- 本番適用前に `make migrate` でローカル検証する

---

## 命名規約

- テーブル名: snake_case, 複数形
- カラム名: snake_case
- 外部キー: `{参照先テーブル単数形}_id`
- インデックス: `{テーブル名}_{カラム名}_idx`
- ユニーク制約: `{テーブル名}_{意味}_key`

# Impl Plan — 実装計画

**バージョン:** 0.2
**ステータス:** Draft
**最終更新:** 2026-03-21
**導出元:** docs/reqs/user-stories.md, docs/specs/db-schema.md (v0.4), docs/specs/api-spec.md (v0.4), docs/specs/auth-spec.md (v0.3)

---

## 実装順序

全USがMust。依存関係に基づき3フェーズで実装する。

```
フェーズ0: 基盤（認証・DBマイグレーション）
    ↓
フェーズ1: データ入力（US-01, US-02, US-03, US-04）← 並列可
    ↓
フェーズ2: データ表示（US-05, US-06, US-07, US-08）← 順次
```

### 依存関係

```
US-01 ──→ US-02
  │
  └──→ US-05 ──→ US-06 ──→ US-07
US-03 ──→ US-04   │          │
  │                └──→ US-08 ┘
  └──→ US-05
```

- US-01（Oura接続）とUS-03（メンタル入力）は独立。並列実装可能
- US-05（日次サマリー）はUS-01 + US-03の両方のデータを統合表示するが、片方nullでも動作する
- US-06〜08はUS-05のロジック拡張

---

## フェーズ0: 基盤

### PHASE-0: プロジェクトセットアップ・認証・DBマイグレーション

**ゴール:** 全テーブルが作成され、JWT認証が動作する状態

**実装対象:**
- DB: users, oura_connections, daily_records, physical_scores, mental_entries の全5テーブル作成（マイグレーション）
- Auth: POST `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/auth/refresh` 実装
- Auth: JWT認証ミドルウェア（Access Token検証、Refresh Token Cookie管理）
- Test: DB-01〜DB-10（テーブル存在・カラム定義・制約・インデックス）、AUTH-01

---

## フェーズ1: データ入力

### US-01: Oura APIを接続する（Must）

**ゴール:** Oura OAuth2認証を完了し、フィジカルデータの自動取得が開始される

**実装対象:**
- API 新規: POST `/api/v1/oura/authorize`, GET `/api/v1/oura/callback`, GET `/api/v1/oura/connection`, POST `/api/v1/oura/sync`
- Auth: Oura OAuth2フロー（state生成・検証、トークン取得・保存・リフレッシュ）
- DB: oura_connections への書き込み、physical_scores + daily_records の自動作成（sync時）
- UI 新規: Oura接続設定画面（接続状態表示、接続/切断ボタン）
- Test: API-01〜API-04, AUTH-02, S-01

---

### US-02: Oura接続を解除する（Must）

**ゴール:** Oura接続を切断でき、トークンが削除されるが既存データは保持される

**実装対象:**
- API 新規: DELETE `/api/v1/oura/connection`
- UI 変更: Oura接続設定画面に切断ボタン + 確認ダイアログ追加
- Test: API-04, S-02

**前のストーリーとの差分:**
- US-01のOura接続設定画面に切断機能を追加

---

### US-03: メンタルスコアを入力する（Must）

**ゴール:** 4軸×7段階のスライダーでメンタルスコアを保存でき、日次サマリーに遷移する

**実装対象:**
- API 新規: POST `/api/v1/mental-entries`
- DB: daily_records 自動作成ロジック（メンタル入力時にdaily_recordが未存在なら作成）
- UI 新規: メンタルスコア入力画面（4スライダー + 保存ボタン）
- Test: API-05, API-07, S-03

**注意:**
- daily_records の (user_id, record_date) UNIQUE制約で重複防止
- 当日のみ新規作成可。未来日付は拒否（422）
- 既存ありの場合は409

---

### US-04: 過去のメンタルスコアを修正する（Must）

**ゴール:** 過去のメンタルエントリを編集でき、更新値が反映される

**実装対象:**
- API 新規: GET `/api/v1/mental-entries/{record_date}`, PATCH `/api/v1/mental-entries/{record_date}`
- UI 変更: メンタルスコア入力画面を編集モード対応（既存値プリセット）
- Test: API-06, S-04

**前のストーリーとの差分:**
- US-03のメンタル入力画面を新規/編集の両モード対応に拡張
- 変更なし保存時はupdated_at不変

---

## フェーズ2: データ表示

### US-05: 日次サマリーを確認する（Must）

**ゴール:** 特定日のメンタル + フィジカルが統合表示され、Z-scoreで個人ベースラインからの偏差がわかる

**実装対象:**
- API 新規: GET `/api/v1/daily-records/{record_date}`
- 計算ロジック 新規: Z-score正規化（14日移動平均基準）
- UI 新規: 日次サマリー画面（メンタル上部 → フィジカル下部、主観ファースト原則）
- Test: API-08, S-05

**計算ロジック詳細:**
- `z = (当日の値 − 直近14日移動平均) / 直近14日標準偏差`
- 14日未満: z_scores = null（生値のみ表示）
- 標準偏差0の軸: z_scores = null（「変動なし」表示）
- mental_entry / physical_score が null の場合もレスポンス返却（200、中身null）

---

### US-06: トレンドダッシュボードで心身の推移を確認する（Must）

**ゴール:** 14日間の統合トレンドグラフが表示され、Strain/Recoveryの2軸と相関パターンが確認できる

**実装対象:**
- API 新規: GET `/api/v1/trends?window=14`
- 計算ロジック 新規: Strain/Recovery合成、相関パターン抽出
- UI 新規: トレンドダッシュボード画面（統合グラフ、カラーゾーン、相関テキスト、メンタル入力CTA）
- Test: API-09, S-06

**計算ロジック詳細:**
- Strain = stress_z（単軸）
- Recovery = avg(mood_z, energy_z, sleep_score_z, readiness_score_z, hrv_rmssd_z)
- 相関: Pearson |r| ≥ 0.5 のペアを抽出 → 観察的テンプレートで文章化。**30日未満のデータでは空配列**
- today_mental_submitted フラグ（CTA表示判定）
- oura_connected フラグ（未接続案内判定）

**前のストーリーとの差分:**
- US-05のZ-scoreロジックを再利用・拡張

---

### US-07: トレンドの時間窓を切り替える（Must）

**ゴール:** 7日/14日/30日の切替UIでグラフ期間を変更できる

**実装対象:**
- API 変更: GET `/api/v1/trends` の window パラメータに 7, 30 を追加（14はUS-06で実装済み）
- UI 変更: トレンドダッシュボードに時間窓切替UI（3ボタン、ハイライト）
- Test: S-07

**前のストーリーとの差分:**
- US-06のトレンドAPIとUIにwindow切替を追加
- Z-score計算基準は14日固定（変更なし）

---

### US-08: ダッシュボードから日次サマリーにドリルダウンする（Must）

**ゴール:** トレンドグラフ上の日付タップで日次サマリーに遷移し、戻れる

**実装対象:**
- API: なし（US-05の GET `/api/v1/daily-records/{record_date}` を再利用）
- UI 変更: トレンドダッシュボードのデータポイントにタップイベント追加、日次サマリーへのルーティング
- UI 変更: 日次サマリーに「戻る」ナビゲーション追加
- Test: S-08

**前のストーリーとの差分:**
- US-05の日次サマリー画面に「戻る」操作を追加
- US-06のトレンドグラフにクリック/タップハンドラ追加

---

## 実装体積サマリー

| フェーズ | US | API新規 | 計算ロジック | 画面新規 | 推定規模 |
|:---:|---|:---:|:---:|:---:|---|
| 0 | 基盤 | 3（auth系） | — | — | 中 |
| 1 | US-01 | 4 | — | 1 | 大 |
| 1 | US-02 | 1 | — | — | 小 |
| 1 | US-03 | 1 | daily_record自動生成 | 1 | 中 |
| 1 | US-04 | 2 | — | — | 小 |
| 2 | US-05 | 1 | Z-score正規化 | 1 | 中 |
| 2 | US-06 | 1 | Strain/Recovery + 相関 | 1 | 大 |
| 2 | US-07 | — | — | — | 小 |
| 2 | US-08 | — | — | — | 小 |

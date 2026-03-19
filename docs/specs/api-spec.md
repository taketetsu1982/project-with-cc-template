# API Spec

> エンドポイント定義。認証・認可は auth-spec.md を参照。

**バージョン:** 0.2
**ステータス:** Draft
**最終更新:** 2026-03-19
**導出元:** docs/specs/db-schema.md, docs/reqs/conceptual-model.md, docs/reqs/product-model.json, docs/reqs/prd.md, docs/reqs/user-stories.md

---

## 共通仕様

### 認証
- 公開エンドポイント: `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `POST /api/v1/auth/refresh`, `GET /api/v1/oura/callback`
- それ以外: `Authorization: Bearer <access_token>` 必須

### レスポンス形式
- Content-Type: `application/json`
- 日時: ISO 8601（例: `2026-03-19T09:00:00+09:00`）
- 日付: ISO 8601（例: `2026-03-19`）
- ID: UUID v4
- 削除成功: 204 No Content

### エラーレスポンス
```json
{ "detail": "エラーメッセージ" }
```

バリデーションエラー（422）:
```json
{
  "detail": [
    {
      "field": "mood",
      "message": "1〜7の整数値を指定してください"
    }
  ]
}
```

### ページネーション
PG1では不要。最大30日分のデータを一括取得するため、ページネーションは導入しない。

---

## 設計原則

- REST準拠・リソース指向URL
- 末尾スラッシュなし
- ネストは2階層まで、フラット優先
- daily_recordsはデータ取得/入力時に自動作成（明示的なCREATE APIなし）
- physical_scoresはOura API同期で作成（ユーザー直接操作なし）

---

## エンドポイント一覧

### Oura接続 (OuraConnection)

**対応PRD機能:** Ouraデータ連携

| メソッド | パス | 概要 | 認可 | 備考 |
|---------|------|------|------|------|
| GET | `/api/v1/oura/connection` | Oura接続状態を取得 | SelfTracker | US-01, US-02 |
| POST | `/api/v1/oura/authorize` | OAuth2認証フローを開始（認証URLを返却） | SelfTracker | US-01 |
| GET | `/api/v1/oura/callback` | OAuth2コールバック（トークン取得・保存） | public | US-01 |
| DELETE | `/api/v1/oura/connection` | Oura接続を解除 | SelfTracker | US-02 |
| POST | `/api/v1/oura/sync` | Ouraデータの手動同期をトリガー | SelfTracker | US-01 |

---

#### GET `/api/v1/oura/connection`

Oura APIとの接続状態を取得する。

**レスポンス 200:**
```json
{
  "connected": true,
  "token_expires_at": "2026-03-20T09:00:00Z"
}
```

**レスポンス 200（未接続時）:**
```json
{
  "connected": false,
  "token_expires_at": null
}
```

---

#### POST `/api/v1/oura/authorize`

Oura OAuth2認証フローを開始し、認証URLを返却する。

**レスポンス 200:**
```json
{
  "authorize_url": "https://cloud.ouraring.com/oauth/authorize?client_id=...&redirect_uri=...&response_type=code&state=..."
}
```

---

#### GET `/api/v1/oura/callback`

Oura OAuth2コールバック。認証コードを受け取り、トークンを取得・保存する。
認証成功後、フロントエンドのOura接続設定画面にリダイレクトする。

**クエリパラメータ:**

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|:---:|------|
| `code` | string | o | OAuth2認証コード |
| `state` | string | o | CSRF防止用state |
| `error` | string | - | OAuth2エラーコード（認証キャンセル時） |

**レスポンス:** フロントエンドへの302リダイレクト

**エラーケース:**
- 認証キャンセル: フロントエンドにエラーパラメータ付きでリダイレクト
- state不一致: 400 Bad Request
- トークン取得失敗: フロントエンドにエラーパラメータ付きでリダイレクト

---

#### DELETE `/api/v1/oura/connection`

Oura接続を解除し、保存されたトークン情報を削除する。既に取得済みのフィジカルデータは保持される。

**レスポンス:** 204 No Content

**エラーケース:**
- 未接続状態で実行: 404 Not Found

---

#### POST `/api/v1/oura/sync`

Ouraデータの同期をトリガーする。未取得の日次フィジカルデータをOura APIから取得し、daily_records・physical_scoresを自動作成/更新する。

**リクエストボディ（任意）:**
```json
{
  "start_date": "2026-03-01",
  "end_date": "2026-03-19"
}
```
省略時は直近7日間を同期する。

**レスポンス 200:**
```json
{
  "synced_days": 7,
  "start_date": "2026-03-13",
  "end_date": "2026-03-19"
}
```

**エラーケース:**
- Oura未接続: 400 `{"detail": "Oura APIが接続されていません"}`
- Oura APIエラー: 502 `{"detail": "Oura APIとの通信に失敗しました"}`
- トークン期限切れ（リフレッシュ失敗）: 401 `{"detail": "Oura接続の再認証が必要です"}`

---

### メンタルエントリ (MentalEntry)

**対応PRD機能:** メンタルスコア入力

| メソッド | パス | 概要 | 認可 | 備考 |
|---------|------|------|------|------|
| POST | `/api/v1/mental-entries` | 当日のメンタルスコアを新規作成 | SelfTracker | US-03 |
| GET | `/api/v1/mental-entries/{record_date}` | 指定日のメンタルエントリを取得 | SelfTracker | US-04, US-05 |
| PATCH | `/api/v1/mental-entries/{record_date}` | 指定日のメンタルスコアを更新 | SelfTracker | US-04 |
| DELETE | `/api/v1/mental-entries/{record_date}` | 指定日のメンタルエントリを削除 | SelfTracker | — |

---

#### POST `/api/v1/mental-entries`

当日のメンタルスコアを新規作成する。daily_recordが未作成の場合は自動作成する。

**リクエストボディ:**
```json
{
  "mood": 5,
  "energy": 4,
  "stress": 3,
  "focus": 6
}
```

| フィールド | 型 | 必須 | 制約 | 説明 |
|-----------|---|:---:|------|------|
| `mood` | integer | o | 1〜7 | 気分（Valence） |
| `energy` | integer | o | 1〜7 | エネルギー（Arousal） |
| `stress` | integer | o | 1〜7 | ストレス（主観的負荷感） |
| `focus` | integer | o | 1〜7 | 集中（認知パフォーマンス） |

**レスポンス 201:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "daily_record_id": "660e8400-e29b-41d4-a716-446655440000",
  "record_date": "2026-03-19",
  "mood": 5,
  "energy": 4,
  "stress": 3,
  "focus": 6,
  "created_at": "2026-03-19T08:30:00Z",
  "updated_at": "2026-03-19T08:30:00Z"
}
```

**エラーケース:**
- 当日分が既に存在: 409 `{"detail": "本日のメンタルエントリは既に登録されています"}`
- バリデーション失敗: 422（値が1〜7の範囲外、必須フィールド欠落）

**業務ルール:**
- 当日分のみ新規作成可能。未来の日付は不可
- 4軸すべて必須

---

#### GET `/api/v1/mental-entries/{record_date}`

指定日のメンタルエントリを取得する。

**パスパラメータ:**

| パラメータ | 型 | 説明 |
|-----------|---|------|
| `record_date` | date (YYYY-MM-DD) | 対象日付 |

**レスポンス 200:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "daily_record_id": "660e8400-e29b-41d4-a716-446655440000",
  "record_date": "2026-03-19",
  "mood": 5,
  "energy": 4,
  "stress": 3,
  "focus": 6,
  "created_at": "2026-03-19T08:30:00Z",
  "updated_at": "2026-03-19T08:30:00Z"
}
```

**エラーケース:**
- メンタルエントリなし: 404

---

#### PATCH `/api/v1/mental-entries/{record_date}`

指定日のメンタルスコアを更新する。部分更新を許可する。

**パスパラメータ:**

| パラメータ | 型 | 説明 |
|-----------|---|------|
| `record_date` | date (YYYY-MM-DD) | 対象日付 |

**リクエストボディ（部分更新可）:**
```json
{
  "stress": 2
}
```

**レスポンス 200:** （POST時と同一構造。更新後の全フィールドを返却）

**エラーケース:**
- メンタルエントリなし: 404
- バリデーション失敗: 422

**業務ルール:**
- 変更がない場合、updated_atは更新しない

---

#### DELETE `/api/v1/mental-entries/{record_date}`

指定日のメンタルエントリを論理削除する。

**パスパラメータ:**

| パラメータ | 型 | 説明 |
|-----------|---|------|
| `record_date` | date (YYYY-MM-DD) | 対象日付 |

**レスポンス:** 204 No Content

**エラーケース:**
- メンタルエントリなし: 404

---

### 日次サマリー (DailyRecord)

**対応PRD機能:** 日次サマリー

| メソッド | パス | 概要 | 認可 | 備考 |
|---------|------|------|------|------|
| GET | `/api/v1/daily-records/{record_date}` | 指定日の日次サマリーを取得 | SelfTracker | US-05, US-08 |

---

#### GET `/api/v1/daily-records/{record_date}`

指定日のフィジカルスコア・メンタルエントリを統合した日次サマリーを取得する。Z-score正規化値を含む。

**パスパラメータ:**

| パラメータ | 型 | 説明 |
|-----------|---|------|
| `record_date` | date (YYYY-MM-DD) | 対象日付 |

**レスポンス 200:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "record_date": "2026-03-19",
  "mental_entry": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "mood": 5,
    "energy": 4,
    "stress": 3,
    "focus": 6,
    "z_scores": {
      "mood": 0.5,
      "energy": -0.3,
      "stress": -1.2,
      "focus": 0.8
    },
    "created_at": "2026-03-19T08:30:00Z",
    "updated_at": "2026-03-19T08:30:00Z"
  },
  "physical_score": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "sleep_score": 85,
    "readiness_score": 78,
    "activity_score": 72,
    "hrv_rmssd": 45.2,
    "resting_heart_rate": 58.0,
    "z_scores": {
      "sleep_score": 0.3,
      "readiness_score": -0.1,
      "activity_score": -0.5,
      "hrv_rmssd": 1.1,
      "resting_heart_rate": -0.2
    },
    "created_at": "2026-03-19T06:00:00Z",
    "updated_at": "2026-03-19T06:00:00Z"
  },
  "created_at": "2026-03-19T06:00:00Z",
  "updated_at": "2026-03-19T08:30:00Z"
}
```

**レスポンス構造の注意点:**
- `mental_entry`: メンタル未入力の場合は `null`
- `physical_score`: Oura未接続またはデータ未取得の場合は `null`
- `z_scores`: 14日分のデータが蓄積されていない場合は `null`。標準偏差が0の軸も `null`
- 主観ファースト原則に基づき、`mental_entry` を `physical_score` より先に配置する

**エラーケース:**
- daily_recordが存在しない日: 404

---

### トレンド (Trend)

**対応PRD機能:** トレンドダッシュボード

| メソッド | パス | 概要 | 認可 | 備考 |
|---------|------|------|------|------|
| GET | `/api/v1/trends` | トレンドデータを一括取得 | SelfTracker | US-06, US-07 |

---

#### GET `/api/v1/trends`

指定期間のdaily_records + physical_scores + mental_entriesをZ-score正規化値付きで一括取得する。

**クエリパラメータ:**

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|---|:---:|----------|------|
| `window` | integer | - | `14` | 時間窓（日数）。`7`, `14`, `30` のいずれか |

**レスポンス 200:**
```json
{
  "window": 14,
  "start_date": "2026-03-06",
  "end_date": "2026-03-19",
  "total_days": 14,
  "days_with_mental": 12,
  "days_with_physical": 14,
  "today_mental_submitted": true,
  "oura_connected": true,
  "records": [
    {
      "record_date": "2026-03-06",
      "mental_entry": {
        "mood": 4,
        "energy": 5,
        "stress": 4,
        "focus": 5,
        "z_scores": {
          "mood": -0.3,
          "energy": 0.2,
          "stress": 0.1,
          "focus": 0.0
        }
      },
      "physical_score": {
        "sleep_score": 80,
        "readiness_score": 75,
        "activity_score": 68,
        "hrv_rmssd": 42.0,
        "resting_heart_rate": 60.0,
        "z_scores": {
          "sleep_score": -0.2,
          "readiness_score": -0.4,
          "activity_score": -0.8,
          "hrv_rmssd": 0.5,
          "resting_heart_rate": 0.3
        }
      }
    }
  ],
  "correlations": [
    {
      "observation": "睡眠スコアが高い日はストレスが低い傾向があります",
      "metric_a": "sleep_score",
      "metric_b": "stress",
      "direction": "negative"
    }
  ]
}
```

**レスポンス構造の注意点:**
- `records`: 期間内の全日分を日付昇順で返却。daily_recordが存在しない日は含まない
- `records[].mental_entry`: メンタル未入力の日は `null`
- `records[].physical_score`: フィジカルデータ未取得の日は `null`
- `z_scores`: 14日分のデータが蓄積されていない場合は `null`。標準偏差が0の軸も `null`
- `today_mental_submitted`: 今日のメンタルエントリ入力済みフラグ（CTA表示判定用）
- `oura_connected`: Oura接続状態（未接続時の案内表示判定用）
- `correlations`: 観察的表現による相関パターン。データ不足時は空配列。処方箋ではなく観察として提示する

**エラーケース:**
- window値が不正: 422 `{"detail": "windowは7, 14, 30のいずれかを指定してください"}`

**Z-score正規化の計算ルール:**
- `z = (当日の値 − 個人の14日移動平均) / 個人の標準偏差`
- 計算基準（14日移動平均）はwindow切替に関わらず固定
- 14日分のデータが蓄積されていない場合、z_scoresは `null`
- 標準偏差が0の軸（全日同一値）は `null`

---

## エラーハンドリング方針

- スコープ外のリソースは存在を開示しない（404）
- バリデーション失敗（422）と業務ルール違反（400/409）を区別する
  - **422 Unprocessable Entity**: フィールドの型・範囲等のバリデーション失敗
  - **400 Bad Request**: 業務ルール違反（例: Oura未接続で同期実行）
  - **409 Conflict**: リソースの重複（例: 当日のメンタルエントリが既存）

### HTTPステータスコード一覧

| コード | 用途 |
|--------|------|
| 200 | 正常取得・更新 |
| 201 | 正常作成 |
| 204 | 正常削除 |
| 400 | 業務ルール違反 |
| 401 | 認証エラー |
| 404 | リソース不存在 |
| 409 | リソース重複 |
| 422 | バリデーションエラー |
| 502 | 外部API（Oura）エラー |

---

## 命名規則

- URL: kebab-case（例: `/api/v1/daily-records`, `/api/v1/mental-entries`）
- リクエスト/レスポンスフィールド: snake_case（例: `sleep_score`, `record_date`）
- パスパラメータ: snake_case（例: `record_date`）
- 日付パスパラメータ: YYYY-MM-DD形式（例: `2026-03-19`）

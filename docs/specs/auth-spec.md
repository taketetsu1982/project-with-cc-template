# Auth Spec

> 認証・認可フローの定義。api-spec.md はこのドキュメントを参照する。

**バージョン:** 0.4
**ステータス:** Draft
**最終更新:** 2026-03-21
**導出元:** docs/reqs/product-model.json（actors）, docs/reqs/prd.md

---

## 認証方式

PG1は単一ユーザー（自分自身）のみ。JWT（JSON Web Token）ベースの認証を採用する。
マルチユーザー対応はPG1スコープ外のため、登録・ログインは最小限の実装とする。

| トークン | 有効期限 | 保存先 |
|---------|---------|--------|
| Access Token (JWT) | 1時間 | フロントエンド（メモリ。XSS対策のためsessionStorageは使用しない） |
| Refresh Token | 7日 | HttpOnly Cookie |

**注意:** Oura OAuth2トークンは別管理。`oura_connections` テーブルに保存する。

---

## 認証フロー

### 新規登録
```
POST /api/v1/auth/register  (public)
```
PG1では初回セットアップ時に1回のみ使用。メールアドレス + パスワードで登録。

### ログイン
```
POST /api/v1/auth/login  (public)
```
メールアドレス + パスワードで認証。Access Token + Refresh Token を返却。

### トークンリフレッシュ
```
POST /api/v1/auth/refresh  (public)
```
Refresh Token（HttpOnly Cookie）を使用してAccess Tokenを再発行。

---

## 認可

### ロール設計

| ロール | 想定ユーザー | 権限の特徴 |
|--------|-------------|----------|
| SelfTracker | Oura Ring所有者（自分自身） | 自分のデータに対するフルアクセス。PhysicalScoreはRead Only |

### 権限マトリクス

product-model.json の actors[].touches から導出。

| リソース | SelfTracker |
|---------|:-:|
| User | R, U（own） |
| OuraConnection | C, R, U, D（own） |
| DailyRecord | C, R（own） |
| PhysicalScore | R（own） |
| MentalEntry | C, R, U, D（own） |

**PhysicalScoreの書き込み制限:** PhysicalScoreはOura API同期でのみ作成・更新される。ユーザーからの直接的なPOST/PUT/DELETEリクエストは拒否する（403）。

---

## スコープ設計

### テナントスコープ
PG1は単一ユーザーのため、テナント分離は不要。全APIで認証済みユーザーのデータのみ返却する（`WHERE user_id = :current_user_id`）。

### Oura OAuth2スコープ
Oura APIへのアクセス時に必要なOAuth2スコープ:
- `daily` — 日次サマリーデータ（Sleep Score, Readiness Score, Activity Score）
- `heartrate` — 心拍数データ（HRV, 安静時心拍数）
- `sleep` — 睡眠ステージ比率

---

## セキュリティ要件

- パスワードはbcrypt（cost factor 12）でハッシュ化して保存
- Access Token（JWT）は HS256 署名。ペイロードは `sub`（ユーザーID）、`iat`、`exp` の標準クレームのみ（機密情報を含めない）
- Refresh TokenはHttpOnly + Secure + SameSite=Strict Cookieで送信
- Oura OAuth2のstateパラメータでCSRF攻撃を防止。stateは `{user_id}:{ランダム文字列}` の形式でDBに一時保存（TTL 10分。アプリケーション層で期限切れを判定し、古いレコードは定期的に削除する）。callbackでstateを照合し、user_idを特定してトークンを保存する。PG1ではRedis等のキャッシュサービスは導入せず、DBで完結させる
- Oura APIのaccess_token / refresh_tokenはアプリケーション層でAES-256-GCMで暗号化してDBに保存。暗号化キーは環境変数 `OURA_TOKEN_ENCRYPTION_KEY` で管理する

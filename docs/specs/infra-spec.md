# Infra Spec

> 検証環境のインフラ構成定義。ローカル開発・検証に必要な最小構成。

**バージョン:** 0.1
**ステータス:** Draft
**最終更新:** 2026-03-21
**導出元:** docs/specs/db-schema.md, docs/specs/api-spec.md, docs/specs/auth-spec.md, docs/specs/ui-spec.md

---

## 方針

PG1はCPF検証（個人利用）のため、クラウドデプロイは行わない。Docker Composeによるローカル完結環境を構築する。

---

## サービス構成

```
┌─────────────────────────────────────┐
│           docker-compose            │
│                                     │
│  ┌──────────┐  ┌──────────────────┐ │
│  │ frontend │  │     backend      │ │
│  │ :3000    │──│ :8000            │ │
│  └──────────┘  └────────┬─────────┘ │
│                         │           │
│                  ┌──────┴─────┐     │
│                  │     db     │     │
│                  │ PostgreSQL │     │
│                  │ :5432      │     │
│                  └────────────┘     │
└─────────────────────────────────────┘
         │
         │ OAuth2
         ▼
   Oura Cloud API
```

### サービス一覧

| サービス | イメージ | ポート | 役割 |
|---------|---------|--------|------|
| `db` | `postgres:16-alpine` | 5432 | データベース。db-schema.md の5テーブルを管理 |
| `backend` | Python 3.12 | 8000 | REST API（api-spec.md）。JWT認証（auth-spec.md） |
| `frontend` | Node 20 | 3000 | SPA（ui-spec.md）。backend への API プロキシ |

---

## データベース

- エンジン: PostgreSQL 16
- DB名: `oura_dashboard`
- テストDB名: `oura_dashboard_test`
- マイグレーション: Alembic（`backend/migrations/`）
- ボリューム: named volume `db-data` でデータ永続化

---

## 環境変数

### backend

| 変数名 | 説明 | デフォルト |
|--------|------|----------|
| `DATABASE_URL` | PostgreSQL接続文字列 | `postgresql://postgres:postgres@db:5432/oura_dashboard` |
| `SECRET_KEY` | JWT署名キー | （開発用固定値） |
| `OURA_CLIENT_ID` | Oura OAuth2 Client ID | — |
| `OURA_CLIENT_SECRET` | Oura OAuth2 Client Secret | — |
| `OURA_REDIRECT_URI` | OAuth2コールバックURL | `http://localhost:8000/api/v1/oura/callback` |
| `FRONTEND_URL` | フロントエンドURL（リダイレクト先） | `http://localhost:3000` |

### frontend

| 変数名 | 説明 | デフォルト |
|--------|------|----------|
| `API_BASE_URL` | バックエンドAPIのベースURL | `/api/v1`（プロキシ経由） |

---

## 外部依存

| サービス | 用途 | 備考 |
|---------|------|------|
| Oura Cloud API | フィジカルデータ取得・OAuth2認証 | 開発時はモックサーバーで代替可。テスト時は必須でモック |

---

## Makefileコマンド

| コマンド | 動作 |
|---------|------|
| `make up` | `docker compose up -d` 全サービス起動 |
| `make down` | `docker compose down` 停止 |
| `make migrate` | backend コンテナ内で Alembic マイグレーション実行 |
| `make test` | テストDB作成 → マイグレーション → テスト実行 |
| `make lint` | backend + frontend の Lint 実行 |
| `make format` | backend + frontend のフォーマット実行 |

---

## スコープ外

- クラウドデプロイ（AWS/GCP等）
- CI/CDパイプライン
- HTTPS / ドメイン設定
- ログ集約基盤
- バックアップ・リストア

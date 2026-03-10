# {プロジェクト名}

{1行の概要}

## モジュール構成

```
{project_root}/
├── backend/          # {バックエンドフレームワーク}
│   ├── app/
│   ├── migrations/
│   └── tests/
├── frontend/         # {フロントエンドフレームワーク}
│   └── src/
├── docs/
│   ├── reqs/         # 企画（canonical）: product-goals / pg0 / mrd / prd / conceptual-model / user-stories
│   └── specs/        # 設計（導出）: db-schema / api-spec / auth-spec / ui-spec / analytics-spec / test-spec
├── .claude/
│   ├── rules/        # 開発ルール
│   └── teams/        # Agent Teams 定義
└── docker-compose.yml
```

## Docs map

### 企画（reqs/ — canonical）
- Product Goals（一覧・確信度）: @docs/reqs/product-goals.md
- PG0: @docs/reqs/pg0.md
- 市場・ユーザー定義: @docs/reqs/mrd.md
- 提供価値・機能定義: @docs/reqs/prd.md
- 概念モデル: @docs/reqs/conceptual-model.md
- ユーザーストーリー: @docs/reqs/user-stories.md

### 設計（specs/ — reqs/ から導出）
- DB設計: @docs/specs/db-schema.md
- API設計: @docs/specs/api-spec.md
- 認証・認可: @docs/specs/auth-spec.md
- UI実装仕様: @docs/specs/ui-spec.md
- 計測設計: @docs/specs/analytics-spec.md
- テスト仕様: @docs/specs/test-spec.md

### ドキュメントの流れ
```
reqs/product-goals（PG一覧・確信度）
        ↓
reqs/pg0 ⇔ reqs/prd（WHO:User, WHY, WHAT） ⇔ reqs/mrd（WHERE, WHO:Buyer, HOW MUCH）
                          ↓
                reqs/conceptual-model ← cm-review（デザイン×テクニカル）
                          ↓
                reqs/user-stories → specs/test-spec
                          ↓
                specs/db-schema, api-spec, auth-spec, ui-spec, analytics-spec
```

## Agent Teams

| チーム | 用途 | 構成 |
|---|---|---|
| mrd-planning | MRD企画 | 対話・調査・分析 |
| mrd-review | MRDレビュー | 顧客・市場・競合 |
| prd-planning | PRD企画 | 対話・PRD構造化・モデリング |
| prd-review | PRDレビュー | UX・技術・スコープ |
| cm-review | 概念モデルレビュー | デザイン・テクニカル・cm-writer |
| specs-planning | Specs設計 | バックエンド・デザイン・PdM |
| specs-review | Specsレビュー | 技術・機能・統合 |
| pr-review | PRレビュー | セキュリティ・パフォーマンス・テスト |

## Workflows

- 実装計画: `.claude/rules/impl-planning.md`（ストーリー単位のタスク分解）
- テスト実行: `.claude/rules/test-execution.md`（Specs整合性→シナリオテスト）

## コマンド

### Docker（推奨）

```bash
make up          # 全サービス起動
make down        # 停止
make migrate     # マイグレーション実行
make test        # テスト実行
make lint        # Lint
make format      # フォーマット
```

## Gotchas

{プロジェクト固有の注意点をここに記載}

## 環境変数

{必要な環境変数をここに記載}

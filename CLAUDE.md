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
│   ├── reqs/         # 企画（canonical）: product-goals / pg{num} / mrd / prd / conceptual-model / user-stories
│   └── specs/        # 設計（導出）: db-schema / api-spec / auth-spec / ui-spec / analytics-spec / infra-spec / test-spec
├── .claude/
│   ├── rules/        # 開発ルール
│   ├── skills/        # Skills 定義
│   └── teams/        # Agent Teams 定義
└── docker-compose.yml
```

## Docs map

### 企画（reqs/ — canonical）
- Product Goals（一覧・確信度）: @docs/reqs/product-goals.md
- PG{num}: @docs/reqs/pg{num}.md
- 市場・ユーザー定義: @docs/reqs/mrd.md
- 提供価値・機能定義: @docs/reqs/prd.md
- 概念モデル（設計意図）: @docs/reqs/conceptual-model.md
- 概念モデル（統合JSON）: @docs/reqs/conceptual-model.json — entities/actors/composites/screens/navigation
- ユーザーストーリー: @docs/reqs/user-stories.md

### 設計（specs/ — reqs/ から導出）
- DB設計: @docs/specs/db-schema.md
- API設計: @docs/specs/api-spec.md
- 認証・認可: @docs/specs/auth-spec.md
- UI実装仕様: @docs/specs/ui-spec.md
- 計測設計: @docs/specs/analytics-spec.md
- 検証環境のインフラ構成定義: @docs/specs/infra-spec.md
- テスト仕様: @docs/specs/test-spec.md
- US単位の実装順序・依存関係・タスクカード: @docs/specs/impl-plan.md

### 企画・設計・開発の流れ
```
Product Goals（Fit Journeyごとのゴールとドキュメントの確信度を管理）
        ↓
企画（req/）
        ↓
設計（specs/）
        ↓
開発・実装（backend/, frontend/）
        ↓
テスト・人間の確認
        ↓
次のProduct Goalsへ
```

- **Fit Journey に沿って進む。** PMF（プロダクト・マーケット・フィット）に至るまでの仮説検証を段階的に進める。「今のフェーズで何をどこまで書くか」を確信度で管理し、全部一気に書かない。不確かな段階に深く書き過ぎない。
- **アジャイルに動く。** ドキュメントは一度書いたら固定ではなく確信度で決める。学びが得られるたびに上流から更新し、下流に伝播させる。ドキュメントもアジャイルにアップデートをする。
- **実装は作り変えることも想定する。** 仮説検証しながらフェーズを進めていくため、開発済の機能を固定化しすぎず、必要であれば設計し直して作り変える。

## Agent Teams

| チーム | 用途 | 構成 |
|---|---|---|
| plan-mrd | MRD企画 | 対話・調査・分析 |
| review-mrd | MRDレビュー | 顧客・市場・競合 |
| plan-prd | PRD企画 | 対話・PRD構造化・モデリング |
| review-prd | PRDレビュー | UX・技術・スコープ |
| review-model | 概念モデルレビュー | デザイン・テクニカル・cm-writer |
| plan-specs | Specs設計 | バックエンド・デザイン・PdM |
| review-specs | Specsレビュー | 技術・機能・統合 |
| review-code | コードレビュー | Code Quality・Performance・UI Consistency |

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

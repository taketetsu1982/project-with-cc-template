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
│   ├── reqs/         # 企画: product-goals / pg{num} / mrd / prd / conceptual-model / user-stories
│   ├── specs/        # 設計（CC自動生成 + 人間微調整）: db-schema / api-spec / auth-spec / ui-spec / etc.
│   └── whiteboard/   # ストーリー実装時の共有ホワイトボード: {US-ID}.md
├── .claude/
│   ├── rules/        # 開発ルール
│   ├── skills/        # Skills 定義
│   └── teams/        # Agent Teams 定義
└── docker-compose.yml
```

## Docs map

### 企画（reqs/）
- Product Goals（一覧・ドキュメントマップ・確信度）: @docs/reqs/product-goals.md
- PG{num}: @docs/reqs/pg{num}.md
- 市場・ユーザー定義: @docs/reqs/mrd.md
- 提供価値・機能定義: @docs/reqs/prd.md
- 概念モデル（CC自動生成、JSONが正）: @docs/reqs/conceptual-model.md
- 概念モデル（統合JSON）: @docs/reqs/product-model.json — entities/actors/screens(type: screen|composite)/transitions
- ユーザーストーリー: @docs/reqs/user-stories.md
- 設計原則の詳細定義（オプション）: @docs/reqs/design-details.md

### 設計（specs/ — CC自動生成 + 人間微調整）
- DB設計: @docs/specs/db-schema.md — CC自動生成
- API設計: @docs/specs/api-spec.md — CC自動生成
- 認証・認可: @docs/specs/auth-spec.md — CC自動生成
- UI実装仕様: @docs/specs/ui-spec.md — 人間主導
- 計測設計: @docs/specs/analytics-spec.md — 人間主導
- 検証環境のインフラ構成定義: @docs/specs/infra-spec.md — 人間主導
- テスト仕様: @docs/specs/test-spec.md — CC自動生成
- 実装計画: @docs/specs/impl-plan.md — CC自動生成

### 企画・設計・開発の流れ
```
         reqs（企画）
        ↗        ↘
   実装  ⇄  specs（設計）
```

- **三角形ループで回す。** reqs・specs・実装はどの頂点からでも始められる。プロトタイプから学んでreqsを更新する、specsを書きながらreqsの矛盾に気づく、いずれも正当なフロー。
- **Fit Journey に沿って進む。** PMF（プロダクト・マーケット・フィット）に至るまでの仮説検証を段階的に進める。「今のフェーズでどのドキュメントが必要か」をドキュメントマップ（product-goals.md）で管理し、不要なものは作らない。
- **CCが生成し、人間が微調整する。** specsはCCが `product-model.json` 等から自動生成する。人間は意思決定とレビューに集中する。人間の判断は `<!-- human-decision -->` マーカーで保護。
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
| review-code | コードレビュー | Code Quality & Security・Performance・Design Consistency |
| impl | ストーリー実装 | UIデザイナー(Lead)・FE・BE・QA（実装Mode/テストModeの2モード構成） |

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

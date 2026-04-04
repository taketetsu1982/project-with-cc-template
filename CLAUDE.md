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
│   ├── reqs/         # 企画: product-goals / pg{num} / mrd / prd / product-model.json / user-stories
│   └── specs/        # 設計（CC生成 + 人間微調整）: db-schema / api-spec / auth-spec / ui-spec / etc.
├── content/
│   ├── plans/        # ブログ戦略・テーマ計画
│   └── articles/     # 記事（Markdown）
├── .claude/
│   ├── rules/        # 常時適用ガードレール
│   ├── skills/       # プロセスごとの手順書
│   └── agents/       # サブエージェント
└── docker-compose.yml
```

## 開発の流れ

```
企画(reqs) ──→ 設計(specs) ──→ 実装 ──→ テスト
```

- **ドキュメントファースト。** 企画→設計→実装の順で進める。オーケストレーションは人間が行う
- **Fit Journey に沿って進む。** フェーズごとに必要なドキュメントだけ作る（product-goals.md で管理）
- **CCが生成し、人間が判断する。** specsはCCが生成。人間の判断は `<!-- human-decision -->` で保護
- **product-model.json が概念の正。** エンティティ・画面の追加はJSONを先に更新する

## Skills（プロセスの道具箱）

### セットアップ

| スキル | 用途 |
|---|---|
| `/setup-project` | プロジェクト初期構成の一括セットアップ |

### プロダクト開発

| スキル | 用途 |
|---|---|
| `/conceptual-model` | entities/actors 編集（HTMLエディタ） |
| `/screens` | screens/transitions 編集（HTMLエディタ） |
| `/story-gen` | PRD + 概念モデル → ユーザーストーリー生成 |
| `/spec-gen` | 企画書 → specs一式生成 + 整合性チェック |
| `/impl-plan` | ストーリー → タスクカード生成 |
| `/test-run` | test-specに基づくテスト実行 |

### ユーザーリサーチ

| スキル | 用途 |
|---|---|
| `/user-survey` | 大量ペルソナのアンケート調査（定量） |

### ブログ制作

| スキル | 用途 |
|---|---|
| `/outline` | 構成案作成（グローバル） |
| `/draft` | 構成案 + brand-voice → 記事執筆 |
| `/revise` | 推敲（グローバル） |
| `/fact-check` | 事実検証（グローバル） |
| `/sns` | SNS投稿文生成（グローバル） |

## コマンド

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

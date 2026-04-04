---
name: setup-project
description: このプロジェクトの .claude/ 初期構成を生成する
---

# /setup-project

新規プロジェクトで実行し、`.claude/` の初期構成をプロジェクトに合わせて生成する。
テンプレートのプレースホルダーを技術スタック・プロジェクト種別に応じて具体化する。

## Input

ユーザーから以下の情報を受け取る。引数がなければ質問する:

- プロジェクト名
- 技術スタック（言語、フレームワーク）
- プロジェクト種別（Webアプリ / API / コンテンツ / その他）
- 特別な要件があれば

## Execution Steps

### Step 1: 現状を確認する

- `CLAUDE.md` が既にカスタマイズされているか確認する
- `.claude/rules/` のファイルがプレースホルダー状態か確認する
- 既にカスタマイズ済みの場合は上書きせず、差分を提案する

### Step 2: CLAUDE.md を生成する

テンプレートの `{プレースホルダー}` を埋める:

- `{プロジェクト名}` → プロジェクト名
- `{1行の概要}` → プロジェクトの目的
- `{バックエンドフレームワーク}` → 技術スタック
- `{フロントエンドフレームワーク}` → 技術スタック
- コマンド（`make up` 等）をビルドツールに合わせる
- 300行以内に収める

### Step 3: rules/ のプレースホルダーを埋める

グローバルルール（`~/.claude/rules/`）の「プロジェクト別に定義すべき項目」を具体化する。
不明な点は仮の値を入れず `<!-- TODO: 要定義 -->` コメントを残す。

**`architecture.md`:**
- 技術スタック一覧と選定理由
- レイヤー構成（Clean Architecture, DDD等）
- ディレクトリ構造と各ディレクトリの役割
- API設計規約（REST/GraphQL、エンドポイント命名）
- 状態管理方針（フロントエンドの場合）
- DB・ORM・マイグレーション方針

**`coding-style.md`:**
- リンター・フォーマッター（Biome, ESLint, Prettier等）
- 型厳密度（any禁止、strictモード等）
- 命名規則（camelCase, snake_case等）
- ログ戦略（ログレベル、構造化ログ）
- 依存関係管理（パッケージ追加ルール、lockファイル）

**`security.md`:**
- 認証・認可方式（JWT, OAuth等）、セッション管理
- レート制限（エンドポイントごと）
- CSRF保護方式
- 依存パッケージ監査（脆弱性スキャンツール、頻度）
- アクセス制御（ロールベース権限設計）

**`testing.md`:**
- テストフレームワーク（Vitest, Jest, pytest等）
- カバレッジ目標
- テストファイル配置（コロケーション or 分離）
- テストデータ管理（ファクトリ関数、フィクスチャ）
- CI連携（実行タイミング、失敗時のブロック基準）

**`design.md`:**
- Design Systemの方向性を具体化
- Do/Don'tをプロジェクトに合わせる

**`brand-voice.md`**（コンテンツプロジェクトの場合）:
- ペルソナ（ターゲット読者の属性・知識レベル・課題）
- トーン・文体・人称
- プラットフォーム規定
- SEO方針
- ビジュアル方針

### Step 4: .claudeignore を生成する

技術スタックに応じた除外パターンを設定する。

```
# 依存
node_modules/
vendor/
.venv/

# ビルド成果物
dist/
build/
.next/
__pycache__/

# 環境・機密
.env
.env.*
*.pem
*.key

# その他
.git/
.DS_Store
```

### Step 5: settings.json を技術スタックに合わせる

`settings.json` の PostToolUse hooks を確認し、技術スタックに合わせて更新する。

**更新方針:**
- 使わない言語のフォーマッターを削除する（例: Python のみなら Prettier/gofmt は不要）
- 技術スタックのフォーマッターが未設定なら追加する
- matcher のファイルパターンをプロジェクトの拡張子に合わせる

**例: Python + FastAPI の場合:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(*.py)",
        "hooks": [{ "type": "command", "command": "python -m black $file" }]
      }
    ]
  }
}
```

### Step 6: ng-words.txt を生成する（コンテンツプロジェクトの場合）

コンテンツプロジェクトでは `.claude/hooks/ng-words.txt` にプロジェクト固有の禁止表現・表記揺れパターンを定義する。

```
# 表記揺れ（統一すべき表現）
{揺れパターン1}→{正しい表記}
{揺れパターン2}→{正しい表記}

# 禁止表現
{禁止表現1}
{禁止表現2}
```

Webアプリ / API プロジェクトではスキップする。

### Step 7: 結果報告

```
## /setup-project 結果

### 生成・更新したファイル
- CLAUDE.md: {新規生成 / 更新}
- rules/architecture.md: {埋めた項目の要約}
- rules/coding-style.md: {埋めた項目の要約}
- rules/security.md: {埋めた項目の要約}
- rules/testing.md: {埋めた項目の要約}
- rules/design.md: {埋めた項目の要約}
- rules/brand-voice.md: {コンテンツプロジェクトのみ}
- .claudeignore: {新規生成}
- settings.json: {更新した場合のみ}
- hooks/ng-words.txt: {コンテンツプロジェクトのみ}

### 未定義（TODO）
- {<!-- TODO --> を残した箇所の一覧}

### 次のステップ
- TODOを埋める
- 企画ドキュメントの作成に進む
```

## プロジェクト種別ごとの省略ガイド

| ファイル | Webアプリ | API | コンテンツ |
|---|---|---|---|
| architecture.md | 全項目 | 全項目 | 省略可 |
| coding-style.md | 全項目 | 全項目 | 省略可 |
| security.md | 全項目 | 全項目 | 省略可 |
| testing.md | 全項目 | 全項目 | 省略可 |
| design.md | 全項目 | 最小限（Do/Don'tのみ） | 省略可 |
| brand-voice.md | 省略可 | 省略可 | 全項目 |
| ng-words.txt | 省略 | 省略 | 生成 |
| workflow.md | そのまま | そのまま | そのまま |

「省略可」= プレースホルダーのまま残してよい。「省略」= スキップする。

## ルール

- グローバルの `~/.claude/rules/` と重複する内容は書かない
- 不明な点は仮の値を入れず `<!-- TODO: 要定義 -->` コメントを残す
- 既にカスタマイズ済みのファイルは上書きしない。差分を提案する
- プロジェクト種別に応じて上記の省略ガイドに従う

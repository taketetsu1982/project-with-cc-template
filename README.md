# Claude Code Project Template

Claude Code でプロダクト開発とブログ制作を行うためのプロジェクトテンプレート。

企画から設計、実装、テストまでの全工程を**ドキュメントファースト**で進める構造を提供する。

---

## テンプレートの前提

**ドキュメントファースト。** 企画→設計→実装の順で進める。オーケストレーションは人間が行い、各プロセスはClaude Codeのスキルが支援する。

**Fit Journey に沿って進む。** PMF に至るまでの仮説検証を段階的に進める。「今のフェーズで何をどこまで書くか」を確信度で管理し、不要なドキュメントは作らない。

**CCが生成し、人間が判断する。** specsはCCが企画書から自動生成する。人間は意思決定とレビューに集中する。人間の判断は `<!-- human-decision -->` マーカーで保護される。

**product-model.json が概念の正。** エンティティ・画面の追加はJSONを先に更新してからspecsや実装に進める。

---

## 使い方

### プロダクト開発

```
企画(reqs) ──→ 設計(specs) ──→ 実装 ──→ テスト
```

#### Step 1：プロジェクトの初期設定

`/setup-project` を実行すると、CLAUDE.md・rules・settings.json のプレースホルダーを技術スタックに合わせて一括セットアップできる。

```
> /setup-project
```

手動で設定する場合:
1. `CLAUDE.md` の `{プレースホルダー}` を埋める（プロジェクト名、技術スタック、コマンド等）
2. `.claude/rules/` の各ファイルのプレースホルダーを技術スタックに合わせて設定する
3. `CLAUDE.local.md` にローカル環境のURL・テストデータ等を記入する

#### Step 2：Product Goals を定義する

1. `docs/reqs/product-goals.md` にPG1の行を追加する
2. `docs/reqs/pg1.md` を作成し、スコープと出口条件を定義する

```
> チームの日報管理ツールをつくりたい。PG1は「チームメンバーが日報を書いて共有できること」を検証する
```

#### Step 3：企画ドキュメントを作成する

Claude Code と対話しながら MRD・PRD を作成する。

```
> MRDを一緒に書きたい。ターゲットは10〜50人規模のスタートアップ
> PRDを練りたい。日報の記入・閲覧・コメントが主要機能
```

#### Step 4：概念モデルを生成する

```
> /conceptual-model
```

PRD から entities/actors を抽出し、`product-model.json` に書き出す。

**HTMLエディタで編集:** `docs/reqs/model-editor.html` をブラウザで開き、`product-model.json` を接続（Connect ボタンまたはドラッグ&ドロップ）すると、エンティティとリレーションを視覚的に編集できる。Entity タブでエンティティの追加・接続、Actor タブでロール別CRUD権限を設定する。

#### Step 5：画面定義を生成する

```
> /screens
```

概念モデルから screens/transitions を生成する。

**HTMLエディタで編集:** `docs/reqs/screen-editor.html` をブラウザで開き、同じ `product-model.json` を接続する。Map ビューでアクターごとの画面遷移図を確認・編集し、Screen ビューで画面の詳細（オブジェクト、CRUD、遷移先）を設定する。

#### Step 6：ユーザーストーリーを生成する

```
> /story-gen
```

PRD + 概念モデルからユーザーストーリーを導出し、`user-stories.md` に出力する。

#### Step 7：Specs を生成する

```
> /spec-gen
```

企画書全体を理解した上で specs 一式（db-schema, api-spec, auth-spec, test-spec）を生成する。生成後に doc-checker エージェントが企画↔設計の整合性を自動チェックする。

#### Step 8：実装計画を立てる

```
> /impl-plan
```

ユーザーストーリーとSpecsからタスクカードを生成し、優先度順に並べる。

#### Step 9：実装する

```
> US-01を実装して
```

タスクカードに従ってストーリー単位で実装する。

#### Step 10：テストする

```
> /test-run
```

test-spec.md に基づいてSpecs整合性テストとシナリオテストを実行する。

#### Step 11：次の Product Goal へ進む

PG1 の出口条件を満たしたら、PG2 を作成して同じフローを繰り返す。

### ブログ制作

```
/outline → /draft → /revise → /fact-check → /sns
```

1. `/outline` で構成案を作成する
2. `/draft` で brand-voice.md に従って記事を執筆する
3. `/revise` で文章品質を推敲する
4. `/fact-check` で事実検証する
5. `/sns` でSNS投稿文を生成する

記事は `content/articles/` に出力される。

---

## テンプレートの構造

```
project_root/
├── CLAUDE.md                    # プロジェクト概要（Claude Codeが最初に読むファイル）
├── CLAUDE.local.md              # 個人環境設定（.gitignore済み）
├── .claude/
│   ├── settings.json            # hooks + permissions
│   ├── rules/                   # 常時適用ガードレール
│   │   ├── architecture.md      #   技術スタック・レイヤー・API設計
│   │   ├── coding-style.md      #   リンター・型・命名・ログ・依存管理
│   │   ├── security.md          #   認証・アクセス制御・レート制限
│   │   ├── testing.md           #   テストFW・カバレッジ・CI連携
│   │   ├── design.md            #   OOUI・Material Design・Design System
│   │   ├── brand-voice.md       #   ペルソナ・トーン・SEO（ブログ制作用）
│   │   ├── workflow.md          #   ドキュメントファースト・整合性制約
│   │   ├── pr.md                #   PRルール
│   │   └── memory.md            #   CLAUDE.md / rules/ への追記判断基準
│   ├── skills/                  # プロセスごとの手順書（/コマンドで起動）
│   │   ├── conceptual-model/    #   /conceptual-model — entities/actors 編集
│   │   ├── screens/             #   /screens — screens/transitions 編集
│   │   ├── story-gen/           #   /story-gen — ユーザーストーリー生成
│   │   ├── spec-gen/            #   /spec-gen — specs一式生成 + 整合性チェック
│   │   ├── impl-plan/           #   /impl-plan — タスクカード生成
│   │   ├── test-run/            #   /test-run — テスト実行
│   │   └── draft/               #   /draft — 記事執筆（ブログ制作用）
│   └── agents/                  # サブエージェント
│       └── doc-checker.md       #   企画↔設計、設計↔実装の整合性チェック
├── docs/
│   ├── reqs/                    # 企画ドキュメント
│   │   ├── CLAUDE.md            #   このディレクトリの説明
│   │   ├── product-goals.md     #   PG一覧・確信度・ドキュメントマップ
│   │   ├── pg1.md               #   PG1のスコープ・出口条件
│   │   ├── mrd.md               #   市場要求定義
│   │   ├── prd.md               #   プロダクト要求定義
│   │   ├── conceptual-model.md  #   概念モデル（設計意図・人間用）
│   │   ├── product-model.json   #   統合JSON（entities/actors/screens/transitions）
│   │   ├── model-editor.html    #   CMエディタ（ブラウザで開く）
│   │   ├── screen-editor.html   #   Screensエディタ（ブラウザで開く）
│   │   ├── user-stories.md      #   ユーザーストーリー
│   │   └── design-details.md    #   設計原則の操作的定義（オプション）
│   └── specs/                   # 設計ドキュメント（企画から導出）
│       ├── CLAUDE.md            #   このディレクトリの説明
│       ├── db-schema.md         #   DBスキーマ定義
│       ├── api-spec.md          #   APIエンドポイント定義
│       ├── auth-spec.md         #   認証・認可設計
│       ├── ui-spec.md           #   フロントエンド実装仕様
│       ├── analytics-spec.md    #   計測設計
│       ├── test-spec.md         #   テスト計画
│       └── impl-plan.md         #   実装順序・タスクカード
├── content/
│   ├── plans/                   # ブログ戦略・テーマ計画
│   └── articles/                # 記事（/draft が出力）
├── LICENSE
├── Makefile
└── .gitignore
```

---

## カスタマイズガイド

### CLAUDE.md — プロジェクトの顔を整える

`CLAUDE.md` は Claude Code が毎セッション最初に読むファイル。概要とコマンドだけ書き、ルールは `.claude/rules/` に分離する。

**変更箇所:**
- `{プロジェクト名}` と `{1行の概要}` を埋める
- モジュール構成をプロジェクト実態に合わせる
- コマンド（`make up` 等）をビルドツールに合わせる
- Gotchas にハマりどころを書く
- 環境変数の一覧を埋める

### rules/ — ガードレールを技術スタックに合わせる

各ファイルの `{プレースホルダー}` を埋めるだけで基本設定が完了する。

| ファイル | 何を設定するか |
|---|---|
| `architecture.md` | 技術スタック、レイヤー構成、API設計方針 |
| `coding-style.md` | リンター、型厳密度、命名規則 |
| `security.md` | 認証方式、レート制限、CSRF対策 |
| `testing.md` | テストFW、カバレッジ目標、CI連携 |
| `design.md` | Design Systemの方向性、Do/Don't |
| `brand-voice.md` | ペルソナ、トーン、SEO方針（ブログ制作時） |

**追加のコツ:**
- rules は30行以内/ファイルを目安に。多いほど遵守率が下がる
- `paths:` フロントマターでスコープを絞るとコンテキスト消費を節約できる
- ツールで強制できるルール（フォーマット等）は hooks に任せ、rules には書かない

### settings.json — hooks と permissions

| 設定 | デフォルト |
|---|---|
| PostToolUse hooks | JS/TS → Prettier、Python → Black、Go → gofmt |
| permissions deny | .env ファイルの読み書き禁止 |

技術スタックに合わせてフォーマッターを追加・変更する。

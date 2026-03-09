# Claude Code Project Template

Claude Code でプロダクト開発を行うためのプロジェクトテンプレート。

企画（MRD/PRD）から設計（Specs）、実装、テストまでの全工程をドキュメント駆動で進める構造を提供する。

---

## なぜこの構造か

Claude Code の精度は「どのファイルに何が書いてあるか」の設計に大きく左右される。このテンプレートは3つの原則で設計している。

**1. 上流→下流の依存 + 企画層の双方向ブラッシュアップ**

```
reqs/（Why・What） → specs/（How） → 実装
  ↑ pg0 ⇔ prd ⇔ mrd ↑
```

企画ドキュメント（reqs/）が正。実装仕様（specs/）は reqs/ から導出する。矛盾があれば reqs/ が勝つ。reqs/ の中では pg0（スコープ）・prd（解決策・User）・mrd（市場・Buyer）が相互にブラッシュアップし合う。Claude Code は specs/ だけを見て実装するので、reqs/ の意図が specs/ に正しく反映されていれば精度が保たれる。

**2. rules/ で判断基準を固定**

Claude Code は会話が長くなると初期の指示を忘れる。`.claude/rules/` に判断基準を書いておけば、どのセッションでも同じルールで動く。「コードスタイル」「ドキュメント更新順序」「テスト方針」等、口頭で繰り返し伝えがちなことをここに集約する。

**3. teams/ で並列作業を構造化**

Agent Teams（実験的機能）を使い、企画・レビュー・設計・PRレビューを複数エージェントで並列実行する。各 team ファイルが「誰が何ファイルを所有するか」を明示するので、エージェント間のファイル競合が起きない。

---

## テンプレートの構造

```
project_root/
├── CLAUDE.md                    # プロジェクト概要（Claude Codeが最初に読むファイル）
├── CLAUDE.local.md              # 個人環境設定（.gitignore済み）
├── .claude/
│   ├── settings.json            # Claude Code設定
│   ├── rules/                   # 開発ルール（全セッションで適用）
│   │   ├── workflow.md          #   Spec駆動開発のワークフロー
│   │   ├── code-style.md        #   コーディング規約・HTTP設計
│   │   ├── docs.md              #   ドキュメント間の依存と更新ルール
│   │   ├── ui-design.md         #   OOUI設計ルール
│   │   ├── impl-planning.md     #   実装計画ワークフロー（ストーリー→タスク分解）
│   │   ├── test-execution.md    #   テスト規約・実行ワークフロー
│   │   ├── pr.md                #   PRルール
│   │   ├── memory.md            #   CLAUDE.md / rules/ への追記判断基準
│   │   └── agent-teams.md       #   Agent Teams設計ルール
│   └── teams/                   # Agent Teams定義
│       ├── mrd-planning.md      #   MRD企画（対話・調査・分析）
│       ├── mrd-review.md        #   MRDレビュー（顧客・市場・競合）
│       ├── prd-planning.md      #   PRD企画（対話・構造化・モデリング）
│       ├── prd-review.md        #   PRDレビュー（UX・技術・スコープ）
│       ├── cm-review.md         #   概念モデルレビュー（デザイン・テクニカル・修正）
│       ├── specs-planning.md    #   Specs設計（BE・デザイン・PdM）
│       ├── specs-review.md      #   Specsレビュー（技術・機能・統合）
│       └── pr-review.md         #   PRレビュー（セキュリティ・性能・テスト）
├── docs/
│   ├── reqs/                    # 上流ドキュメント（canonical）
│   │   ├── CLAUDE.md            #   このディレクトリの説明
│   │   ├── product-goals.md     #   PG一覧・確信度定義・ドキュメント確信度
│   │   ├── pg0.md               #   PG0のスコープ・出口条件
│   │   ├── mrd.md               #   市場要求定義
│   │   ├── prd.md               #   プロダクト要求定義
│   │   ├── conceptual-model.md  #   概念モデル（エンティティ・関係）
│   │   └── user-stories.md      #   ユーザーストーリー
│   └── specs/                   # 下流ドキュメント（reqs/から導出）
│       ├── CLAUDE.md            #   このディレクトリの説明
│       ├── db-schema.md         #   DBスキーマ定義
│       ├── api-spec.md          #   APIエンドポイント定義
│       ├── auth-spec.md         #   認証・認可設計
│       ├── ui-spec.md           #   フロントエンド実装仕様
│       ├── analytics-spec.md    #   計測設計
│       └── test-spec.md         #   テスト計画
├── Makefile                     # 開発コマンド
├── .github/workflows/ci.yml    # CI設定
└── .gitignore
```

---

## 使い方

### 1. テンプレートを新規プロジェクトに展開する

```bash
unzip project_template.zip -d my-project
cd my-project
git init
```

### 2. CLAUDE.md を埋める

`CLAUDE.md` を開き、`{プレースホルダ}` をプロジェクトの実情に置き換える。

最低限埋めるべき箇所:
- プロジェクト名と概要
- モジュール構成（バックエンド/フロントエンドの技術スタック）
- Gotchas（プロジェクト固有の注意点）
- 環境変数

### 3. Product Goals を定義する

`docs/reqs/product-goals.md` に PG0 の情報を記入し、`docs/reqs/pg0.md` にスコープと出口条件を書く。ここが全ドキュメントの起点になる。

### 4. 企画ドキュメントを埋めていく

Agent Teams を使う場合:
```
# MRD企画
claude "docs/reqs/mrd.md を企画して。.claude/teams/mrd-planning.md に従って"

# PRD企画
claude "docs/reqs/prd.md を企画して。.claude/teams/prd-planning.md に従って"
```

手動で書く場合は、各テンプレートの `{プレースホルダ}` を埋めていく。書く順序は:

```
product-goals → pg0 ⇔ prd ⇔ mrd → conceptual-model → user-stories
```

pg0（スコープ）と prd（機能定義）と mrd（市場定義）は相互にブラッシュアップする。市場定義が解決策に影響し、解決策の検討がスコープを変え、スコープが市場の見方を変えることがある。3つがある程度固まったら conceptual-model に降ろす。

なお、WHO は Buyer（購買意思決定者）と User（実際の利用者）に分離して定義する。Buyer は mrd.md に、User は prd.md に記述する。

### 5. Specs を設計する

```
# Specs設計
claude "Specsを設計して。.claude/teams/specs-planning.md に従って"
```

### 6. 実装に入る

```
# 実装計画
claude "実装計画を立てて"
# → .claude/rules/impl-planning.md のワークフローが起動する

# テスト実行
claude "テストして"
# → .claude/rules/test-execution.md のワークフローが起動する
```

---

## カスタマイズガイド

テンプレートをプロジェクトに合わせて調整する際の指針。

### 必ず変更するファイル

| ファイル | 変更内容 |
|---------|---------|
| `CLAUDE.md` | プロジェクト概要・構成・コマンド・Gotchas |
| `CLAUDE.local.md` | ローカル環境のURL・テストデータ |
| `Makefile` | プロジェクトのビルド・テストコマンド |
| `.github/workflows/ci.yml` | 言語・依存・テスト手順 |
| `docs/reqs/*.md` | 全テンプレートの `{プレースホルダ}` を埋める |

### 技術スタックに合わせて変更するファイル

| ファイル | 変更箇所 |
|---------|---------|
| `.claude/rules/code-style.md` | バックエンド/フロントエンドの言語規約・API連携注意点を自プロジェクト用に書き換える |
| `.claude/rules/test-execution.md` | テスト規約・テストフレームワーク・実行コマンド |
| `.claude/teams/pr-review.md` | Security/Performance Reviewer の評価観点を技術スタックに合わせる |

### ドキュメント構造を変えたい場合

**reqs/ のファイルを増減する場合:**
1. `docs/reqs/CLAUDE.md` のファイル一覧を更新する
2. `.claude/rules/docs.md` のドキュメントフロー図を更新する
3. `CLAUDE.md` の Docs map を更新する

**specs/ のファイルを増減する場合:**
1. `docs/specs/CLAUDE.md` のファイル一覧を更新する
2. `.claude/rules/docs.md` のフロー図を更新する（specs/ の導出元を明記）
3. `.claude/teams/specs-planning.md` の担当ファイル割り当てを更新する

**Agent Teams を使わない場合:**
`.claude/teams/` ディレクトリを削除し、`.claude/settings.json` から `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` を削除する。rules/ と docs/ だけで十分に機能する。

### rules/ にプロジェクト固有ルールを追加する場合

`memory.md` の判断基準に従う:
- プロジェクト全体の構成・Gotchas → `CLAUDE.md`
- ルール・規約・方針 → `.claude/rules/` に新規ファイルを作成
- 個人環境設定 → `CLAUDE.local.md`

rules/ は `paths:` フロントマターでスコープを絞れる。特定ディレクトリのファイルを編集する時だけ適用されるルールには `paths:` を指定する。

---

## ドキュメントの流れ

```
product-goals（PG一覧・確信度）
        │
   pg0 ⇔ prd（WHO:User, WHY, WHAT） ⇔ mrd（WHERE, WHO:Buyer, HOW MUCH）
        │
  conceptual-model（エンティティ・関係）
        │
   user-stories
        │
   specs/db-schema, api-spec,
   auth-spec, ui-spec, analytics-spec
        │
   test-spec
```

**鍵となるルール:**
- 上流が正。矛盾があれば上流が勝つ
- pg0・prd・mrd は相互に影響し合う。どこから始めてもよい
- WHO は Buyer（mrd.md）と User（prd.md）に分離して定義する
- 実装は specs/ だけを参照する（reqs/ を直接パースしない）
- エンティティやAPIを変更する前に、上流ドキュメントから先に更新する

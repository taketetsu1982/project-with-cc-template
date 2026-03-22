# Claude Code Project Template

Claude Code でプロダクト開発を行うためのプロジェクトテンプレート。

企画（MRD/PRD）から設計（Specs）、実装、テストまでの全工程をドキュメント駆動で進める構造を提供する。

---

## テンプレートの前提

このテンプレートは3つの前提で設計しました。

**Fit Journey に沿って進む。** PMF（プロダクト・マーケット・フィット）に至るまでの仮説検証を段階的に進める。「今のフェーズで何をどこまで書くか」を確信度で管理し、全部いっぺんに書かない。不確かな段階に深く書かなくていいようにしています。

**アジャイルに動く。** ドキュメントは一度書いたら固定ではありません。学びが得られるたびに企画から更新し、設計に伝播させる。ドキュメントもアジャイルにアップデートをしていく考え方です。

**企画は双方向、設計は一方向。** 企画ドキュメント（reqs/）の中では pg1（スコープ）・prd（解決策・User）・mrd（市場・Buyer）が相互にブラッシュアップし合います。設計ドキュメント（specs/）は reqs/ から導出する一方向の関係です。変更が必要になったときは、まず企画から更新し、設計に伝播させます。そして設計から実装に着手します。

**実装はプロトタイプを想定する。** 完全な本番システムではなく、仮説検証に必要な機能を動かすことが目的にしました。完璧なコードより速い反復を優先。

---

## 使い方

テンプレートを展開したら、以下の順で進める。

### 全体の流れ

<!-- TODO: あとで画像に差し替え -->

```
product-goals（PG一覧・確信度）                          ── Step 2
        │
   pg1 ⇔ prd（WHO:User, WHY, WHAT） ⇔ mrd（WHERE, WHO:Buyer, HOW MUCH）
        │                                                ── Step 3（Claude Codeと対話しながらつくる）
        │
  product-model.json（entities/actors）                  ── Step 4（/conceptual-model で生成）
        │
  product-model.json（screens/transitions）              ── Step 5（/screens で生成）
        │                                                   ↑ ここからClaude Codeが生成、人が調整
        ├──────────────────┐
  Track A: Specs           Track B: User Stories          ── Step 6（並列で進める）
        │                        │
        │                   Test Spec
        ├──────────────────┘
        │
   impl-plan                                             ── Step 7
        │
   実装（ストーリー単位）                                   ── Step 8
        │
   テスト                                                ── Step 9
        │
   次のPGへ                                              ── Step 10
```

**鍵となるルール:**
- 企画（reqs/）が正。矛盾があれば企画が勝つ
- pg1・prd・mrd は相互に影響し合う。どこから始めてもよい
- WHO は Buyer（mrd.md）と User（prd.md）に分離して定義する
- conceptual-model 以降は Claude Code が生成し、人が HTMLエディタで調整する
- 実装は specs/ だけを参照する（reqs/ を直接パースしない）
- エンティティやAPIを変更する前に、企画ドキュメントから先に更新する

### Step 1：プロジェクトの初期設定

テンプレートを自分のプロジェクトに合わせてセットアップする。

1. **`CLAUDE.md`** を開き、先頭の `{プロジェクト名}` と `{1行の概要}` を埋める。モジュール構成・コマンド・Gotchas・環境変数も自分のプロジェクトに合わせて更新する
2. **`CLAUDE.local.md`** にローカル環境のURL・テストデータなど個人設定を記入する（`.gitignore` 済み）
3. **`Makefile`** と **`.github/workflows/ci.yml`** をプロジェクトの技術スタックに合わせて書き換える
4. **`.claude/rules/code-style.md`** のコーディング規約を自分の言語・フレームワークに合わせる
5. **`.claude/rules/test-execution.md`** のテストフレームワーク・実行コマンドを設定する

```
> バックエンドはFastAPI、フロントエンドはNext.js (App Router) で開発する。CLAUDE.md とrules/ を技術スタックに合わせて更新して
```

### Step 2：Product Goals を定義する

すべてのドキュメントの起点となる Product Goals を定義する。

1. **`docs/reqs/product-goals.md`** を開き、PG一覧テーブルに PG1 の行を追加する
2. **`docs/reqs/pg1.md`** を作成し、PG1 のスコープ（何を検証するか）と出口条件（何をもって完了とするか）を定義する
3. `product-goals.md` のドキュメント確信度テーブルで、各ドキュメントのセクションごとに「確定 / 仮説 / —」を設定する

**ポイント:** 確信度が「—」のセクションは書かなくてよい。「仮説」のセクションは変わりうる前提で書く。全部を一気に埋める必要はない。

```
> チームの日報管理ツールをつくりたい。PG1は「チームメンバーが日報を書いて共有できること」を検証する。product-goals.md と pg1.md を書いて
```

### Step 3：企画ドキュメントを練り上げる（MRD・PRD）

pg1・prd・mrd の3つを相互にブラッシュアップしながら固める。

1. **MRD（`docs/reqs/mrd.md`）** に市場定義（Where）、ターゲットBuyer（Who）、市場規模（How much）を記述する
2. **PRD（`docs/reqs/prd.md`）** にビジョン（Why）、ターゲットUser（Who）、機能定義（What）を記述する
3. pg1 のスコープに照らしながら、MRD と PRD を行き来して整合させる

**Claude Code との進め方:**
- Claude Code と対話しながら書くのが基本
- Agent Teams を使うと複数の観点から並列で進められる。MRD企画（`plan-mrd`）は対話・調査・分析の3エージェントが並走する。PRD企画（`plan-prd`）も同様
- レビューチーム（`review-mrd`、`review-prd`）でレビューを依頼すると、顧客・市場・競合やUX・技術・スコープの観点からフィードバックが返る

```
> MRDを一緒に書きたい。ターゲットは10〜50人規模のスタートアップで、既存ツール（Slack・Notion）では日報が埋もれるのが課題
```
```
> PRDを練りたい。日報の記入・閲覧・コメントが主要機能。まずコアだけに絞って定義したい
```
```
> MRDをレビューして（review-mrd チームで）
```

### Step 4：概念モデルを生成する

MRD・PRD が固まったら、概念モデル（entities / actors）を生成する。

1. Claude Code で **`/conceptual-model`** を実行する
2. Claude Code が PRD の機能定義からエンティティとアクターを抽出し、`product-model.json` に書き出す
3. **`docs/reqs/conceptual-model.md`** に設計意図・エンティティ間の関係の意味・境界と制約が記述される
4. 生成結果を確認する。微調整したい場合は `docs/reqs/model-editor.html` をブラウザで開いて直接編集できる

**完了条件:** `product-model.json` に entities と actors が揃っていること。

**レビュー:** `review-model` チームに依頼すると、デザイン・テクニカルの観点からレビューが返る。

```
> /conceptual-model
```
```
> 概念モデルをレビューして（review-model チームで）
```

#### Model Editor（model-editor.html）

概念モデルの **Entities（実在）** と **Actors（利用者）** を視覚的に編集するツール。ブラウザで開いて `product-model.json` を接続して使う。
画面を見ながら生成されたモデルと認識合っているか確認し、必要があれば直接編集する。

**JSONファイルの接続:**

1. ブラウザで `docs/reqs/model-editor.html` を開く
2. **Connect** ボタンをクリックしてファイル選択ダイアログで `product-model.json` を選ぶ（またはJSONファイルをドラッグ&ドロップ）
3. 接続されるとファイル名が表示され、**Auto** トグルが現れる
   - **Auto ON（デフォルト）:** 編集のたびに自動保存。ドットが緑なら保存済み、オレンジなら保存中
   - **Auto OFF:** 手動で `Cmd+S` / `Ctrl+S` で保存

**Entity ビュー:**

<img width="1710" height="987" alt="image" src="https://github.com/user-attachments/assets/89059822-480c-4cd8-a231-37a347cd6409" />

- キャンバス上のボックスがエンティティ。名称を直接編集できる。
- **+ Entity** ボタンでエンティティを追加する
- **Connect** ボタンでリレーション作成モードに入る。ソースノードからターゲットノードへドラッグ&ドロップで接続するか、ソースをクリック→ターゲットをクリックでも接続できる
- 選択中はリレーションタイプ（has-many / has-one / many-to-many）をフローティングセレクタで変更できる

**Actor ビュー:**

<img width="1710" height="987" alt="image" src="https://github.com/user-attachments/assets/2531f4b0-f350-4b8e-a47e-a651a0989abb" />

- 上部のタブでアクターを切り替える。**Edit** ボタンでアクターの追加・削除・並べ替えができる
- キャンバス上のエンティティをクリックすると、ノード右横にフローティングパネルが表示される
- フローティングパネルで CRUD 権限（Create / Read / Update / Delete）のON/OFFと、スコープ（all / own / カスタム値）を設定できる
- アクセス権のないエンティティには **+ Grant access** で権限を付与できる

### Step 5：画面定義を生成する

概念モデルが固まったら、画面とその遷移（screens / transitions）を定義する。

1. Claude Code で **`/screens`** を実行する
2. Claude Code が概念モデルの entities・actors を参照し、画面一覧と画面遷移を `product-model.json` に追記する
3. 生成結果を確認する。微調整したい場合は `docs/reqs/screen-editor.html` をブラウザで開いて編集できる

**完了条件:** `product-model.json` の screens と transitions が定義されていること。

```
> /screens
```

#### Screen Editor（screen-editor.html）

**screens（画面）** と **Transitions（画面遷移）** を視覚的に編集するツール。Model Editor と同じ `product-model.json` を接続して使う。
画面を見ながら生成されたモデルと認識合っているか確認し、必要があれば直接編集する。

**JSONファイルの接続:**

Model Editor と同じ手順。`docs/reqs/screen-editor.html` をブラウザで開き、**Connect** ボタンまたはドラッグ&ドロップで同じ `product-model.json` を接続する。保存の仕組みも同一。

**Map ビュー:**

<img width="1710" height="987" alt="image" src="https://github.com/user-attachments/assets/13646fba-53b8-4784-9d5e-b8de1f750c01" />

- アクターごとに画面の全体マップが表示される。上部のタブでアクターを切り替える
- **+ Screen** で通常画面、**+ Composite** で複合画面（他の画面を埋め込むコンテナ）を追加する
- 画面ボックスをドラッグして配置を調整できる。ダブルクリックで Screen ビューに遷移する
- **Connect** ボタンで遷移作成モードに入る。ソース画面からターゲット画面へドラッグ&ドロップで遷移を作成するか、クリック操作でも作成できる

**Screen ビュー:**

<img width="1710" height="986" alt="image" src="https://github.com/user-attachments/assets/5972d33a-7485-48b8-8d80-7de5574b66c0" />

- 選択した画面の詳細を編集する。画面名・タイプ（Screen / Composite）・プロンプト（この画面に対する実装時のプロンプト）を設定する
- オブジェクト（エンティティ）を追加し、表示バリアント（collection / single）と CRUD 操作を定義する
- 遷移先の追加・編集もこのビューで行える


### Step 6：ユーザーストーリーと Specs を並列で進める

画面定義が完了したら、これまでのドキュメントを元に2つのトラックを並列で進める。

#### Track A：Specs（設計仕様群）を導出する

Claude Code に「Specsを設計して」と指示する。以下の順で導出される。

| 順序 | Spec | 導出元 | ファイル |
|---|---|---|---|
| 1 | DB Schema | product-model.json（entities） | `docs/specs/db-schema.md` |
| 2 | API Spec | db-schema + conceptual-model + prd | `docs/specs/api-spec.md` |
| 3 | Auth Spec | api-spec + conceptual-model（actors） | `docs/specs/auth-spec.md` |
| 4 | UI Spec | conceptual-model（screens）+ api-spec | `docs/specs/ui-spec.md` |
| 5 | Analytics Spec | product-goals | `docs/specs/analytics-spec.md` |
| 5 | Infra Spec | 上記specsの要件 | `docs/specs/infra-spec.md` |

Agent Teams を使う場合は `plan-specs` チーム（BE・デザイン・PdM の3エージェント）が並列で書き上げる。`review-specs` でレビューも可能。

```
> Specsを設計して（plan-specs チームで）
```

#### Track B：User Stories → Test Spec

1. **`docs/reqs/user-stories.md`** に、画面定義と概念モデルを参照してユーザーストーリーを書く。各ストーリーに受け入れ条件と Gherkin シナリオを定義する
2. ユーザーストーリーの受け入れ条件から **`docs/specs/test-spec.md`** を導出する

```
> PG1の範囲でユーザーストーリーを書いて。受け入れ条件とGherkinシナリオも定義して
```
```
> ユーザーストーリーからtest-specを導出して
```

### Step 7：実装計画を立てる

Track A と Track B の両方が完了したら、実装計画を立てる。

1. Claude Code に実装計画を依頼する
2. `docs/reqs/user-stories.md` の各ストーリーが、対応する Specs と照らし合わせてタスクカードに分解される
3. タスクカードが優先度順（Must → Should → Could）に並べられ、**`docs/specs/impl-plan.md`** に出力される
4. 内容を確認し、実装順序に問題がなければ承認する

```
> 実装計画を立てて
```

### Step 8：実装する

実装計画が承認されたら、ストーリー単位で実装を進める。

1. 実装するストーリーを選ぶ
2. Claude Code がタスクカードの内容に従って実装する。参照するのは specs/ のみ（reqs/ は直接参照しない）
3. 実装が完了したらテストを実行する
4. テストが通ったら次のストーリーに進む

**Agent Teams を使う場合:**
複数レイヤー（フロントエンド・バックエンド）にまたがるストーリーでは `impl` チームが使える。UIデザイナー（Lead）がUI/UX品質を管理しながら、FE・BEが並列で実装し、QAがテストを行う2モード構成。

```
> US-01を実装して（impl チームで）
```
```
> US-01を実装して
```
```
> 次のストーリーに進んで
```

**実装中にSpecの変更が必要になった場合:**
実装を先に変えるのではなく、必ず企画（reqs/）→ 設計（specs/）→ 実装の順で更新する。

### Step 9：テストする

ストーリーの実装が一通り終わったら、テスト仕様に基づいて全体を検証する。

1. Claude Code にテストを依頼する
2. **Specs整合性テスト**（セクションA）— DB・API・認証・UI・計測が Specs 通りに動くか検証する
3. DB/API/Auth に Fail があれば中断して報告される。UI/Analytics のみなら次に進む
4. **シナリオテスト**（セクションB）— ユーザーストーリーが端から端まで通るか、優先度順に検証する
5. テスト結果レポートが出力される。Fail の分類（実装バグ / Spec不備 / 新規エッジケース）と次のアクションが提示される

```
> テストして
```
```
> Failした項目を修正して
```

### Step 10：次の Product Goal へ進む

PG1 の出口条件をすべて満たしたら、次の PG へ遷移する。

1. `docs/reqs/pg1.md` のステータスを Done に更新する
2. `docs/reqs/product-goals.md` の PG一覧で PG1 を Done にし、PG2 の行を追加する
3. `docs/reqs/pg2.md` を作成し、PG2 のスコープ・出口条件を定義する
4. Step 2 に戻り、新しい PG で同じワークフローを繰り返す

**学びのフィードバック:** PG1 で得られた学びは企画ドキュメントに反映する。MRD の市場仮説が外れていたら修正し、PRD の機能定義も見直す。ドキュメントもアジャイルに更新していく。

```
> PG1を完了して次のPGに進んで
```

---

## カスタマイズガイド

テンプレートをプロジェクトに合わせてカスタマイズする方法とコツ。

### CLAUDE.md — プロジェクトの顔を整える

`CLAUDE.md` は Claude Code がセッション開始時に最初に読むファイル。ここに書いた内容がプロジェクト全体の振る舞いを決める。

**変更箇所:**
- `{プロジェクト名}` と `{1行の概要}` を埋める
- モジュール構成をプロジェクト実態に合わせる（例: `backend/` が Go なら `backend/cmd/` `backend/internal/` 等に）
- コマンド（`make up` 等）をプロジェクトのビルドツールに合わせる
- Gotchas にプロジェクト固有のハマりどころを書く
- 環境変数の一覧を埋める

**コツ:** CLAUDE.md は「概要と地図」に徹する。ルール・規約は `.claude/rules/` に分離すること。CLAUDE.md に長いルールを書くと、全セッションで常にコンテキストを消費する。rules/ なら `paths:` で必要なときだけ読み込まれる。

### rules/ — Claude Code の行動規範をチューニングする

`.claude/rules/` のファイルは Claude Code が従うルール集。技術スタックが決まったら真っ先に調整する。

| ファイル | 何を書くか | カスタマイズのポイント |
|---------|-----------|-------------------|
| `code-style.md` | コーディング規約 | バックエンド/フロントエンドの言語・フレームワーク固有のルールに書き換える。`{プレースホルダ}` を埋めるだけでOK |
| `test-execution.md` | テスト規約・実行方法 | テストフレームワーク・配置規約・実行コマンドを設定する |
| `ui-design.md` | UI設計ルール | デザインシステムやコンポーネント方針があれば追加する |
| `pr.md` | PRルール | diff上限やラベル規約をチームに合わせる |

**ルールの追加方法:**
新しいルールは `.claude/rules/` に新規ファイルを作成する。ファイル分けの判断基準：

| 書く場所 | 用途 |
|---------|------|
| `CLAUDE.md` | プロジェクト全体の構成・Gotchas |
| `.claude/rules/*.md` | ルール・規約・方針 |
| `CLAUDE.local.md` | 個人環境設定（`.gitignore` 済み） |

**コツ:** rules/ のファイルには `paths:` フロントマターでスコープを指定できる。例えば `code-style.md` は `paths: ["backend/**", "frontend/**"]` が設定されており、ドキュメント編集中は読み込まれない。スコープを絞るとコンテキストの節約になる。

### teams/ — Agent Teams を調整する

`.claude/teams/` には Agent Teams の定義がある。チームは複数のエージェントを並列で動かして企画・レビューを行う仕組み。

| チーム | 用途 | いつ使うか |
|--------|------|----------|
| `plan-mrd` | MRD企画 | MRDを書くとき。対話・調査・分析の3エージェントが並走する |
| `plan-prd` | PRD企画 | PRDを書くとき。対話・構造化・モデリングの3エージェント |
| `plan-specs` | Specs設計 | Specs群を一括生成するとき。BE・デザイン・PdMの3エージェント |
| `impl` | ストーリー実装 | 複数レイヤーにまたがる実装。UIデザイナー(Lead)・FE・BE・QAの2モード構成 |
| `review-*` | 各種レビュー | 企画・モデル・設計・コードのレビューを複数観点で同時に行う |

**カスタマイズ:**
- `review-code.md` のレビュー観点を技術スタックに合わせる（例: Go の場合は goroutine リーク、React の場合はレンダリング最適化 等）
- `plan-specs.md` のエージェント構成をプロジェクト規模に合わせる

**Agent Teams を使わない場合:**
`.claude/teams/` ディレクトリを削除し、`.claude/settings.json` から `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` を削除する。rules/ と docs/ だけで十分に機能する。Agent Teams は便利だが必須ではない。

**コツ:** Agent Teams は「独立して作業できるレイヤーが2つ以上あるとき」に効果的。同一ファイルを複数エージェントが同時に書くような使い方は競合が起きるので避ける。軽微な修正やバグ修正には Agent Teams は不要。

### docs/ — ドキュメント構造を変える

ドキュメントの増減は3箇所を同時に更新する必要がある。更新漏れがあると Claude Code がドキュメント間の依存関係を正しく追えなくなる。

**reqs/ のファイルを増減する場合:**
1. `docs/reqs/CLAUDE.md` のファイル一覧を更新する
2. `.claude/rules/docs.md` のドキュメントフロー図を更新する
3. `CLAUDE.md` の Docs map を更新する

**specs/ のファイルを増減する場合:**
1. `docs/specs/CLAUDE.md` のファイル一覧を更新する
2. `.claude/rules/docs.md` のフロー図を更新する（specs/ の導出元を明記する）
3. `.claude/teams/plan-specs.md` の担当ファイル割り当てを更新する

**コツ:** 「このファイルを参照して」という情報は CLAUDE.md の Docs map と `docs/*/CLAUDE.md` の2箇所で管理されている。片方だけ更新すると Claude Code が古い構造を見て混乱することがある。変更したら両方チェックする。

### その他のファイル

| ファイル | 変更内容 |
|---------|---------|
| `CLAUDE.local.md` | ローカル環境のURL・テストデータ等の個人設定。`.gitignore` 済みなのでチームメンバーごとに異なる設定を書ける |
| `Makefile` | `make up`、`make test` 等のコマンドをプロジェクトのビルドツールに合わせる |
| `.github/workflows/ci.yml` | CI の言語・依存・テスト手順を設定する |
| `docs/reqs/*.md` | テンプレート内の `{プレースホルダ}` を埋める。Step 2〜3 で段階的に進めればよい |

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
│   ├── skills/                  # スキル定義（/コマンドで起動）
│   │   ├── conceptual-model/    #   /conceptual-model — JSON + HTMLエディタ生成
│   │   └── screens/             #   /screens — JSON + HTMLエディタ生成
│   └── teams/                   # Agent Teams定義
│       ├── plan-mrd.md          #   MRD企画（対話・調査・分析）
│       ├── plan-prd.md          #   PRD企画（対話・構造化・モデリング）
│       ├── plan-specs.md        #   Specs設計（BE・デザイン・PdM）
│       ├── review-mrd.md        #   MRDレビュー（顧客・市場・競合）
│       ├── review-prd.md        #   PRDレビュー（UX・技術・スコープ）
│       ├── review-model.md      #   概念モデルレビュー（デザイン・テクニカル・修正）
│       ├── review-specs.md      #   Specsレビュー（技術・機能・統合）
│       ├── review-code.md       #   コードレビュー（品質・性能・UI一貫性）
│       └── impl.md              #   ストーリー実装（UIデザイナー・FE・BE・QA）
├── docs/
│   ├── reqs/                    # 企画ドキュメント（canonical）
│   │   ├── CLAUDE.md            #   このディレクトリの説明
│   │   ├── product-goals.md     #   PG一覧・確信度定義・ドキュメント確信度
│   │   ├── pg1.md               #   PG1のスコープ・出口条件
│   │   ├── mrd.md               #   市場要求定義
│   │   ├── prd.md               #   プロダクト要求定義
│   │   ├── conceptual-model.md  #   概念モデル（設計意図・人間用）
│   │   ├── product-model.json   #   概念モデル（エンティティ・画面定義・機械用・正）
│   │   ├── model-editor.html    #   CMエディタ（ブラウザで開く）
│   │   ├── screen-editor.html   #   Screensエディタ（ブラウザで開く）
│   │   ├── lib/                 #   エディタ共有ロジック（純粋関数 + テスト）
│   │   ├── sample.product-model.json # サンプルJSON（全フィールド網羅）
│   │   └── user-stories.md      #   ユーザーストーリー
│   └── specs/                   # 設計ドキュメント（reqs/から導出）
│       ├── CLAUDE.md            #   このディレクトリの説明
│       ├── db-schema.md         #   DBスキーマ定義
│       ├── api-spec.md          #   APIエンドポイント定義
│       ├── auth-spec.md         #   認証・認可設計
│       ├── ui-spec.md           #   フロントエンド実装仕様
│       ├── analytics-spec.md    #   計測設計
│       └── test-spec.md         #   テスト計画
├── Makefile                     # 開発コマンド
├── package.json                 # エディタテスト用（vitest）
├── vitest.config.js             # vitestの設定
├── .github/workflows/ci.yml    # CI設定
└── .gitignore
```

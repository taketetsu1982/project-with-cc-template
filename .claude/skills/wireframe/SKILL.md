---
name: wireframe
description: Generate JSON wireframe with HTML preview from conceptual model
---

# /wireframe

Conceptual Modelからビュー定義とレイアウトを持つWireframe JSONを生成し、HTML プレビューを起動する。

## Input

1. **Conversation**: レイアウトの説明からJSON を生成
2. **screen名引数**: `wireframe {screen-name}` — 既存wireframe.jsonを読み込んでHTML再生成

## Output

- `docs/specs/wireframes/{screen-name}.wireframe.json` — ビュー定義+レイアウト
- `docs/specs/wireframes/{screen-name}.wireframe.html` — HTMLプレビュー（ブラウザで開く）
- `docs/specs/wireframes/index.json` — ビュー一覧（エントリ追加）

## JSON Schema

### トップレベル

```json
{
  "name": "画面名",
  "view": {
    "entity": "対応エンティティ名",
    "context": "一覧 | 詳細 | etc",
    "primaryType": "table | card | form | etc"
  },
  "viewport": { "width": 1280, "height": 800 },
  "root": { "..." }
}
```

### ノードフィールド

wireframe-skill-plusのスキーマに準拠する。詳細は `.claude/skills/wireframe/wireframe-designer.md` を参照。

**トレーサビリティフィールド（追加）：**

| Field | Type | Description |
|-------|------|-------------|
| `_entity` | string | 対応するConceptual Modelのエンティティ名 |
| `_attributes` | string[] | 表示するエンティティの属性（conceptual-model.jsonから選択） |
| `_solves` | string | 対応するPRDの問題・ユーザーニーズ |

```json
{
  "name": "タスク行",
  "type": "card",
  "_entity": "タスク",
  "_attributes": ["タイトル", "期限", "ステータス"]
}
```

**制約:**
- `_entity`/`_attributes` はWireframe HTML上ではread-only（変更はConceptual Modelから）
- `_attributes` の値は `conceptual-model.json` の該当エンティティの `attributes` から選択すること

## Execution Steps

### Step 0: Conceptual Modelを読み込む

`docs/reqs/conceptual-model.json` が存在する場合は読み込む。
エンティティ・属性の一覧を把握した上でwireframe JSONを生成する。

- エンティティをUIノードに割り当てる際は `_entity` フィールドにエンティティ名を明記する
- 表示する属性は `_attributes` に列挙する
- ビュー情報（entity・context・primaryType）をトップレベルの `view` フィールドに記述する

### Step 1: 認知モデルを読み込みJSONを生成

1. `.claude/skills/wireframe/wireframe-designer.md` を読み込む
2. Phases 1–7の知覚シーケンスに従いレイアウトを推論する
3. 上記スキーマに従うJSONを生成する

**スキーマルール:**
- すべてのノードは `name` 必須
- レイアウトコンテナは `direction` と `children` 必須
- 葉要素は `type` を持つべき
- CSS flexboxに1:1対応する
- ボタン・リンク・入力は固定 `width` 禁止（`height` のみ）

### Step 2: JSONファイルを書き出す

ファイル名はJSON `name` フィールドからスラッグ化する（例: "タスク一覧" → `task-list`）。

`docs/specs/wireframes/{screen-name}.wireframe.json` に書き出す。

### Step 3: index.jsonを更新する

`docs/specs/wireframes/index.json` の `views` 配列にエントリを追加する。
index.json が存在しない場合は新規作成する。

```json
{
  "name": "タスク一覧",
  "entity": "タスク",
  "context": "一覧",
  "file": "task-list.wireframe.json",
  "html": "task-list.wireframe.html"
}
```

### Step 4: HTMLプレビューを生成

```bash
python3 -c "
t = open('.claude/skills/wireframe/wireframe-template.html').read()
d = open('docs/specs/wireframes/{screen-name}.wireframe.json').read()
open('docs/specs/wireframes/{screen-name}.wireframe.html', 'w').write(t.replace('const WIREFRAME_DATA = null;', 'const WIREFRAME_DATA = ' + d + ';'))
"
```

### Step 5: Index HTMLを更新する

```bash
python3 -c "
t = open('.claude/skills/wireframe/wireframe-index-template.html').read()
d = open('docs/specs/wireframes/index.json').read()
open('docs/specs/wireframes/index.html', 'w').write(t.replace('const INDEX_DATA = null;', 'const INDEX_DATA = ' + d + ';'))
"
```

### Step 6: ブラウザで開く

```bash
open docs/specs/wireframes/{screen-name}.wireframe.html
```

### Step 7: 完了報告

```
Wireframe generated:
- JSON: docs/specs/wireframes/{screen-name}.wireframe.json
- Preview: docs/specs/wireframes/{screen-name}.wireframe.html (opened in browser)
- Index: docs/specs/wireframes/index.json (updated)

HTMLプレビューでレイアウトを調整後、ConnectボタンでJSONに書き戻してください。
エンティティ・属性の変更は /conceptual-model から行ってください。
```

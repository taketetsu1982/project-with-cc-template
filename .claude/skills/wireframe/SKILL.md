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

- `docs/specs/wireframes/{screen-name}.wireframe.json` — ビュー情報+レイアウト
- `docs/specs/wireframes/{screen-name}.wireframe.html` — HTMLプレビュー（ブラウザで開く）

## JSON Schema

### トップレベル

```json
{
  "name": "画面名",
  "view": {
    "context": "一覧 | 詳細 | etc",
    "primaryType": "table | card | form | etc",
    "entities": [
      { "entity": "エンティティ名", "role": "primary" },
      { "entity": "関連エンティティ名", "role": "list" }
    ]
  },
  "viewport": { "width": 1280, "height": 800 },
  "root": { "..." }
}
```

### ノードフィールド

wireframe-skill-plusのスキーマに準拠する。詳細は `.claude/skills/wireframe/wireframe-designer.md` を参照。

**Annotation fields:**

| Field | Type | Description |
|-------|------|-------------|
| `_note` | string | 自然言語による実装指示。挙動・デザイン・インタラクションの意図を自由に記述。空の場合は省略。 |
| `_entity` | string | 対応するConceptual Modelのエンティティ名 |
| `_attributes` | string[] | 表示するエンティティの属性（conceptual-model.jsonから選択） |

```json
{
  "name": "タスク行",
  "type": "card",
  "_entity": "タスク",
  "_attributes": ["タイトル", "期限", "ステータス"],
  "_note": "ソート可能にしたい。期限が近いものは赤くハイライト。"
}
```

**`_note` ルール:**
- `_note` が存在するノードは、その内容を実装の指示として解釈する
- `_note` の内容はデザイン・挙動・インタラクションなど何でも含みうる。Claude Codeが文脈を読んで実装する
- `_note` が空文字または存在しない場合はJSONに含めない

**葉ノードの `type` 値一覧:**

| type | 説明 | 備考 |
|------|------|------|
| `text` | テキスト表示 | variant: display / heading / caption |
| `button` | ボタン | |
| `link` | リンク | |
| `input` | テキスト入力 | |
| `select` | セレクトボックス | input と同じ表示 |
| `image` | 画像プレースホルダ | |
| `icon` | アイコン | デフォルト 32x32 |
| `card` | カード | |
| `table` | テーブル | columns, rows フィールドを使用 |
| `divider` | 区切り線 | |

**制約:**
- `_entity`/`_attributes` はWireframe HTML上ではread-only（変更はConceptual Modelから）
- `_attributes` の値は `conceptual-model.json` の該当エンティティの `attributes` から選択すること

## Execution Steps

### Step 0: Conceptual Modelを読み込む

`docs/reqs/conceptual-model.json` が存在する場合は読み込む。
エンティティ・属性の一覧を把握した上でwireframe JSONを生成する。

- エンティティをUIノードに割り当てる際は `_entity` フィールドにエンティティ名を明記する
- 表示する属性は `_attributes` に列挙する
- ビュー情報（context・primaryType・entities）をトップレベルの `view` フィールドに記述する

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

### Step 3: HTMLプレビューを生成

```bash
python3 -c "
import os
t = open('.claude/skills/wireframe/wireframe-template.html').read()
d = open('docs/specs/wireframes/{screen-name}.wireframe.json').read()
h = t.replace('const WIREFRAME_DATA = null;', 'const WIREFRAME_DATA = ' + d + ';')
h = h.replace(\"const WF_FILENAME = null;\", \"const WF_FILENAME = '{screen-name}.wireframe.json';\")
cm_path = 'docs/reqs/conceptual-model.json'
if os.path.exists(cm_path):
    cm = open(cm_path).read()
    h = h.replace('const CM_DATA = null;', 'const CM_DATA = ' + cm + ';')
open('docs/specs/wireframes/{screen-name}.wireframe.html', 'w').write(h)
"
```

### Step 4: ブラウザで開く

```bash
open docs/specs/wireframes/{screen-name}.wireframe.html
```

### Step 5: 完了報告

```
Wireframe generated:
- JSON: docs/specs/wireframes/{screen-name}.wireframe.json
- Preview: docs/specs/wireframes/{screen-name}.wireframe.html (opened in browser)

HTMLプレビューでレイアウトを調整後、ConnectボタンでJSONに書き戻してください。
右ペインにエンティティ一覧を表示しています（read-only）。
エンティティ・属性の変更は /conceptual-model から行ってください。
```

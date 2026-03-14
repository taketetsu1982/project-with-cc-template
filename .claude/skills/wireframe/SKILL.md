---
name: wireframe
description: Generate JSON wireframe with HTML preview from conceptual model
---

# /wireframe

Conceptual Modelからビュー定義とレイアウトを持つWireframe JSONを生成し、HTML プレビューを起動する。

## Input

1. **Conversation**: レイアウトの説明からJSON を生成
2. **screen名引数**: `wireframe {screen-name}` — 既存wireframe.jsonを読み込んでHTMLで開く

## Output

- `docs/specs/wireframes/{screen-name}.wireframe.json` — ビュー情報+レイアウト（ビューごとに生成）
- `docs/specs/wireframes/wireframe.html` — HTMLプレビュー（1つだけ生成。JSONはドロップで切替）

## JSON Schema

### トップレベル

```json
{
  "name": "画面名",
  "view": {
    "context": "一覧 | 詳細 | etc",
    "primaryType": "table | card | form | etc",
    "entities": [
      { "entity": "エンティティ名", "attributes": ["属性1: 説明", "属性2: 説明"] },
      { "entity": "関連エンティティ名", "attributes": ["属性1: 説明"] }
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

**子ノードの `type` 値一覧:**

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

### Step 1: Conceptual Modelを読み込む

`docs/reqs/conceptual-model.json` が存在する場合は読み込む。
エンティティ・属性の一覧を把握した上でwireframe JSONを生成する。

- エンティティをUIノードに割り当てる際は `_entity` フィールドにエンティティ名を明記する
- 表示する属性は `_attributes` に列挙する
- ビュー情報（context・primaryType・entities）をトップレベルの `view` フィールドに記述する
- `view.entities[].attributes` に conceptual-model.json から該当エンティティの全属性を埋め込む

### Step 2: 認知モデルを読み込みJSONを生成

1. `.claude/skills/wireframe/wireframe-designer.md` を読み込む
2. Phases 1–7の設計プロセスに従いレイアウトを推論する
3. 上記スキーマに従うJSONを生成する

**スキーマルール:**
- すべてのノードは `name` 必須
- レイアウトコンテナは `direction` と `children` 必須
- 子要素は `type` を持つべき
- CSS flexboxに1:1対応する
- ボタン・リンク・入力は固定 `width` 禁止（`height` のみ）

### Step 3: JSONファイルを書き出し、HTMLを準備する

ファイル名はJSON name フィールドからスラッグ化する（例: "タスク一覧" → task-list）。

```bash
# 1. JSONを書き出す
# docs/specs/wireframes/{screen-name}.wireframe.json に保存

# 2. wireframe.html を準備し、WF_SUGGESTED_PATH を置換する
#    （wireframe.html が存在しない場合はテンプレートからコピーして初回生成）
python3 -c "
import shutil, os
src = '.claude/skills/wireframe/wireframe-template.html'
dst = 'docs/specs/wireframes/wireframe.html'
if not os.path.exists(dst):
    shutil.copy(src, dst)  # 初回のみコピー
with open(dst, 'r') as f:
    html = f.read()
html = html.replace(
    'const WF_SUGGESTED_PATH = null; // %%WF_SUGGESTED_PATH%%',
    'const WF_SUGGESTED_PATH = \"docs/specs/wireframes/{screen-name}.wireframe.json\"; // %%WF_SUGGESTED_PATH%%'
)
with open(dst, 'w') as f:
    f.write(html)
"
```

`WF_SUGGESTED_PATH` を埋め込むことで `Save to...` ダイアログが正しいファイル名で開く。
JSONデータ自体の埋め込みは行わない。HTMLはドロップして接続するまで空白のまま。

### Step 4: ブラウザで開く

```bash
open docs/specs/wireframes/wireframe.html
```

### Step 5: 完了報告

```
Wireframe generated:
- JSON:    docs/specs/wireframes/{screen-name}.wireframe.json
- Preview: docs/specs/wireframes/wireframe.html (opened)

{screen-name}.wireframe.json をHTMLにドロップして接続してください。

保存操作:
- [Save to...]  保存先ファイルを選択して書き込み（デフォルト名: {screen-name}.wireframe.json）
- [Save]        接続中ファイルに即時上書き（⌘S）
- [Auto ○/●]   トグルONで変更のたびに自動保存

エンティティ・属性の変更は /conceptual-model から行ってください。
```

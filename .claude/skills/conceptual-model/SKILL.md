---
name: conceptual-model
description: Generate and edit conceptual model JSON with HTML editor
---

# /conceptual-model

Conceptual ModelのJSONを生成し、ブラウザで操作できるHTMLエディタを起動する。

## Input

PRD・MRDの内容、またはユーザーの説明からエンティティを抽出してJSONを生成する。

## Output

- `docs/reqs/conceptual-model.json` — 構造定義（HTMLで編集・保存）
- `docs/reqs/conceptual-model.html` — HTMLエディタ（ブラウザで開く）

## JSON Schema

生成するJSONは必ず以下のスキーマに従うこと。HTMLエディタがこの構造で読み書きする。

```json
{
  "name": "string — モデルのタイトル",
  "root": {
    "name": "string — ルートグループ名",
    "direction": "vertical | horizontal",
    "children": []
  },
  "views": []
}
```

### ノードの種類

**グループノード**（入れ子構造を作る）：
```json
{
  "name": "string — グループ名",
  "direction": "vertical | horizontal",
  "children": []
}
```

**エンティティノード**（葉ノード）：
```json
{
  "name": "string — エンティティ名",
  "type": "entity",
  "attributes": ["属性名: 説明"]
}
```

### ビュー定義（トップレベルの `views` 配列）

```json
{
  "views": [
    {
      "name": "プロジェクト詳細",
      "context": "詳細",
      "primaryType": "card",
      "entities": [
        { "entity": "プロジェクト", "role": "primary" },
        { "entity": "タスク", "role": "list" }
      ]
    }
  ]
}
```

### スキーマルール

- すべてのノードは `name` を持つ
- グループノードは `direction` と `children` を持つ
- エンティティノードは `type: "entity"` と `attributes` 配列を持つ
- `direction` は視覚的なレイアウト指定のみ。構造的な意味は持たない
- 入れ子の深さに制限なし
- エンティティノードはビューを知らない。ビューがエンティティを参照する（一方向）
- `views[].entities[].role` は `primary`（メイン）または任意文字列（list / form 等）
- `views` 配列はトップレベルに置く（rootのchildrenには入れない）

## Execution Steps

### Step 1: JSONを生成

docs/reqs/prd.md と docs/reqs/mrd.md と docs/reqs/conceptual-model.md を読み、
エンティティ・属性・グルーピング構造をJSONとして生成する。
既存の conceptual-model.json がある場合はそれを読み込む。
viewsは空配列で初期化する（ビュー定義はHTMLエディタで人間が行う）。

**必ず上記の JSON Schema に従うこと。**

### Step 2: JSONファイルを書き出す

`docs/reqs/conceptual-model.json` にJSONを書き出す。

### Step 3: HTMLエディタを生成

以下のbashコマンドでHTMLを生成する：

```bash
python3 -c "
t = open('.claude/skills/conceptual-model/conceptual-model-template.html').read()
d = open('docs/reqs/conceptual-model.json').read()
h = t.replace('const CM_DATA = null;', 'const CM_DATA = ' + d + ';')
h = h.replace(\"const CM_FILENAME = null;\", \"const CM_FILENAME = 'conceptual-model.json';\")
open('docs/reqs/conceptual-model.html', 'w').write(h)
"
```

### Step 4: ブラウザで開く

```bash
open docs/reqs/conceptual-model.html
```

### Step 5: 完了報告

```
Conceptual Model generated:
- JSON: docs/reqs/conceptual-model.json
- Editor: docs/reqs/conceptual-model.html (opened in browser)

HTMLエディタで「Connect File」→ docs/reqs/ フォルダを選択すると、
以降の変更が conceptual-model.json に自動保存されます。

1. HTMLエディタでエンティティ構造を調整
2. ビュー定義エリアでビューを追加
3. 「→ Wireframe生成」ボタンからClaude Codeへの指示文を取得して /wireframe を実行
```

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

## Execution Steps

### Step 1: JSONを生成

docs/reqs/prd.md と docs/reqs/mrd.md と docs/reqs/conceptual-model.md を読み、
エンティティ・属性・グルーピング構造をJSONとして生成する。
既存の conceptual-model.json がある場合はそれを読み込む。

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
```

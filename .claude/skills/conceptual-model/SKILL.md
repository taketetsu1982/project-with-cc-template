---
name: conceptual-model
description: Generate and edit conceptual model JSON with HTML editor
---

# /conceptual-model

Conceptual ModelのJSONを生成し、ブラウザで操作できるHTMLエディタを起動する。
entities / actors / composites を編集する（screens / navigation は /screens で編集する）。

## Input

PRD・MRDの内容、またはユーザーの説明からエンティティを抽出してJSONを生成する。

## Output

- `docs/reqs/product-model.json` — 統合JSON（HTMLで編集・保存）
- `docs/reqs/model-editor.html` — HTMLエディタ（ブラウザで開く）

## JSON Schema（統合）

CMエディタとScreensエディタが同じJSONファイルを共有する。
各エディタは自分の担当フィールドのみ編集し、それ以外はパススルーで保持する。

```json
{
  "entities": [],
  "actors": [],
  "composites": [],
  "screens": [],
  "navigation": []
}
```

| フィールド | 編集するエディタ | 説明 |
|---|---|---|
| entities | CM | エンティティ定義 |
| actors | CM | ロール（操作者）定義 |
| composites | CM | 複合画面定義 |
| screens | Screens | 画面定義 |
| navigation | Screens | 画面遷移定義 |

### entities

```json
{
  "id": "kebab-case識別子",
  "name": "表示名",
  "relations": [
    { "id": "一意ID", "targetId": "対象エンティティid", "type": "has-many | has-one | belongs-to | many-to-many", "label": "関係の短い説明" }
  ]
}
```

### actors

```json
{
  "id": "kebab-case識別子",
  "name": "ロール名",
  "touches": [
    { "entityId": "エンティティid", "scope": "all | own", "crud": ["C", "R", "U", "D"] }
  ]
}
```

### composites

```json
{
  "id": "kebab-case識別子",
  "name": "画面名",
  "actorId": "対象アクターid",
  "uses": ["entityId1", "entityId2"]
}
```

### screens（Screensエディタの担当。スキーマ詳細は /screens の SKILL.md を参照）

```json
{
  "id": "kebab-case識別子",
  "name": "画面名",
  "actorId": "アクターid",
  "x": 60, "y": 60,
  "prompt": "実装補足指示",
  "objects": [
    { "id": "一意ID", "entityId": "エンティティid", "variant": "collection | single", "crud": ["C", "R"] }
  ]
}
```

### navigation（Screensエディタの担当）

```json
{ "id": "一意ID", "from": "screen id", "to": "screen id", "trigger": "遷移トリガー" }
```

### スキーマルール

- エンティティはフラットな配列。グルーピングはしない
- relationsの `type` は `has-many` / `has-one` / `belongs-to` / `many-to-many`
- actorsはPRDのロール定義から導出する
- compositesはダッシュボード等の複合画面のみ
- **パススルールール**: CMエディタはscreens/navigationフィールドを読み込み時に保持し、保存時にそのまま書き戻す。screens/navigationが存在しなくてもエラーにしない

## Execution Steps

### Step 1: JSONを生成

docs/reqs/prd.md と docs/reqs/mrd.md と docs/reqs/conceptual-model.md を読み、
entities・actors・compositesをJSONとして生成する。
既存の product-model.json がある場合はそれを読み込み、screens/navigationはそのまま保持する。

### Step 2: JSONファイルを書き出す

`docs/reqs/product-model.json` にJSONを書き出す。

### Step 3: ブラウザで開く

```bash
open docs/reqs/model-editor.html
```

### Step 4: 完了報告

```
Conceptual Model generated:
- JSON: docs/reqs/product-model.json
- Editor: docs/reqs/model-editor.html (opened in browser)

HTMLエディタで product-model.json をドラッグ&ドロップ、
または「Connect」ボタンから読み込んでください。

1. Entity タブでエンティティ・関係を確認・編集
2. Actor タブでロール別CRUD権限を確認・編集
3. Composite タブでダッシュボード等の複合画面を定義
4. 確定後、/screens を実行して画面定義を作成
```

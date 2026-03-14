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
  "entities": [],
  "actors": [],
  "composites": []
}
```

### entities — エンティティ定義

```json
{
  "id": "kebab-case識別子",
  "name": "表示名",
  "relations": [
    { "id": "一意ID", "targetId": "対象エンティティid", "type": "has-many | has-one | belongs-to | many-to-many", "label": "関係の短い説明" }
  ]
}
```

### actors — ロール（操作者）定義

各アクターがどのエンティティにどの権限でアクセスするかを定義する。

```json
{
  "id": "kebab-case識別子",
  "name": "ロール名",
  "touches": [
    { "entityId": "エンティティid", "scope": "all | own", "crud": ["C", "R", "U", "D"] }
  ]
}
```

- `scope`: `all` = 全レコード、`own` = 自分が担当するレコードのみ
- `crud`: そのアクターが実行可能な操作の組み合わせ

### composites — 複合画面定義

複数エンティティを組み合わせるダッシュボード等の画面を定義する。

```json
{
  "id": "kebab-case識別子",
  "name": "画面名",
  "actorId": "対象アクターid",
  "uses": ["entityId1", "entityId2"]
}
```

### スキーマルール

- エンティティはフラットな配列。グルーピングはしない
- エンティティ間の関係は `relations` で表現する（双方向に書く必要はない）
- relationsの `type` は `has-many`（1:N）/ `has-one`（1:1）/ `belongs-to`（N:1）/ `many-to-many`（M:N）
- actorsはPRDのロール定義から導出する
- compositesはダッシュボード等、複数エンティティを俯瞰する画面のみ定義する
- 単一エンティティの一覧・詳細画面はcompositesに含めない（screens.jsonで定義する）

## Execution Steps

### Step 1: JSONを生成

docs/reqs/prd.md と docs/reqs/mrd.md と docs/reqs/conceptual-model.md を読み、
エンティティ・関係・アクター・コンポジットをJSONとして生成する。
既存の conceptual-model.json がある場合はそれを読み込む。

生成順序:
1. エンティティ（entities）— PRD/MRDからドメインオブジェクトを抽出
2. 関係（relations）— エンティティ間の関連を定義
3. アクター（actors）— PRDのロール定義からCRUD権限を設定
4. コンポジット（composites）— ダッシュボード等の複合画面を定義

**必ず上記の JSON Schema に従うこと。**

### Step 2: JSONファイルを書き出す

`docs/reqs/conceptual-model.json` にJSONを書き出す。

### Step 3: HTMLエディタを生成

`docs/reqs/conceptual-model.html` が存在しない場合のみテンプレートをコピーする：

```bash
python3 -c "
import os, shutil
html_path = 'docs/reqs/conceptual-model.html'
if not os.path.exists(html_path):
    shutil.copy('.claude/skills/conceptual-model/conceptual-model-template.html', html_path)
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

HTMLエディタで conceptual-model.json をドラッグ&ドロップ、
または「Connect」ボタンから読み込んでください。
接続すると編集内容が自動保存されます。

1. Entity タブでエンティティ・関係を確認・編集
2. Actor タブでロール別CRUD権限を確認・編集
3. Composite タブでダッシュボード等の複合画面を定義
4. 確定後、docs/specs/screens.json で画面定義を作成
```

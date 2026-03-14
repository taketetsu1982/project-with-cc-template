---
name: wireframe
description: Generate screens JSON with HTML editor from conceptual model
---

# /wireframe

Conceptual Modelから画面定義（screens.json）を生成し、HTMLエディタで画面遷移図を編集する。

## Input

1. **Conversation**: conceptual-model.jsonからscreens.jsonを生成
2. **既存screens**: `docs/specs/screens.json` が存在する場合は読み込んで編集

## Output

- `docs/specs/screens.json` — 画面定義（HTMLで編集・保存）
- `docs/specs/screens.html` — HTMLエディタ（ブラウザで開く）

## JSON Schema

### トップレベル

```json
{
  "screens": [],
  "navigation": []
}
```

### screens — 画面定義

各画面がどのエンティティをどう扱うかを定義する。

```json
{
  "id": "kebab-case識別子",
  "name": "画面名",
  "actorId": "conceptual-model.jsonのactor id",
  "x": 60,
  "y": 60,
  "prompt": "この画面の実装についての補足指示（自然言語）",
  "objects": [
    {
      "id": "一意ID",
      "entityId": "conceptual-model.jsonのentity id",
      "variant": "collection | single",
      "crud": ["C", "R", "U", "D"]
    }
  ]
}
```

- `actorId`: この画面を使うアクター（conceptual-model.jsonのactors参照）
- `x`, `y`: HTMLエディタのMap View上での配置座標
- `prompt`: 画面レイアウトや振る舞いの補足指示。空文字の場合はClaude Codeがobjectsから推論する
- `variant`: `collection` = 一覧表示、`single` = 単体表示（フォーム/詳細）
- `crud`: この画面で実行可能な操作。actorのtouches権限の範囲内で設定する

### navigation — 画面遷移定義

```json
{
  "id": "一意ID",
  "from": "遷移元screen id",
  "to": "遷移先screen id",
  "trigger": "遷移トリガーの説明（例: Tap row, 確定→受注）"
}
```

### スキーマルール

- 各screenは1つのactorIdを持つ（同じ画面を複数ロールで使う場合はscreen自体を分ける）
- objectsのcrudはactorのtouches権限の範囲内で設定する（エディタが自動で制約する）
- navigationは同一actor内の遷移のみ定義する
- promptは画面レイアウトの具体的な指示に使う。構造（objects）で表現しきれないUIの意図を補足する

## Execution Steps

### Step 1: Conceptual Modelを読み込む

`docs/reqs/conceptual-model.json` を読み込む。
entities・actors・compositesの一覧を把握した上でscreens.jsonを生成する。

### Step 2: 画面を設計する

actorごとに必要な画面を洗い出す。

1. 各actorがtouchesしているエンティティを確認する
2. CRUD権限に応じて画面を設計する:
   - C権限あり → 作成画面（single variant, crud: ["C"]）
   - R権限あり → 一覧画面（collection variant, crud: ["R"]）+ 詳細画面（single variant, crud: ["R"]）
   - U権限あり → 編集機能を含む詳細画面
3. compositesに定義されたダッシュボード画面を追加する
4. 画面間のnavigationを定義する

### Step 3: JSONファイルを書き出し、HTMLを準備する

```bash
# 1. screens.jsonを書き出す
# docs/specs/screens.json に保存

# 2. screens.html を準備する
python3 -c "
import shutil, os
src = '.claude/skills/wireframe/wireframe-template.html'
dst = 'docs/specs/screens.html'
if not os.path.exists(dst):
    shutil.copy(src, dst)
"
```

### Step 4: ブラウザで開く

```bash
open docs/specs/screens.html
```

### Step 5: 完了報告

```
Screens generated:
- JSON:   docs/specs/screens.json
- Editor: docs/specs/screens.html (opened)

screens.json をHTMLにドロップして接続してください。

- Map タブ: アクターごとの画面遷移図を確認・編集
- 画面カードの ↗ ボタン: 画面詳細（objects + prompt）を編集

エンティティ・アクターの変更は /conceptual-model から行ってください。
```

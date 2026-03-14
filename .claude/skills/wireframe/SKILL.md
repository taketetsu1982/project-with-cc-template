---
name: wireframe
description: Generate screens definition in conceptual-model JSON with HTML editor
---

# /wireframe

conceptual-model.json の screens / navigation を生成し、HTMLエディタで画面遷移図を編集する。
entities / actors / composites は /conceptual-model で編集する（同じJSONファイルを共有）。

## Input

1. **Conversation**: conceptual-model.json のentities/actorsからscreens/navigationを生成
2. **既存JSON**: `docs/reqs/conceptual-model.json` のscreens/navigation部分を編集

## Output

- `docs/reqs/conceptual-model.json` — 統合JSON（screens/navigation部分を更新）
- `docs/reqs/screens.html` — HTMLエディタ（ブラウザで開く）

## JSON Schema

`docs/reqs/conceptual-model.json` の統合スキーマ（全体定義は /conceptual-model の SKILL.md を参照）。
このスキルは **screens** と **navigation** フィールドのみ編集する。

### screens

```json
{
  "id": "kebab-case識別子",
  "name": "画面名",
  "actorId": "conceptual-model.jsonのactor id",
  "x": 60, "y": 60,
  "prompt": "この画面の実装についての補足指示（自然言語）",
  "objects": [
    {
      "id": "一意ID",
      "entityId": "entity id",
      "variant": "collection | single",
      "crud": ["C", "R", "U", "D"]
    }
  ]
}
```

- `actorId`: この画面を使うアクター
- `x`, `y`: HTMLエディタのMap View上での配置座標
- `prompt`: 画面レイアウトや振る舞いの補足指示
- `variant`: `collection` = 一覧表示、`single` = 単体表示
- `crud`: この画面で実行可能な操作（actorのtouches権限の範囲内）

### navigation

```json
{ "id": "一意ID", "from": "screen id", "to": "screen id", "trigger": "遷移トリガー" }
```

### スキーマルール

- 各screenは1つのactorIdを持つ
- objectsのcrudはactorのtouches権限の範囲内で設定する
- navigationは同一actor内の遷移のみ定義する
- **パススルールール**: Screensエディタはentities/actors/compositesフィールドを読み込み時に保持し、保存時にそのまま書き戻す。これらが空でもエラーにしない

## Execution Steps

### Step 1: Conceptual Modelを読み込む

`docs/reqs/conceptual-model.json` を読み込む。
entities・actorsを把握した上でscreens/navigationを生成する。

### Step 2: 画面を設計する

actorごとに必要な画面を洗い出す。

1. 各actorのtouchesからCRUD権限を確認
2. R権限 → 一覧（collection）+ 詳細（single）
3. C権限 → 作成画面
4. compositesのダッシュボード画面を追加
5. 画面間のnavigationを定義

### Step 3: JSONファイルを更新し、HTMLを準備する

```bash
# 1. conceptual-model.json のscreens/navigationを更新
# 既存のentities/actors/compositesはそのまま保持

# 2. screens.html を準備する
python3 -c "
import shutil, os
src = '.claude/skills/wireframe/wireframe-template.html'
dst = 'docs/reqs/screens.html'
if not os.path.exists(dst):
    shutil.copy(src, dst)
"
```

### Step 4: ブラウザで開く

```bash
open docs/reqs/screens.html
```

### Step 5: 完了報告

```
Screens generated:
- JSON:   docs/reqs/conceptual-model.json (screens/navigation updated)
- Editor: docs/reqs/screens.html (opened)

conceptual-model.json をHTMLにドロップして接続してください。
同じJSONファイルにentities/actors/screens全てが含まれています。

- Actorタブ: アクターごとの画面遷移図を確認・編集
- 画面カードの ↗ ボタン: 画面詳細（objects + prompt）を編集
```

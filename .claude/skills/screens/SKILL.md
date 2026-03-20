---
name: screens
description: Generate screens and transitions in conceptual-model JSON with HTML editor
---

# /screens

product-model.json の screens / transitions を生成し、HTMLエディタで画面遷移図を編集する。
entities / actors は /conceptual-model で編集する（同じJSONファイルを共有）。

## Input

1. **Conversation**: product-model.json の entities/actors から screens/transitions を生成
2. **既存JSON**: `docs/reqs/product-model.json` の screens/transitions 部分を編集

## Output

- `docs/reqs/product-model.json` — 統合JSON（screens/transitions 部分を更新）
- `docs/reqs/screen-editor.html` — HTMLエディタ（ブラウザで開く）

## JSON Schema

`docs/reqs/product-model.json` の統合スキーマ（全体定義は /conceptual-model の SKILL.md を参照）。
このスキルは **screens** と **transitions** フィールドのみ編集する。

### screens

```json
{
  "id": "kebab-case識別子",
  "name": "画面名",
  "actorId": "product-model.jsonのactor id",
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
- `x`, `y`: HTMLエディタの Map View 上での配置座標
- `prompt`: 画面レイアウトや振る舞いの補足指示
- `variant`: `collection` = 一覧表示、`single` = 単体表示
- `crud`: この画面で実行可能な操作（actor の touches 権限の範囲内）

### transitions

```json
{ "id": "一意ID", "from": "screen id", "to": "screen id", "trigger": "遷移トリガー" }
```

### スキーマルール

- 各 screen は1つの actorId を持つ
- objects の crud は actor の touches.crud に含まれる op の範囲内で設定する
- transitions は同一 actor 内の遷移のみ定義する
- **パススルールール**: Screens エディタは entities/actors フィールドを読み込み時に保持し、保存時にそのまま書き戻す。これらが空でもエラーにしない

## 画面設計の認知プロセス

画面を設計する際は `wireframe-designer.md` の認知フレームワークに従う。
参照: `.claude/skills/screens/wireframe-designer.md`

## Execution Steps

### Step 1: Conceptual Model を読み込む

`docs/reqs/product-model.json` を読み込む。
entities・actors を把握した上で screens/transitions を生成する。

### Step 2: 画面を設計する

actor ごとに必要な画面を洗い出す。

1. 各 actor の touches から CRUD 権限を確認
2. R 権限 → 一覧（collection）+ 詳細（single）
3. C 権限 → 作成画面
4. ダッシュボード等の複合画面を type: composite で追加
5. 画面間の transitions を定義

### Step 3: JSON ファイルを更新する

`docs/reqs/product-model.json` の screens/transitions を更新する。
既存の entities/actors はそのまま保持する。

### Step 4: ブラウザで開く

```bash
open docs/reqs/screen-editor.html
```

### Step 5: ブラウザで編集

```
Screens generated:
- JSON:   docs/reqs/product-model.json (screens/transitions updated)
- Editor: docs/reqs/screen-editor.html (opened)

product-model.json をHTMLにドロップして接続してください。
同じJSONファイルに entities/actors/screens 全てが含まれています。

- Actor タブ: アクターごとの画面遷移図を確認・編集
- 画面カードの ↗ ボタン: 画面詳細（objects + prompt）を編集
```

### Step 6: 変更同期（エディタ保存後）

ユーザーがエディタで編集・保存した後、`product-model.json` を読み込んで以下を同期する。

#### 6a. conceptual-model.md の画面定義セクションを確認

screens/transitions に大きな変更がある場合、`conceptual-model.md` の画面定義セクションの記述と整合しているか確認する。

#### 6b. Specs 影響チェック（既存Specsがある場合のみ）

| 変更内容 | 影響するSpec | 確認ポイント |
|---|---|---|
| screen 追加・削除 | `ui-spec.md` | 画面・ルーティング定義 |
| objects の entity/crud 変更 | `ui-spec.md` | インタラクション定義・フォームのルール |
| transition 追加・削除 | `ui-spec.md` | 画面遷移フロー |

**Specsがテンプレート状態（未記述）の場合はスキップする。**

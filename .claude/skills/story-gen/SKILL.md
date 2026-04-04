---
name: story-gen
description: PRDと概念モデルからユーザーストーリーを生成する
---

# /story-gen

PRD（機能定義）と product-model.json（entities/actors/screens）からユーザーストーリーを生成する。
成果物は `docs/reqs/user-stories.md` に出力する。

## Input（すべて読み込む）

- `docs/reqs/prd.md` — 機能定義、ロール、提供価値
- `docs/reqs/product-model.json` — entities, actors, screens, transitions
- `docs/reqs/mrd.md` — 市場・Buyer定義（存在すれば。ロールの背景理解に使用）
- `docs/reqs/product-goals.md` — 現在のPGスコープと優先度

## Output

`docs/reqs/user-stories.md` を生成または更新する。

## Execution Steps

### Step 1: 企画書を読み込む

prd.md と product-model.json は必須。存在しないかテンプレート状態の場合は中断する。

### Step 2: ストーリーを導出する

actors × screens の組み合わせから、ユーザーストーリーを導出する。

各ストーリーについて:
1. **ロール**: actors から取得
2. **行動**: screens の objects（CRUD）から具体化
3. **理由**: prd.md の提供価値・設計原則から導出
4. **受け入れ条件**: screens の objects + actors の touches（権限）から導出
5. **シナリオ**: Given/When/Then 形式で記述
6. **エッジケース**: 権限境界、データ未存在、バリデーション等

### Step 3: 優先度を付ける

product-goals.md の現在のPGスコープに基づいて優先度を判断する。
- Must: PGの出口条件達成に必須
- Should: 体験向上に貢献
- Could: あると良いが後回し可

### Step 4: エピックにグルーピングする

関連するストーリーをエピック（機能カテゴリ）でまとめる。
prd.md の機能カテゴリに対応させる。

### Step 5: 出力

`docs/reqs/user-stories.md` に書き出す。
- テンプレート状態 → 新規生成
- 内容あり → 差分更新。既存ストーリーのIDは維持する

ユーザーにストーリー一覧を提示し、レビューを依頼する。

## 注意

- 現在のPGに含まない機能のストーリーは書かない
- product-model.json にないエンティティのストーリーは書かない
- 受け入れ条件は検証可能な形で書く（曖昧な「使いやすい」等は不可）

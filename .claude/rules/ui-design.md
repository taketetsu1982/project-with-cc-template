---
paths:
  - "docs/reqs/conceptual-model.md"
  - "docs/specs/ui-spec.md"
  - "frontend/**"
---

# UI設計ルール（OOUI）

## 基本原則
- UIはOOUI（オブジェクト指向UI）に従って設計する
- タスク（動詞）ではなくオブジェクト（名詞）を起点にする
- オブジェクトは必ず `docs/reqs/conceptual-model.md` のエンティティから導出する

## オブジェクト定義の手順
1. `docs/reqs/conceptual-model.md` のエンティティ一覧を読む
2. 各エンティティをOOUIのオブジェクトに対応させる
3. 各オブジェクトの「表示する属性」と「アクション」を定義する
4. `docs/specs/ui-spec.md` のオブジェクト定義セクションに記述する

## 画面階層の導出ルール
- 各エンティティは原則「コレクション画面」と「シングル画面」を持つ
- conceptual-modelの関係（1:N）がネスト構造に対応する
- ネストは原則2階層まで。それ以上は設計を疑う
- 独立した画面を持つか否かは、ユーザーがそのエンティティを直接操作するかで判断する

## 実装時のルール
- 新しい画面を追加するときは conceptual-model の画面階層を先に更新する
- conceptual-modelにないエンティティの画面を作らない。先にPRDに戻る
- ui-spec の状態定義（Loading/Empty/Error/Success）を必ず実装する

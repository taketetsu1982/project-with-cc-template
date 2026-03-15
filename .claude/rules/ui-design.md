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
- オブジェクトは必ず `product-model.json` の entities から導出する

## オブジェクト定義の手順
1. `product-model.json` の entities 一覧を読む
2. 各エンティティをOOUIのオブジェクトに対応させる
3. 各オブジェクトの「表示する属性」と「アクション」を定義する
4. `docs/specs/ui-spec.md` のオブジェクト定義セクションに記述する

## 画面階層の導出ルール
- `product-model.json` の screens が画面定義の正
- 各screenの objects が collection（一覧）か single（詳細/フォーム）かで画面種別が決まる
- actors の touches 権限が画面で実行可能な操作を制約する
- 独立した画面を持つか否かは、actors がそのエンティティを直接操作するかで判断する

## 実装時のルール
- 新しい画面を追加するときは product-model.json の screens を先に更新する
- product-model.json にないエンティティの画面を作らない。先にPRDに戻る
- ui-spec の状態定義（Loading/Empty/Error/Success）を必ず実装する

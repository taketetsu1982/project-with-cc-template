---
paths:
  - "docs/**"
  - "backend/**"
  - "frontend/**"
---

# ワークフロー制約

## ドキュメントファースト

- 企画（reqs）→ 設計（specs）→ 実装の順で進める
- 実装着手前に対応するspecsが存在すること。なければ `/spec-gen` で生成する
- specs生成後は doc-checker で整合性を確認する
- プロトタイプ/スパイクは例外。ただし学びをreqs/specsに反映してから本実装に進む

## product-model.json が概念の正

- エンティティの追加・変更は product-model.json を先に更新する
- product-model.json にないエンティティをDB・API・画面に追加しない
- 画面追加は product-model.json の screens を先に定義する

## 整合性

- specsはproduct-model.jsonから導出する。逆方向（specsから概念モデルを変える）はユーザーに確認する
- 実装中にspecsとの齟齬に気づいたら、実装を進めずユーザーに報告する
- 企画（reqs）の変更が必要な場合は作業を中断してユーザーに報告する

## スコープ

- 現在のPGに含まない機能は実装しない
- 不明な点は推測で実装せずTODOコメントを残す

## フィットジャーニー

- 今のフェーズで不要なドキュメント・機能は作らない
- product-goals.md のドキュメントマップに従う

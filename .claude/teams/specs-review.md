# Specsレビューチーム（Team B）

> 実装前にSpecs群の設計問題を潰すチーム。
> アウトプットは「実装前に解決すべき問いのリスト」（優先順位・判断オーナー付き）。

## Review Gate

リードがteammateをspawnする前に確認する。1つでもNoならSpecs補完が先。

- [ ] ユーザー課題（Why）と機能の振る舞い（入力→処理→出力）が書かれているか
- [ ] 対象のスキーマ／APIと実装方針があるか
- [ ] スコープ外が明示されているか

## 重要度の定義

| レベル | 定義 |
|---|---|
| **Blocker** | このまま実装すると手戻りが確定する。実装着手前に解決必須 |
| **Warning** | 実装は可能だが、放置すると問題化する |
| **Note** | 現スコープでは許容。次回以降の検討事項 |

## チーム構成

### 技術設計レビューアー（technical-reviewer）
**レビュー対象:** `docs/specs/db-schema.md`, `docs/specs/api-spec.md`, `docs/specs/auth-spec.md`

**観点:** データ設計、API設計、認証・認可、実装構造

### 機能設計レビューアー（functional-reviewer）
**レビュー対象:** `docs/specs/` 全体、`docs/reqs/prd.md` との整合

**観点:** 仕様の完全性、ユーザー体験、スコープの過不足

### 統合レビューアー（integration-reviewer）
**起動条件:** 技術設計・機能設計の**両方完了後**にspawnする。

**観点:**
- 技術設計と機能仕様の整合
- 両レビューで同一箇所に指摘 → リスク引き上げ
- 実装着手のための優先順位決定

## リードの行動指針

1. Review Gateを確認
2. 技術・機能レビューアーを**並列**spawn
3. **両方完了後**に統合レビューアーをspawn
4. 統合結果を人間に報告
5. Blockerがゼロになったら実装着手を承認

## 参照ドキュメント
- `docs/reqs/prd.md`, `docs/reqs/conceptual-model.md`, `docs/reqs/user-stories.md`
- `docs/specs/` — レビュー対象の全Specs

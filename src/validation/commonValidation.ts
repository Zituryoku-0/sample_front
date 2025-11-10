// 一般的な全角文字の範囲を含む正規表現
// Unicodeプロパティエスケープ \p{sc=Japanese} を使用するとより包括的ですが、
// 環境によってはポリフィルが必要な場合があります。
// ここでは一般的な範囲 [ぁ-んァ-ヶ亜-腕] を使用します。

// 全角チェック用正規表現
export const fullWidthRegex =
    `/^[\\p{sc=Japanese}\u3000-\u30FF\uFF01-\uFF5E]+$/u`;
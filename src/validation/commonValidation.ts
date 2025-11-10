// 一般的な全角文字の範囲を含む正規表現
// Unicodeプロパティエスケープを使用して日本語文字を包括的にマッチします。
// \p{Script=Hiragana}: ひらがな
// \p{Script=Katakana}: カタカナ
// \p{Script=Han}: 漢字
// \u3000-\u30FF: 全角スペース、句読点、カタカナ補完
// \uFF01-\uFF5E: 全角英数字・記号

// 全角チェック用正規表現
export const fullWidthRegex =
    /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\u3000\uFF01-\uFF5E]+$/u;
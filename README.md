# sample_frontの使い方

ここではsample_frontとsample_backを使ったローカル環境での起動までの手順を記載しています。

sample_backのリポジトリは[こちら](https://github.com/Zituryoku-0/sample_back.git)

## 事前準備

ローカル環境で動作させるため、以下のツールを使用します。
必要に応じてインストールしてください。
（念のためIDEも記載していますが、お好みでお使いください）。
- [Node.js](https://nodejs.org/ja/download)
- [VS Code](https://code.visualstudio.com/download)

事前にsample_backをクローンしてください。
```
git clone https://github.com/Zituryoku-0/sample_back.git
```

## 1.sample_frontの起動に必要なライブラリをインストールする

以下のコマンドを実行してください。

```
npm install
```
installは、初回のみで良いです。

## 2.sample_frontを起動する

以下のコマンドを実行してください。
```
npm run dev
```
実行後に、URLが表示されるので、そのURLをクリックすることで起動した画面を確認できます。


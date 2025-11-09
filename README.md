# sample_frontの使い方

ここではsample_frontとsample_backを使ったローカル環境での起動までの手順を記載しています。

sample_backのリポジトリは[こちら](https://github.com/Zituryoku-0/sample_back.git)

## 事前準備

ローカル環境で動作させるため、以下のツールを使用します。
必要に応じてインストールしてください
（念のためIDEも記載していますが、お好みでお使いください）。
- [Docker(Windows)](https://docs.docker.com/desktop/setup/install/windows-install/)もしくは[Docker(Mac)](https://docs.docker.com/desktop/setup/install/mac-install/)
- [Node.js](https://nodejs.org/ja/download)
- [VsCode](https://code.visualstudio.com/download)
- [IntelliJ IDEA CE](https://www.jetbrains.com/ja-jp/idea/download/?section=mac)

## 1.Docker Desktopを起動する

Docker Desktopを起動しておけばOKです。

## 2.Dockerコンテナを起動する

以下のコマンドを実行してください。

```
docker compose up -d
```

もし、起動したコンテナおよび[01_init.sql](https://github.com/Zituryoku-0/sample_back/blob/main/postgres/init/01_init.sql)によって作成されたDBを確認したい場合は、以下のコマンドも実行してください。
```
docker exec -it mycontainer bash
```

```
psql -U postgres -d mydatabase
```

## 3.sample_backリポジトリを起動する

[sample_back](https://github.com/Zituryoku-0/sample_back/blob/main/src/main/java/com/example/sample_back/SampleBackApplication.java)のアプリケーションを起動してください。

## 4.sample_frontの起動に必要なライブラリをインストールする

[sample_front](https://github.com/Zituryoku-0/sample_front)に移動し、以下のコマンドを実行してください。

```
npm install
```
installは、初回のみで良いです。

## 5.sample_frontを起動する

以下のコマンドを実行してください。
```
npm run dev
```
実行後に、URLが表示されるので、そのURLをクリックすることで起動した画面を確認できます。


# chocomint ice
![code quality](https://img.shields.io/codefactor/grade/github/kyometori/chocomint/main)
![license](https://img.shields.io/github/license/kyometori/chocomint)
![last commit](https://img.shields.io/github/last-commit/kyometori/chocomint)
[![discord.js version](https://img.shields.io/github/package-json/dependency-version/kyometori/chocomint/discord.js)](https://discord.js.org)
[![@kyometori/djsmusic verison](https://img.shields.io/github/package-json/dependency-version/kyometori/chocomint/@kyometori/djsmusic)](https://www.npmjs.com/package/@kyometori/djsmusic)

[![chocomint ice!!!](./banner.png)](https://discord.com/oauth2/authorize?client_id=887896057621671997&permissions=517580573952&scope=bot%20applications.commands)

## 簡介
一個現代化的 Discord 音樂機器人，使用 [@kyometori/djsmusic](https://www.npmjs.com/package/@kyometori/djsmusic) 套件製作

## 邀請
你可以[點此](https://discord.com/oauth2/authorize?client_id=887896057621671997&permissions=517580573952&scope=bot%20applications.commands)邀請他至你的伺服器

## 使用方式
這臺機器人只有斜線指令跟選單指令，請輸入 `/` 來開始使用。   
選單指令可以在訊息上點擊右鍵 > 應用程式 來使用。

## 複製一臺
你可以 clone 此專案，將 `.example.env` 檔案編輯好（填入缺項），並改名為 `.env`

更改完之後，首先執行 `npm install` 來安裝所有會需要用到的套件。套件不包含在我們的服務內所以請參照他們的授權及使用規定。

在那之後，請執行 `npm run deploy` 來部署斜線指令及應用程式指令。當你部署完後 Discord 那邊需要一個小時才會更新到，請耐心等候。

或著如果你只想在一個伺服器上部署指令的話，可以使用 `npm run deploy [伺服器ID]`，例如 `npm run deploy 123456789012345678`。

之後，可以使用 `npm start` 開始執行你的機器人

若想取消指令部署，可以使用 `npm run clear`（`npm run clear [伺服器ID]`）撤回指令。

你也可以使用 `npm run dev` 來運行開發模式。預設狀態的機器人在開發模式下每次使用指令都會送出一條訊息警告使用者，你可以自行更改機器人於此模式下的行為。

## 本專案含有
* 純 node.js 達成的的 Discord 應用程式指令部署
* 應用程式指令部署命令列工具
* 簡易 Discord 音樂機器人程式
* 使用按鈕達成的翻頁系統
* 將指令分成好幾個模組放入不同檔案
* 斜線指令 Autocomplete

這些東西，可能還有一些其他的細節，歡迎從裡面擷取你需要的部分帶走。

## 支援伺服器
沒有這種東西，或著你可以到 [HiZollo 的支援伺服器](https://discord.gg/xUXTrYG2MZ) 或是 [MyIT 程式討論區](https://discord.gg/CNzNZSbkMa) 找到開發者，不過短期內不會為這台隨便弄的機器人開個支援伺服器。

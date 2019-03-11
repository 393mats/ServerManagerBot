"use strict";
/*

Server Manager
2019/3/9
by Tetsuya (Tex.my)

*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-console
const Discord = require("discord.js");
const Rcon = require("modern-rcon");
const watch_1 = require("./watch");
// Discord bot token
const token = "NTUzODQ2Mzc5MTg1OTYzMDA5.D2UOUQ.H3Ehqa6K7A9WyJA0ZwBP_9_6r-g";
// Rcon host
const rconHost = "207.148.109.88";
// Rcon host
const rconPassword = "12345";
// Logfile
const logfileName = "./test.log";
// Admin role
const adminRole = "Manager";
// Admin command lists
const helpCommand = `

\`\`\`
!join <servername>  -- サーバーへの参加申請を送る
!admin              -- 管理者権限の確認
!admin member       -- 参加メンバーの一覧
!rcon <option>      -- RCON start/stop
!channel <option>   -- チャンネル設定
                    -- server / reset
\`\`\`

`;
// Server Channel for Discord
let channelLog = 0;
// Rcon
const rcon = new Rcon(rconHost, rconPassword);
// Discord client
const client = new Discord.Client();
// LogWatcher
const watcher = new watch_1.default(logfileName);
// Ready
client.on("ready", () => {
    console.log("Bot is ready");
});
// Get message from Discord
client.on("message", (message) => {
    // Ignore me
    if (message.author.bot) {
        return;
    }
    else {
        // Message
        const msg = message.content;
        // DM
        if (message.channel.type === "dm") {
            message.reply("Hello");
            // Normal texts
        }
        else {
            command(message, msg);
        }
    }
});
// Define Discord command
const command = (message, msg) => {
    const cmd = msg.split(" ");
    // Admin
    let admin = false;
    // tslint:disable-next-line:no-shadowed-variable
    const role = message.member.roles.find((role) => role.name === adminRole);
    if (role) {
        admin = true;
    }
    switch (cmd[0]) {
        // help command
        case "!help":
            message.reply(helpCommand)
                .then(() => console.log(`help`))
                .catch(console.error);
            break;
        // Join command
        case "!join":
            // Minecraft BE
            if (cmd[1] === "mcbe") {
                message.author.send("ここに支払い方法の説明とリンクを書く")
                    .then(() => console.log(`Sent direct message: ${msg}`))
                    .catch(console.error);
                message.reply("「マインクラフトBEサーバー」への参加申請ありがとうございます。\n DMを送信致しましたのでご確認ください。")
                    .then(() => console.log(`Complete: ${msg}`))
                    .catch(console.error);
            }
            else {
                message.reply(cmd[1] + "は存在しません。")
                    .then(() => console.log(`Sent text message: ${msg}`))
                    .catch(console.error);
            }
            break;
        // Admin command
        case "!admin":
            // Top
            if (!admin) {
                message.reply("エラー：管理者権限がありません。")
                    .then(() => console.log(`Complete: ${msg}`))
                    .catch(console.error);
            }
            else if (!cmd[1] && admin) {
                message.reply("あなたは管理者です。")
                    .then(() => console.log(`Complete: ${msg}`))
                    .catch(console.error);
                // admin member command
            }
            else if (cmd[1] === "member" && admin) {
                message.reply("メンバーリストを表示します。")
                    .then(() => console.log(`Complete: ${msg}`))
                    .catch(console.error);
            }
            break;
        case "!rcon":
            // admin stop-rcon command
            if (cmd[1] === "stop" && admin) {
                stopRcon(message, msg, true);
                // admin start-rcon command
            }
            else if (cmd[1] === "start" && admin) {
                startRcon(message, msg, true);
            }
            break;
        case "!channel":
            // server channel
            if (cmd[1] === "server" && admin) {
                channelLog = message.channel.id;
                message.reply("Here is set as a server sync ch: " + channelLog)
                    .catch(console.error);
                const ch = message.client.channels.find("id", channelLog);
                ch.send("test");
                // reset
            }
            else if (cmd[1] === "reset" && admin) {
                client.channels.get(channelLog).send("Hello World");
                channelLog = 0;
            }
            break;
    }
};
// tslint:disable-next-line:no-empty
const startRcon = (message, msg, cmd) => {
    rcon.connect().then(() => {
        return rcon.send("help"); // That's a command for Minecraft
    }).then((res) => {
        console.log(res);
        if (cmd) {
            message.reply("RCONに接続しました")
                .then(() => console.log("Disconeccted Rcon"))
                .catch(console.error);
        }
    });
};
// tslint:disable-next-line:no-empty
const stopRcon = (message, msg, cmd) => {
    rcon.disconnect()
        .then(() => {
        if (cmd) {
            message.reply("RCONを切断しました。")
                .then(() => console.log("Connected Rcon"))
                .catch(console.error);
        }
    });
};
watcher.on("log", (data) => __awaiter(this, void 0, void 0, function* () {
    // Get log from watcher
    console.log("Called", data);
    if (channelLog !== 0) {
        client.channels.get(channelLog).send(data);
    }
}));
client.login(token)
    .then(() => {
    // g
});
//# sourceMappingURL=main.js.map
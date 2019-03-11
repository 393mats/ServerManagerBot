/*

Server Manager
2019/3/9
by Tetsuya (Tex.my)

*/

// tslint:disable:no-console
import Discord = require("discord.js");
import Rcon = require("modern-rcon");
import Watcher from "./watch";

// Discord bot token
const token: string = "NTUzODQ2Mzc5MTg1OTYzMDA5.D2UOUQ.H3Ehqa6K7A9WyJA0ZwBP_9_6r-g";

// Rcon host
const rconHost: string = "207.148.109.88";

// Rcon host
const rconPassword: string = "12345";

// Logfile
const logfileName: string = "./test.log";

// Admin role
const adminRole: string = "Manager";

// Admin command lists
const helpCommand: string = `

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
let channelLog: any = 0;

// Rcon
const rcon = new Rcon(rconHost, rconPassword);
// Discord client
const client = new Discord.Client();
// LogWatcher
const watcher = new Watcher(logfileName);

// Ready
client.on("ready", () => {
    console.log("Bot is ready");
});

// Get message from Discord
client.on("message", (message: any) => {
    // Ignore me
    if (message.author.bot) {
        return;
    } else {
        // Message
        const msg = message.content;

        // DM
        if (message.channel.type === "dm") {
            message.reply("Hello");
            // Normal texts
        } else {
            command(message, msg);
        }

    }
} );
// Define Discord command
const command = (message: any, msg: string): void => {
    const cmd: any = msg.split(" ");
    // Admin
    let admin: boolean = false;
    // tslint:disable-next-line:no-shadowed-variable
    const role: any = message.member.roles.find((role) => role.name === adminRole);
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
            } else {
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
            } else if (!cmd[1] && admin) {
                message.reply("あなたは管理者です。")
                    .then(() => console.log(`Complete: ${msg}`))
                    .catch(console.error);

                // admin member command
            } else if (cmd[1] === "member" && admin) {
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
                } else if (cmd[1] === "start" && admin) {
                    startRcon(message, msg, true);
                }
                break;
            case "!channel":
                // server channel
                if (cmd[1] === "server" && admin) {
                    channelLog = message.channel.id;
                    message.reply("Here is set as a server sync ch: " + channelLog)
                    .catch(console.error);
                // reset
                } else if (cmd[1] === "reset" && admin) {
                    client.channels.get(channelLog).send("Hello World");
                    channelLog = 0;
                }
                break;
    }
};

// tslint:disable-next-line:no-empty
const startRcon = (message: any, msg: string, cmd: boolean): void => {
    rcon.connect().then(() => {
        return rcon.send("help"); // That's a command for Minecraft
      }).then((res: any) => {
        console.log(res);
        if (cmd) {
            message.reply("RCONに接続しました")
                        .then(() => console.log("Coneccted Rcon"))
                        .catch(console.error);
        }
      });

};

// tslint:disable-next-line:no-empty
const stopRcon = (message: any, msg: string, cmd: boolean): void => {
    rcon.disconnect()
    .then(() => {
        if (cmd) {
            message.reply("RCONを切断しました。")
                        .then(() => console.log("Disconnected Rcon"))
                        .catch(console.error);
        }
    });
};

watcher.on("log", async (data: string) => {
    // Get log from watcher
    console.log("Called", data);
    if (channelLog !== 0) { client.channels.get(channelLog).send(data); }

});

client.login(token)
.then(() => {
 // g
});

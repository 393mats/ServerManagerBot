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
const discord_js_1 = require("discord.js");
const Dotenv = require("dotenv");
const Rcon = require("modern-rcon");
const watch_js_1 = require("./watch.js");
Dotenv.config();
// Discord bot token
const token = process.env.TOKEN;
// Rcon host
const rconHost = process.env.HOST;
// Rcon Password
const rconPassword = process.env.PW;
// Logfile
const logfileName = process.env.LOG;
// Admin role
const adminRole = process.env.ADMIN;
const adminRole2 = process.env.ADMIN2;
// ssh
const sshPass1 = process.env.SSHPASS1;
const sshPass2 = process.env.SSHPASS2;
const sshIP1 = process.env.SSHIP1;
const sshIP2 = process.env.SSHIP2;
const serverInfo = `\`
-BE SERVER-
${sshIP1} / ${sshPass1}
User: mcbe
screen < server / ndsv

-JE SERVER-
${sshIP2} / ${sshPass2}
User: mcje
screen < server / ndsv
\`
`;
// Server Channel for Discord
let channelLog = 0;
// Rcon
const rcon = new Rcon(rconHost, rconPassword);
// Discord client
const client = new discord_js_1.Client();
const embed = new discord_js_1.RichEmbed();
// LogWatcher
const watcher = new watch_js_1.default(logfileName);
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
    const role1 = message.member.roles.find((role) => role.name === adminRole);
    const role2 = message.member.roles.find((role) => role.name === adminRole2);
    if (role1 || role2) {
        admin = true;
    }
    switch (cmd[0]) {
        // help command
        case "!help":
            message.channel.send({
                embed: {
                    author: {
                        icon_url: client.user.avatarURL,
                        name: client.user.username,
                    },
                    color: 0x00FF00,
                    description: "Server Manager for Minecraft",
                    fields: [{
                            name: "**!help**",
                            value: "ヘルプ",
                        },
                        {
                            name: "**!join < mcbe | mcje >**",
                            value: "サーバーへの参加申請を送る",
                        },
                        {
                            name: "**!server < connect | disconnect | admin >**",
                            value: "チャンネル設定",
                        },
                    ],
                    timestamp: new Date(),
                    title: "HELP",
                },
            })
                .then(() => console.log(`help`))
                .catch(console.error);
            break;
        // Join command
        case "!join":
            // Minecraft BE
            if (cmd[1] === "mcbe") {
                const info = `Minecraft BEサーバーへの参加ありがとうございます。
参加にあたって下記の約束事をお守りください。
１：Minecraftサーバー内を含め、他人を傷つける発言（誹謗中傷）をしない
２：荒らし行為・故意な破壊行為・迷惑な行為をしない
３：サーバーの接続用アドレスを外部に公開しない。
４：ゲーム内ログイン情報、チャット等のログが記録されます。運営目的以外での使用は致しませんのでご了承ください。

また、参加者にはサーバーの運営費として３ヶ月or半年に一度、一人当たり３００円〜６００円の支援を募らせて頂きます。
運営費がないと続けられないので、ご協力をお願いします。退会の際は運営メンバーまでご連絡ください。

接続用アドレス：${sshIP1}

それでは、楽しいMinecraftライフを！`;
                message.author.send(info)
                    .then(() => console.log(`Sent direct message: ${msg}`))
                    .catch(console.error);
                message.reply("「マインクラフトBEサーバー」への参加ありがとうございます。\n DMを送信致しましたのでご確認ください。")
                    .then(() => console.log(`Complete: ${msg}`))
                    .catch(console.error);
                const addrole = message.guild.roles.find((role) => role.name === "Minecraft-BE");
                message.member.addRole(addrole)
                    .then(() => console.log("Added role"))
                    .catch(console.error);
            }
            else if (cmd[1] === "mcje") {
                const info = `Minecraft JEサーバーへの参加申請ありがとうございます。
参加にあたって下記の約束事をお守りください。
１：Minecraftサーバー内を含め、他人を傷つける発言（誹謗中傷）をしない
２：荒らし行為・故意な破壊行為・迷惑な行為をしない
３：サーバーの接続用アドレスを外部に公開しない。
４：ゲーム内ログイン情報、チャット等のログが記録されます。運営目的以外での使用は致しませんのでご了承ください。

また、参加者にはサーバーの運営費として３ヶ月or半年に一度、一人当たり３００円〜６００円の支援を募らせて頂きます。
運営費がないと続けられないので、ご協力をお願いします。退会の際は運営メンバーまでご連絡ください。

接続用アドレス：${sshIP2}

それでは、楽しいMinecraftライフを！`;
                message.author.send(info)
                    .then(() => console.log(`Sent direct message: ${msg}`))
                    .catch(console.error);
                message.reply("「マインクラフトJEサーバー」への参加申請ありがとうございます。\n DMを送信致しましたのでご確認ください。")
                    .then(() => console.log(`Complete: ${msg}`))
                    .catch(console.error);
                const addrole = message.guild.roles.find((role) => role.name === "Minecraft-JE");
                message.member.addRole(addrole)
                    .then(() => console.log("Added role"))
                    .catch(console.error);
            }
            else {
                message.reply(cmd[1] + "サーバーが存在しません。")
                    .then(() => console.log(`Sent text message: ${msg}`))
                    .catch(console.error);
            }
            break;
        case "!server":
            // server channel
            if (!admin) {
                break;
            }
            if (cmd[1] === "connect") {
                if (channelLog) {
                    message.reply("既に同期済みです。")
                        .then(() => console.log(`Already Connected`))
                        .catch(console.error);
                    break;
                }
                channelLog = message.channel.id;
                startRcon(message, msg);
                // reset
            }
            else if (cmd[1] === "disconnect" && channelLog) {
                if (!channelLog) {
                    client.channels.get(channelLog).send("同期されていません");
                    break;
                }
                client.channels.get(channelLog).send("同期を解除しました。");
                channelLog = 0;
                rcon.disconnect();
            }
            else if (cmd[1] === "admin") {
                message.author.send(serverInfo)
                    .then(() => console.log(`Sent direct message: ${msg}`))
                    .catch(console.error);
            }
            break;
        default:
            // rcon
            if (message.channel.id === channelLog && admin) {
                if (cmd[0] !== "//") {
                    sendToMinecraft(message, msg);
                }
            }
            break;
    }
};
// tslint:disable-next-line:no-empty
const startRcon = (message, msg) => {
    rcon.connect()
        .then(() => {
        client.channels.get(channelLog).send("このチャンネルをサーバーと同期します。ID: " + channelLog);
    })
        .catch((e) => {
        client.channels.get(channelLog).send("エラーが発生したため、同期できませんでした。" + channelLog);
        console.log(e);
        channelLog = 0;
    });
};
// tslint:disable-next-line:no-empty
const sendToMinecraft = (message, msg) => {
    rcon.send(msg)
        .then((res) => {
        console.log("Sent command: " + msg);
        client.channels.get(channelLog).send(res);
    })
        .catch(() => {
        client.channels.get(channelLog).send("エラーが発生したため、送信できませんでした。msg: " + msg);
    });
};
watcher.on("log", (data) => __awaiter(this, void 0, void 0, function* () {
    // Get log from watcher
    if (channelLog !== 0) {
        console.log("Called", data);
        client.channels.get(channelLog).send(data);
    }
}));
client.login(token);
//# sourceMappingURL=main.js.map
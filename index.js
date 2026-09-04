```js
const { Client, GatewayIntentBits } = require("discord.js");
const { status } = require("minecraft-server-util");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// بيانات Discord من Railway
const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

// بيانات Minecraft
const SERVER_IP = "Life_Hork_S2.aternos.me";
const SERVER_PORT = 17186;

// رقم الرسالة التي سيعدلها البوت
let statusMessage = null;

async function updateServerStatus() {
  try {
    // جلب الروم
    const channel = await client.channels.fetch(CHANNEL_ID);

    // التأكد أن الروم يدعم الرسائل
    if (!channel || !channel.isTextBased()) {
      console.log("❌ CHANNEL_ID ليس روم كتابة.");
      return;
    }

    // فحص سيرفر Minecraft
    const result = await status(SERVER_IP, SERVER_PORT, {
      timeout: 5000
    });

    const players = result.players.online;
    const maxPlayers = result.players.max;

    const messageText =
      `🟢 **السيرفر أونلاين**\n\n` +
      `👥 اللاعبين: **${players}/${maxPlayers}**`;

    // إذا ما عندنا رسالة، نرسل رسالة جديدة
    if (!statusMessage) {
      statusMessage = await channel.send(messageText);
    } else {
      // إذا الرسالة موجودة، نحدثها
      await statusMessage.edit(messageText);
    }

    console.log(`🟢 ONLINE | ${players}/${maxPlayers}`);

  } catch (error) {
    try {
      const channel = await client.channels.fetch(CHANNEL_ID);

      if (!channel || !channel.isTextBased()) {
        console.log("❌ CHANNEL_ID ليس روم كتابة.");
        return;
      }

      const messageText =
        `🔴 **السيرفر أوفلاين**\n\n` +
        `👥 اللاعبين: **0/0**`;

      if (!statusMessage) {
        statusMessage = await channel.send(messageText);
      } else {
        await statusMessage.edit(messageText);
      }

      console.log("🔴 OFFLINE");

    } catch (discordError) {
      console.log("❌ البوت لا يستطيع إرسال الرسالة في الروم.");
      console.log(discordError.message);
    }
  }
}

client.once("ready", async () => {
  console.log(`🤖 البوت يعمل: ${client.user.tag}`);

  // تحديث أول مرة
  await updateServerStatus();

  // تحديث كل 60 ثانية
  setInterval(updateServerStatus, 60000);
});

client.login(TOKEN);
```

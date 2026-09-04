const { Client, GatewayIntentBits } = require("discord.js");
const { status } = require("minecraft-server-util");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Discord
const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

// Minecraft
const SERVER_IP = "Life_Hork_S2.aternos.me";
const SERVER_PORT = 17186;


// تحديث حالة السيرفر
async function updateServerStatus() {

  try {

    const channel = await client.channels.fetch(CHANNEL_ID);

    const result = await status(
      SERVER_IP,
      SERVER_PORT,
      {
        timeout: 5000
      }
    );

    const players = result.onlinePlayers;
    const maxPlayers = result.maxPlayers;

    await channel.setName(
      `✵🔶〢・حالة・السيرفر・🟢・${players}/${maxPlayers}`
    );

    console.log(
      `🟢 ONLINE | اللاعبين: ${players}/${maxPlayers}`
    );

  } catch (error) {

    const channel = await client.channels.fetch(CHANNEL_ID);

    await channel.setName(
      "✵🔶〢・حالة・السيرفر・🔴・OFFLINE"
    );

    console.log("🔴 OFFLINE");

  }
}


// تشغيل البوت
client.once("ready", async () => {

  console.log(`🤖 البوت يعمل: ${client.user.tag}`);

  await updateServerStatus();

  // تحديث كل دقيقة
  setInterval(updateServerStatus, 60000);

});


client.login(TOKEN);

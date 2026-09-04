const { Client, GatewayIntentBits } = require("discord.js");
const { status } = require("minecraft-server-util");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const SERVER_IP = "Life_Hork_S2.aternos.me";
const SERVER_PORT = 17186;

async function updateServerStatus() {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    const result = await status(SERVER_IP, SERVER_PORT, {
      timeout: 5000
    });

    const players = result.onlinePlayers;
    const maxPlayers = result.maxPlayers;

    await channel.send(
      `🟢 **السيرفر أونلاين**\n👥 اللاعبين: **${players}/${maxPlayers}**`
    );

    console.log(`🟢 ONLINE | ${players}/${maxPlayers}`);

  } catch (error) {
    try {
      const channel = await client.channels.fetch(CHANNEL_ID);

      await channel.send(
        `🔴 **السيرفر أوفلاين**`
      );

      console.log("🔴 OFFLINE");

    } catch (err) {
      console.log("❌ ما قدرت أرسل الرسالة للروم");
    }
  }
}

client.once("ready", async () => {
  console.log(`🤖 البوت يعمل: ${client.user.tag}`);

  await updateServerStatus();

  setInterval(updateServerStatus, 60000);
});

client.login(TOKEN);

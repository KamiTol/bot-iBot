const { SlashCommandBuilder, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');

const activityPath = path.join(__dirname, '../data/usersActivity.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('escanear')
    .setDescription('Escanea un canal específico y actualiza la actividad de los usuarios')
    .addChannelOption(option =>
      option.setName('canal')
        .setDescription('Canal de texto a escanear')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('limite')
        .setDescription('Cantidad total de mensajes a escanear (máx 1000)')
        .setMinValue(10)
        .setMaxValue(1000)
        .setRequired(false)
    ),

  async execute(interaction) {
    const canal = interaction.options.getChannel('canal');
    const limite = interaction.options.getInteger('limite') || 100;
    const maxFetch = Math.min(limite, 1000);

    await interaction.deferReply({ ephemeral: true });

    if (!canal.viewable || !canal.isTextBased()) {
      return interaction.editReply('❌ No se puede acceder al canal.');
    }

    if (!fs.existsSync(activityPath)) {
      fs.writeFileSync(activityPath, '{}');
    }

    const data = JSON.parse(fs.readFileSync(activityPath, 'utf8'));
    const allMessages = [];
    let lastId;
    let totalFetched = 0;

    try {
      while (allMessages.length < maxFetch) {
        const options = { limit: 100 };
        if (lastId) options.before = lastId;

        const messages = await canal.messages.fetch(options);
        if (messages.size === 0) break;

        for (const message of messages.values()) {
          if (!message.author.bot) {
            const id = message.author.id;

            if (!data[id]) {
              data[id] = {
                messageCount: 1,
                lastMessage: message.createdAt.toISOString()
              };
            } else {
              data[id].messageCount++;
              const prevDate = new Date(data[id].lastMessage || 0);
              if (message.createdAt > prevDate) {
                data[id].lastMessage = message.createdAt.toISOString();
              }
            }

            totalFetched++;
          }
        }

        lastId = messages.last().id;
        if (messages.size < 100) break;
      }

      fs.writeFileSync(activityPath, JSON.stringify(data, null, 2));

      await interaction.editReply(
        `✅ Escaneo completado.\nCanal: ${canal.name}\nMensajes procesados: **${totalFetched}**\nUsuarios únicos: **${new Set(allMessages.map(m => m.author?.id)).size}**`
      );
    } catch (error) {
      console.error(error);
      await interaction.editReply('❌ Error al escanear los mensajes.');
    }
  }
};

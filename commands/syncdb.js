const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const activityFile = path.join(__dirname, '../data/usersActivity.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('syncdb')
    .setDescription('Sincroniza todos los miembros al archivo de actividad'),

  async execute(interaction) {
    const guild = interaction.guild;
    await interaction.deferReply({ ephemeral: true });

    if (!fs.existsSync(activityFile)) {
      fs.writeFileSync(activityFile, '{}');
    }

    const data = JSON.parse(fs.readFileSync(activityFile, 'utf8'));

    const members = await guild.members.fetch();
    let nuevos = 0;

    for (const [id, member] of members) {
      if (member.user.bot) continue;
      if (!data[id]) {
        data[id] = {
          messageCount: 0,
          lastMessage: null
        };
        nuevos++;
      }
    }

    fs.writeFileSync(activityFile, JSON.stringify(data, null, 2));

    await interaction.editReply(`Base de datos sincronizada. Se agregaron ${nuevos} usuarios nuevos.`);
  }
};

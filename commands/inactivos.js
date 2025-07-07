const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getInactiveUsers } = require('../events/checkActivity');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inactivos')
    .setDescription('Muestra usuarios inactivos')
    .addIntegerOption(opt =>
      opt.setName('dias')
        .setDescription('Días de inactividad (por defecto 7)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const dias = interaction.options.getInteger('dias') || 7;
    const inactivos = getInactiveUsers(dias);

    if (!inactivos.length) {
      return interaction.reply(`✅ No hay usuarios inactivos por más de ${dias} días.`);
    }

    const embed = new EmbedBuilder()
      .setTitle(`Usuarios inactivos (≥ ${dias} días)`)
      .setColor('Red');

    // ✅ Obtener todos los miembros para mostrar sus nombres
    const members = await interaction.guild.members.fetch();

    for (const user of inactivos.slice(0, 25)) {
      const member = members.get(user.id);
      const displayName = member?.displayName || `Usuario desconocido (${user.id})`;

      const diasTexto = isNaN(user.daysInactive)
        ? 'Nunca ha enviado mensaje'
        : `${user.daysInactive} días`;

      embed.addFields({
        name: `${displayName}`,
        value: `Inactivo hace \`${diasTexto}\`\nMensajes: \`${user.messages}\``,
        inline: false
      });
    }

    await interaction.reply({ embeds: [embed] });
  }
};

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Antwoord met Pong!'),
    async execute(interaction) {
        await interaction.reply({ content: "Pong!" });
    },
};
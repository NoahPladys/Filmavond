const { SlashCommandBuilder } = require('@discordjs/builders');
const movieList = require('../json/movieList.json');
const { makeEmbed } = require('../functions.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filmtijd')
        .setDescription('Geeft een ongekeken film uit de lijst.'),
    async execute(interaction) {
        const unseenMovies = movieList.filter((e) => e.seen == false);
        if (unseenMovies.length == 0) {
            await interaction.reply({ embeds: [makeEmbed('Oeps..', `Er staat geen ongeziene film meer op de lijst.`)] });
            return;
        } else if (unseenMovies.length == 1) {
            await interaction.reply({ embeds: [makeEmbed('Filmavond!!!', `Er staat maar één film op de lijst, dus dat zal em worden zeker.`).addField('Gekozen film:', `${unseenMovies[0].title}`, false)] });
            return;
        } else {
            const movie = unseenMovies[Math.floor(Math.random() * unseenMovies.length)];
            await interaction.reply({ embeds: [makeEmbed('Filmavond!!!', `Veel kijkplezier!`).addField('Gekozen film:', `${movie.title}`, false)] });
        }
    },
};
const { SlashCommandBuilder } = require('@discordjs/builders');
const { makeEmbed } = require('../functions');
const movieList = require('../json/movieList.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lijst')
        .setDescription('Geeft de lijst van films terug'),
    async execute(interaction) {
        let bekekenFilms =
            movieList
                .filter((e) => e.seen)
                .map((e) => {
                    let prefix;
                    if (e.position != -1)
                        prefix = e.position;
                    else
                        prefix = '#';
                    return `${prefix}. ${e.title}\n`
                }).join('');
        let teKijkenFilms =
            movieList
                .filter((e) => !e.seen)
                .map((e) => `- ${e.title}\n`).join('');

        if (!bekekenFilms)
            bekekenFilms = 'Nog geen films bekeken';
        if (!teKijkenFilms)
            teKijkenFilms = 'Geen films op de lijst';
        await interaction.reply({
            embeds: [
                makeEmbed('Filmlijst', ``)
                    .addFields(
                        {
                            name: "Bekeken films:",
                            value: bekekenFilms,
                            inline: true
                        },
                        {
                            name: "Te kijken films:",
                            value: teKijkenFilms,
                            inline: true
                        }
                    )
            ]
        });
    },
};
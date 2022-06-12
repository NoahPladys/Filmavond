const { SlashCommandBuilder } = require('@discordjs/builders');
const { stripString, makeEmbed, saveMovieList } = require('../functions.js');
const movieList = require('../json/movieList.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Verwijder film uit de lijst.')
        .addStringOption(option =>
            option.setName('titel')
                .setDescription('Titel van de film.')
                .setRequired(true)
                .setAutocomplete(true)),
    async execute(interaction) {
        const movieTitle = interaction.options.getString('titel')
        const movieListFiltered = movieList.filter((e) => stripString(e.title) == stripString(movieTitle));
        if (movieListFiltered.length == 0) {
            await interaction.reply({ embeds: [makeEmbed('Oeps..', `Er is geen film op de lijst genaamd '${movieTitle}'.`)] });
        } else {
            const removedMovie = movieList.splice(movieList.indexOf(movieListFiltered[0]), 1)[0];
            saveMovieList(movieList);
            await interaction.reply({ embeds: [makeEmbed('Film verwijderd!', `De film genaamd '${removedMovie.title}' is verwijderd uit de lijst.`)] });
        }
    },
};
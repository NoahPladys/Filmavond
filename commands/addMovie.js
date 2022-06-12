const { SlashCommandBuilder } = require('@discordjs/builders');
const movieList = require('../json/movieList.json');
const { makeEmbed, stripString, saveMovieList } = require('../functions.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Voegt een film toe aan de lijst')
        .addStringOption(option =>
            option.setName('titel')
                .setDescription('Titel van de film.')
                .setRequired(true)),
    async execute(interaction) {
        const newMovie = {
            title: interaction.options.getString('titel'),
            addedBy: interaction.member.user.id,
            dateAdded: new Date().toLocaleString(),
            seen: false,
            dateSeen: null,
            position: -1
        };

        const movieListFiltered = movieList.filter((e) => stripString(e.title) == stripString(newMovie.title))
        if (movieListFiltered.length > 0) {
            await interaction.reply({
                embeds: [makeEmbed('Oeps..', `Er staat al een film genaamd '${movieListFiltered[0].title}' in de lijst.`)]
            });
        }
        else {
            movieList.push(newMovie);
            saveMovieList(movieList);

            await interaction.reply({
                embeds: [makeEmbed('Film toegevoegd', `De film genaamd '${newMovie.title}' is toegevoegd aan de lijst.`)]
            });
        }
    },
};
const { SlashCommandBuilder } = require('@discordjs/builders');
const { stripString, makeEmbed, saveMovieList } = require('../functions.js');
const movieList = require('../json/movieList.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('positie')
        .setDescription('Verander of zet de positie van een film in het scorebord.')
        .addStringOption(option =>
            option.setName('titel')
                .setDescription('Titel van de film.')
                .setRequired(true)
                .setAutocomplete(true))
        .addIntegerOption(option =>
            option.setName('positie')
                .setDescription('Positie op het scorebord (kan altijd nog aangepast worden)')
                .setRequired(true)),
    async execute(interaction) {
        const title = interaction.options.getString('titel');
        const position = interaction.options.getInteger('positie');
        const movieListFiltered = movieList.filter((e) => e.seen).filter((e) => stripString(e.title) == stripString(title));
        if (movieListFiltered.length == 0) {
            await interaction.reply({ embeds: [makeEmbed('Oeps..', `Er is geen film op de lijst genaamd '${title}'.`)] });
        } else {
            const movieIndex = movieList.indexOf(movieListFiltered[0]);
            if (position <= 0 || movieList.filter((e) => e.position != -1).length + 1 < position) {
                await interaction.reply({ embeds: [makeEmbed('Oeps..', `De positie '${position}' is niet helemaal juist, probeer het nog eens`)] });
            } else {
                let previousPosition = movieList[movieIndex].position;

                if (previousPosition == -1) {
                    console.log('0: ' + previousPosition + ' | ' + position)
                    previousPosition = movieList.filter((e) => e.position != -1).length
                    movieList[movieIndex].position = position;
                    for (let i = position - 1; i < previousPosition; i++) {
                        movieList[i].position++;
                    }
                }
                else if (previousPosition > position) {
                    console.log('1: ' + previousPosition + ' | ' + position)
                    movieList[movieIndex].position = position - 1;
                    for (let i = position - 1; i < previousPosition; i++) {
                        movieList[i].position++;
                    }
                }
                else if (position > previousPosition) {
                    console.log('2: ' + previousPosition + ' | ' + position)
                    movieList[movieIndex].position = position + 1;
                    for (let i = previousPosition - 1; i < position; i++) {
                        movieList[i].position--;
                    }
                } else {
                    await interaction.reply({ embeds: [makeEmbed('Oeps..', `De film '${movieList[movieIndex].title}' staat al op positie ${position}.`)] });
                    return;
                }

                const changedMovie = movieList[movieIndex];
                movieList.sort((e1, e2) => {
                    if (e1.position == -1) return 1;
                    if (e2.position == -1) return -1;
                    return e1.position - e2.position;
                });
                saveMovieList(movieList);
                await interaction.reply({ embeds: [makeEmbed('Film positie aangepast!', `De film genaamd '${changedMovie.title}' staat nu op positie ${position}.`)] });
            }

        }
    },
};
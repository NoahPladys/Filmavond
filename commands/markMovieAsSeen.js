const { SlashCommandBuilder } = require('@discordjs/builders');
const { stripString, makeEmbed, saveMovieList } = require('../functions.js');
const movieList = require('../json/movieList.json');

// choicesList = [];
// movieList.forEach((e, i) => choicesList.push({ name: e.title, value: i }))
// console.log(choicesList);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gezien')
        .setDescription('Markeer een film als bekeken.')
        .addStringOption(option =>
            option.setName('titel')
                .setDescription('Titel van de film.')
                .setRequired(true)
                .setAutocomplete(true))
        .addIntegerOption(option =>
            option.setName('positie')
                .setDescription('Positie op het scorebord (kan altijd nog aangepast worden)')
                .setRequired(false)),

    async execute(interaction) {
        const title = interaction.options.getString('titel');
        const position = interaction.options.getInteger('positie');
        const movieListFiltered = movieList.filter((e) => stripString(e.title) == stripString(title));
        if (movieListFiltered.length == 0) {
            await interaction.reply({ embeds: [makeEmbed('Oeps..', `Er is geen film op de lijst genaamd '${title}'.`)] });
        } else if (movieListFiltered[0].seen) {
            await interaction.reply({ embeds: [makeEmbed('Oeps..', `De film genaamd '${title}' staat al als bekeken.`)] });
        } else {
            const movieIndex = movieList.indexOf(movieListFiltered[0]);
            movieList[movieIndex].seen = true;
            movieList[movieIndex].dateSeen = new Date().toLocaleString();
            if (position) {
                if (position <= 0 || movieList.filter((e) => e.position != -1).length + 1 < position) {
                    saveMovieList(movieList);
                    await interaction.reply({ embeds: [makeEmbed('Oeps...!', `De film '${movieList[movieIndex].title}' is op bekeken gezet, maar de positie ${position} is niet helemaal correct, probeer het nog eens met /positie.`)] });
                } else {
                    movieList[movieIndex].position = position;
                    for (let i = 0; i < movieList.length; i++) {
                        if (movieList[i].position != -1)
                            if (movieList[i].position >= position)
                                if (movieList[i] != movieList[movieIndex])
                                    movieList[i].position++;
                    }
                    const seenMovie = movieList[movieIndex];
                    movieList.sort((e1, e2) => {
                        if (e1.position == -1) return 1;
                        if (e2.position == -1) return -1;
                        return e1.position - e2.position;
                    });
                    saveMovieList(movieList);
                    await interaction.reply({ embeds: [makeEmbed('Film bekeken!', `De film genaamd '${seenMovie.title}' staat nu als bekeken op positie ${position}.`)] });
                }
            } else {
                saveMovieList(movieList);
                await interaction.reply({ embeds: [makeEmbed('Film bekeken!', `De film genaamd '${movieList[movieIndex].title}' staat nu als bekeken.`)] });
            }
        }
    },
};
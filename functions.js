var fs = require('fs');
var { MessageEmbed } = require('discord.js');

module.exports = {
    saveMovieList: function (movieList) {
        const json = JSON.stringify(movieList);
        fs.writeFile('./json/movieList.json', json, (exception) => {
            if (exception)
                console.log("exception");
            else
                console.log('  Movie list saved!');
        });
    },
    makeEmbed: function (title, description) {
        return new MessageEmbed()
            .setColor('#e36363')
            .setTitle(title)
            .setDescription(description)
            .setThumbnail('https://cdn.discordapp.com/attachments/336484875248992268/990897942573486090/popcornTransparant.png')
            .setTimestamp()
            .setFooter({ text: 'Filmavond' })
    },
    stripString: function (str) {
        return str.replace(' ', '').toLowerCase();
    }

};
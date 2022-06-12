const config = require('./json/config.json');
const movieList = require('./json/movieList.json');
const fs = require('node:fs');
const path = require('node:path');
const discord = require('discord.js');
const { stripString } = require('./functions.js');
const client = new discord.Client({
    allowMentions: {
        parse: ['users', 'roles'],
        repliedUser: true,
    },
    intents: [
        'GUILDS',
        'GUILD_MESSAGES',
        'GUILD_PRESENCES',
        'GUILD_MEMBERS',
        'GUILD_MESSAGE_REACTIONS',
    ],
});

require('./deploy-commands.js')
client.commands = new discord.Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}


client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Oeps.. Iets klopt niet helemaal. Vraag eens aan Noah om dit te fixen :)', ephemeral: true });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isAutocomplete()) return;

    if (interaction.commandName === 'gezien' || interaction.commandName === 'remove') {
        const focusedValue = interaction.options.getFocused();
        const unseenMoviesTitles = movieList.filter((e) => e.seen == false).map((e) => e.title);
        const filtered = unseenMoviesTitles.filter(movie => stripString(movie).includes(stripString(focusedValue)));
        await interaction.respond(
            filtered.map(movie => ({ name: movie, value: movie })),
        );
    } else if (interaction.commandName === 'positie') {
        const focusedValue = interaction.options.getFocused();
        const seenMovieTitles = movieList.filter((e) => e.seen).map((e) => e.title);
        const filtered = seenMovieTitles.filter(movie => stripString(movie).includes(stripString(focusedValue)));
        await interaction.respond(
            filtered.map(movie => ({ name: movie, value: movie })),
        );
    }
});

client.login(config.token);
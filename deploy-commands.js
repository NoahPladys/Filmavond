const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { cp } = require('node:fs');
const fs = require('node:fs');
const config = require('./json/config.json');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const clientId = config.clientId;
const guildId = config.guildId;

console.log('Started loading commands.');
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log(`  Loading '${command.data.name}'`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
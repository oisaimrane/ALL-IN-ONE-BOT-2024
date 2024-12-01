const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Moves a song to a new position in the queue.')
        .addIntegerOption(option => 
            option.setName('current')
                .setDescription('The current position of the song')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('new')
                .setDescription('The new position for the song')
                .setRequired(true)),
    
    async execute(interaction) {
        const current = interaction.options.getInteger('current') - 1; // Convert to zero-based index
        const newPosition = interaction.options.getInteger('new') - 1;

        // Get the guild's queue (Replace with your queue management system)
        const queue = interaction.client.queues.get(interaction.guild.id);

        if (!queue || queue.length === 0) {
            return interaction.reply({ content: 'The queue is empty!', ephemeral: true });
        }

        // Validate positions
        if (current < 0 || current >= queue.length || newPosition < 0 || newPosition >= queue.length) {
            return interaction.reply({ content: 'Invalid positions provided!', ephemeral: true });
        }

        // Move the song
        const [movedSong] = queue.splice(current, 1); // Remove the song
        queue.splice(newPosition, 0, movedSong); // Insert at new position

        interaction.reply({
            content: `Moved **${movedSong.title}** from position ${current + 1} to ${newPosition + 1}. 🎵`,
        });
    },
};

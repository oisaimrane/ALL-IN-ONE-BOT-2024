const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Move a user to another voice channel.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The user to move.')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName('destination')
                .setDescription('The voice channel to move the user to.')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers), // Restrict command to users with Move Members permission
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const destinationChannel = interaction.options.getChannel('destination');
        const member = interaction.guild.members.cache.get(targetUser.id);

        // Check if the destination is a voice channel
        if (!destinationChannel.isVoice()) {
            return interaction.reply({ content: 'The destination must be a voice channel!', ephemeral: true });
        }

        // Check if the member has the "Move Power" role
        const movePowerRole = interaction.guild.roles.cache.find(role => role.name === 'Move Power');
        if (!movePowerRole) {
            return interaction.reply({ content: 'The "Move Power" role does not exist.', ephemeral: true });
        }

        if (!member.roles.cache.has(movePowerRole.id)) {
            return interaction.reply({ content: `${targetUser.username} does not have the "Move Power" role!`, ephemeral: true });
        }

        // Check if the user is in a voice channel
        if (!member.voice.channel) {
            return interaction.reply({ content: `${targetUser.username} is not in a voice channel!`, ephemeral: true });
        }

        // Move the user
        try {
            await member.voice.setChannel(destinationChannel);
            interaction.reply({ content: `Moved ${targetUser.username} to ${destinationChannel.name}. 🎉` });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'An error occurred while trying to move the user.', ephemeral: true });
        }
    },
};

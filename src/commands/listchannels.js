module.exports = {
    name:'listchannels',
    description: 'Lists all channels with optional search arg',
   /**
     * @param {import('../UCCLIClient')} client 
     * @param {string[]} args
     */
    exec(client, args){
        let channels = client.channels.cache  
            .array()
            .filter(c => c.type == 'text' && c.permissionsFor(client.user).has('SEND_MESSAGES'));
        if(args.length > 0) channels = channels.filter(c => args.includes(c.name.replace(/[^a-z\-]+/gi, ''))); //TODO: Use Array.some
        client.sendMessage(channels.map(c => `${c.id}: #${c.name} - ${c.guild.name}\n`).join(''));
    }
}
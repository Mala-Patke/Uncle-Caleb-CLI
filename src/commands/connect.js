module.exports = {
    name: 'connect',
    description:'Connects to a channel',
    /**
     * @param {import('../UCCLIClient')} client 
     * @param {string[]} args 
     */
    exec(client, args){
        let channel = client.channels.cache.get(args[0]);
        if(channel) {
            client.connectedchannel = channel;
            client.enableMessageListener();
            client.sendMessage(`Connected to ${channel.name} of ${channel.guild.name}`);
        }
    }
}
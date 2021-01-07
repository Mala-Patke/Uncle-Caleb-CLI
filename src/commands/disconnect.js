module.exports = {
    name: 'disconnect',
    /**
     * @param {import('../UCCLIClient')} client 
     * @param {string[]} args 
     */
    exec(client){
        if(client.connectedchannel.id) {
            client.connectedchannel = { id: false };
            client.disableMessageListener();
            client.sendMessage(`Disconnected`);
        }
        
    }
}
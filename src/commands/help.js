module.exports = {
    name:'help',
    description:'Lists all commands',
   /**
     * @param {import('../UCCLIClient')} client 
     */
    exec(client, args){
        client.sendMessage(client.commands.reduce((acc, val, key) => acc+=`;${key.toUpperCase()} - ${val.description}\n`, ''));
    }
}
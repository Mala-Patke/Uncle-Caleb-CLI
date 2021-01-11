#!/usr/bin/env node
const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { createInterface, clearLine, cursorTo } = require('readline');
const { join } = require('path');
const chalk = require('chalk');
const ansiEscapes = require('ansi-escapes');

const { token } = require(join(__dirname, '/private/token.json'))

class UCCLIClient extends Client{
    constructor(options = {}){
        super(options);
    }

    /** @type {import('readline').Interface} */
    interface;
    connectedchannel = { id: false };
    commands = new Collection();
    /*
    activity = {
        type: '',
        text: ''
    }
    */

    functions = {
        /**
         * @param {string} val 
         */
        dectoHex(val){
            return val.toString(16);
        }
    };

    interfaceInit(){
        this.interface = createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: `Uncle Caleb> `
        });
        this.interface.on('line', message => {
                if(message.startsWith(';')){
                    let command = message.substring(1).split(" ")[0];
                    if(!this.commands.has(command)) return this.interface.prompt(true);
                    try{
                        this.getCommand(command).exec(this, message.split(" ").slice(1));
                    } catch (err){
                        console.error(err)
                    }
                } else
                if(this.connectedchannel.id){
                    this.connectedchannel.send(message);
                }
                this.interface.prompt(true);
            })
        this.interface.prompt(true);
        
    }

    getCommand(arg){
        return this.commands.get(arg);
    }

    sendMessage(message, ...others){
        clearLine(process.stdout, 0);
        cursorTo(process.stdout, 0);
        others.forEach(arg => message += `\n${arg}`);
        console.log(message);
        this.interface.prompt(true);
    }

    loadCommands(){
        for(let file of readdirSync(join(__dirname, `/commands`))){
            if(!file.endsWith('.js')) return;
            let command = require(join(__dirname, `/commands/${file}`));
            this.commands.set(command.name, command);
        }
    }

    /**
     * @param {import('discord.js').Message} message 
     */
    _handleMessage = (message) => {
        if(!this.connectedchannel) return;
        if(message.channel.id !== this.connectedchannel.id) return;
        if(message.author.id === this.user.id) return;

        let color;
        if(!message.member.roles.color){
            color = '#ffffff';
        } else {
            color = message.member.roles.color.color;
        }
        
        let mstr = ``;
        mstr += chalk.hex(this.functions.dectoHex(message.member.roles.color.color))(`${message.member.nickname || message.author.username}`);
        mstr += ` (${message.author.tag}) - ${message.content}`;
        let attatchment = message.attachments.first();
        mstr += attatchment ? ansiEscapes.link(chalk.blueBright.underline(`(attatchment${attatchment.name ? `: ${attatchment.name}` : ''})`), attatchment.proxyURL) : '';
        this.sendMessage(mstr);
    }

    enableMessageListener(){
        this.on('message', this._handleMessage);
    }

    disableMessageListener(){
        this.off('message', this._handleMessage);
    }

    start(){
        this.login(token);
        this.loadCommands();
        this.interfaceInit();
        this.sendMessage(
            ``
        )
    }
}


new UCCLIClient().start();

module.exports = UCCLIClient;

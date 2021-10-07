const Eris = require("eris");
const bot = new Eris("token", {
	intents: [
		"guilds",
		"guildMessages",
		"guildMembers",
		"directMessages"
	]
});
bot.on('error', console.log);

const modRoles = [
	"195226842322567168", //mega man moderator role
	"509176940326944772", //fanworks moderator role
	"840612813756039248", //ps homebrew moderator role
	"831716416134578176"  //xbox homebrew moderator role
]

const update = /^9b/ //command for updating

let disabled = false //boolean used for disabling Nine Ball
const disableCommand = /^9b disable$/ //sets the above bool to true and vice versa
const kill9b = /^9b leos ?klein$/i //command that exits the process

const ONE_WEEK = 1000 * 60 * 60 * 24 * 7

const url = /^(https:\/\/|www\.)/ //don't check messages that only have urls

const {small, full} = require ("./regex.js");
const {nbCommands} = require ("./commands.js");
const {saveRegex, messageScan, shutdown, kickMember, directMessage} = require ("./functions.js")
const {storm, logChannels} = require ("./constants.js")

bot.on("guildMemberAdd", async (guild, member) => { //kick users whose accounts are too young
	let age = new Date() - member.createdAt
	
	let user = member.user
	let dmContents = "You have been kicked from this server as your account is too new. This is for raid/alt account prevention. If this was a mistake, please rejoin later."
	
	if (age < ONE_WEEK) {
		await directMessage(dmContents, user) //dm the user
		kickMember(guild, member);
	}
});
bot.on("messageCreate", async msg => {
    if (msg.author.bot) return; //ignores its own messages
    if (!msg.channel.guild) return; //should prevent the bot from breaking by being DMed
	if (msg.content.match(url)) return; //don't ban for just urls
	
	if (msg.author.id == storm && msg.content.match(kill9b)) {
		shutdown(msg); //exit the process if 9b leosklein is invoked
		return
	}
	
	let moderators = msg.member.roles;
	let modValue = moderators.filter(roles => modRoles.includes(roles));
	
	let trustedUser = false;
	if (msg.author.id == storm || modValue != "") {
		trustedUser = true; //checks if message is from a trusted user
	}

	let switchModes = msg.content.match(disableCommand)
	if (switchModes && trustedUser) {
		let guild = msg.channel.guild;
		let channelId = msg.channel.id;
		if (!disabled) { //disables nine ball
			disabled = true
			guild.channels.get(channelId).createMessage("Nine Ball disabled!")
			return
		}
		else { //enables nine ball
			disabled = false
			guild.channels.get(channelId).createMessage("Nine Ball has been enabled!")
			return
		}
	}
	
	let match = msg.content.match(update)
	
	if (trustedUser && match) { //only allow updates from trusted users
		nbCommands(msg); //go through command as listed in commands.js
		let errorRegex = new RegExp("(?:)")
		
		let guild = msg.channel.guild;
		let logId = logChannels[guild.id]
		
		for (let pattern of small) {
			if (pattern.test(errorRegex)) {
				disabled = true
				guild.channels.get(logId).createMessage("Nine Ball was automatically disabled! An undefined string was detected in the generic regex filters!!")
			}
		}
		for (let pattern of full) {
			if (pattern.test(errorRegex)) {
				disabled = true
				guild.channels.get(logId).createMessage("Nine Ball was automatically disabled! An undefined string was detected in the targeted regex filters!!")
			}
		}
		return
	};
	
	if (disabled == true) {
		let guild = msg.channel.guild;
		let logId = logChannels[guild.id]
		guild.channels.get(logId).createMessage("Nine Ball is currently disabled. A message was posted but it was not scanned.")
		return
	} 

	if (msg.author.id != storm && modValue != "") return;
	
	messageScan(msg); //scan messages for scams in functions.js
	return;
});

bot.connect();

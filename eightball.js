const Eris = require("eris");
const bot = new Eris("token");
bot.on('error', console.log);

const modRoles = [
	"195226842322567168", //mega man moderator role
	"509176940326944772", //fanworks moderator role
	"840612813756039248", //ps homebrew moderator role
	"831716416134578176"  //xbox homebrew moderator role
]

const update = /^8b/
const rhythm = "211938031643525131"; // @Rhythm

const tenor = /^https:\/\/tenor\.com/m //tenor gifs frequently have false positives

const {small, full} = require ("./regex.js");
const {nbCommands} = require ("./listing.js");
const {saveRegex, messageScan} = require ("./functions.js")
const {storm, logChannels} = require ("./constants.js")

// grab the regex filters. 
// small is the generic filter, full is the targeted filter.

//let messageCount = 0

// checks if the message isn't from the bot itself and not
// from a private message
bot.on("messageCreate", async msg => {
    if (msg.author.bot) return;
    if (!msg.channel.guild) return;
	if (msg.content.match(tenor)) return; //don't ban for tenor links...
	
	let trustedUser = false;
	if (msg.author.id == storm || rhythm) {
		trustedUser = true; //checks if message is from a trusted user
	}
	
	let match = msg.content.match(update)
	
	if (trustedUser && match) { //only allow updates from trusted users
		nbCommands(msg); //go through command as listed in listing.js
		return
	};
	const guild = msg.channel.guild;
	//messageCount += 1
	//console.log(`There have been ${messageCount} messages scanned.`);
	
	let moderators = msg.member.roles;
	let modValue = moderators.filter(roles => modRoles.includes(roles));
	if (msg.author.id != storm && modValue != "") return;
	
	let server = msg.guild;
	let logId = logChannels[guild.id]
	if (!logId) return  // not in a configured server
	let logChannel = guild.channels.get(logId)
	
	messageScan(msg); //scan messages for scams in functions.js
});

bot.connect();

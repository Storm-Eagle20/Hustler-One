const fs = require("fs");
const Eris = require("eris");
const bot = new Eris("token");
bot.on('error', console.log);

const logChannels = {
	"195214576571121664": "201369951775227904", //mega man server ID
	"508647842592587776": "508655085648216075", //fanworks server ID
	"176362550311518208": "363004532311064578", //ps homebrew server ID
	"297536872589295626": "387117292053463041"  //xbox homebrew server ID
};

const modRoles = [
	"195226842322567168", //mega man moderator role
	"509176940326944772", //fanworks moderator role
	"840612813756039248", //ps homebrew moderator role
	"831716416134578176"  //xbox homebrew moderator role
]

const storm = "160648230781059073"; // @Storm Eagle
const rhythm = "211938031643525131"; // @Rhythm

const update = /^9b `(.+)`( \-generic)?/ //update command
const generic = /\-generic/ //flag for the update command that updates the generic regex filter

const tenor = /^https:\/\/tenor\.com/m //tenor gifs frequently have false positives

const {small, full} = require("./regex.js");
// grab the regex filters. 
// small is the generic filter, full is the targeted filter.

//let messageCount = 0

// checks if the message isn't from the bot itself and not
// from a private message
bot.on("messageCreate", async msg => {
    if (msg.author.bot) return;
    if (!msg.channel.guild) return;
	if (msg.content.match(tenor)) return; //don't ban for tenor links...
	
	var regexType = "test"; 
	//this is a variable used 
	//in an embed when Nine Ball is updated.
	
	let trustedUser = false;
	if (msg.author.id == storm || rhythm) {
		trustedUser = true; //checks if message is from a trusted user
	}
	
	let match = msg.content.match(update)
	
	if (trustedUser && match) { //only allow updates from trusted users
		let channelId = msg.channel.id;
		let updateContent = msg.content.replace(update,'$1');
		
		let newRegex = new RegExp(match[1])
		if (match[2]) {
			small.push(newRegex) //push to generic regex filter
			regexType = "generic";
		} 
		else {
			full.push(newRegex) //push to targeted regex filter otherwise
			regexType = "targeted";
		}
		
		smallStr = "small = [\n" + small.map(patt => `    ${patt},\n`).join("") + "]\n"
		fullStr = "full = [\n" + full.map(patt => `    ${patt},\n`).join("") + "]\n"
		exportStr = "module.exports = {\n    small,\n    full\n}\n"
		regexFile = `${smallStr}\n${fullStr}\n${exportStr}`
		
		fs.writeFile('regex.js', regexFile, (err) => {
			if (err) {
			console.error(err)
			return
			}
		});
		
		const guild = msg.channel.guild;
		guild.channels.get(channelId).createMessage({
			embed: {
				"description": `Update successful. New ${regexType} regular expression added.`,
				"color": 1715584,
				"footer": {
					"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
					"text": "Hustler One"
				}
			}
		});
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
	
	let result = full.findIndex(pattern => pattern.test(msg.cleanContent));
	var backupFilter = false;
	let count = 0
	if (result == -1) {
		for (let pattern of small) {
			if (pattern.test(msg.content)) {
				count += 1
			}
		}
	};

	if (count > 2) {
		backupFilter = true;
	};

	if (backupFilter == true) {
		if (msg.author.id == storm) { // don't attempt to ban storm for testing this lol
			console.log("This test passed.");
		}
		else (msg.member.ban(0, "scammer").catch(console.error)) // ban the scammer 
		
		//console.log("Banned a scammer.");
		
		guild.channels.get(logId).createMessage({ // create a message regarding the details
			embed: {
				"description": `Banned a scammer! Loose match.`,
				"color": 1715584,
				"footer": {
					"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
					"text": "Target verified. Commencing hostilities!"
					},
				"fields": [ 
					{
					"name": `**${msg.author.username}#${msg.author.discriminator}:**`, // discord ID
					"value": `${msg.cleanContent}` // copy of the scam message
					}
				]
			}
		});
		msg.delete().catch(console.error); // delete offending message. it's put after the log message to avoid any potential errors.
	};
	if (result > -1) {
		let pattern = full[result];
		// checks if the ID is from The Raven
		if (msg.author.id == storm) {	
			guild.channels.get(logId).createMessage({
				embed: {
					"description": `Testing successful. Matched result: \n\`\`\`\n${pattern.source}\n\`\`\``, // for testing filters
					"color": 1715584,
					"footer": {
						"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
						"text": "Hustler One"
					},
					"fields": [ 
						{
						"name": `**${msg.author.username}#${msg.author.discriminator}:**`,
						"value": `${msg.cleanContent}`
						}
					]
				}
			});
		}
		else {
			msg.member.ban(0, "scammer").catch(console.error) // ban the scammer 
			
			//console.log("Banned a scammer.");
			
			guild.channels.get(logId).createMessage({ // create a message regarding the details
				embed: {
					"description": `Banned a scammer! Matched result: \n\n${pattern.source}`,
					"color": 1715584,
					"footer": {
						"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
						"text": "Target verified. Commencing hostilities!"
					},
					"fields": [ 
						{
						"name": `**${msg.author.username}#${msg.author.discriminator}:**`, // discord ID
						"value": `${msg.cleanContent}` // copy of the scam message
						}
					]
				}
			});
			msg.delete().catch(console.error); // delete offending message. it's put after the log message to avoid any potential errors.
	    }
	};
});

bot.connect();

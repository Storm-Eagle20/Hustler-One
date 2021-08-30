const fs = require("fs");
const Eris = require("eris");
const bot = new Eris("token");

const logsChannel = "201369951775227904" //"201369951775227904"; // #mod-logs
const botChannel = "517934719170641930" //"517934719170641930"; // #staff-bot-channel

const storm = "160648230781059073"; // @Storm Eagle
const update = /^9b/ //update command

const {small, full} = require("./regex.js"); // grab the regex filters

// checks if the message isn't from the bot itself and not
// from a private message
bot.on("messageCreate", async msg => {
    if (msg.author.bot) return;
    if (!msg.channel.guild) return;
    
	if (msg.channel.id == logsChannel || msg.channel.id == botChannel) return
	
	if (msg.author.id == storm && msg.content.match(update)) {
		let newRegex = msg.content.replace("9b ","");
		full.push(newRegex);
		
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
				"description": `Update successful. Reload Nine Ball.`,
				"color": 1715584,
				"footer": {
					"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
					"text": "Hustler One"
				}
			}
		});
		process.exit(0);
	};
	
	let result = full.findIndex(pattern => pattern.test(msg.cleanContent));
	var backupFilter = false;
	let count = 0
	
	if (result == -1) {
		for (let pattern of small) {
			for (let match of msg.content.matchAll(pattern)) {
				count += 1
			}
		}
	};
	if (count > 2) {
		backupFilter = true;
	};
	if (backupFilter == true) {
		const guild = msg.channel.guild;
		
		if (msg.author.id == storm) { // don't attempt to ban storm for testing this lol
			console.log("This test passed.");
		}
		else (msg.member.ban(0, "scammer").catch(console.error)) // ban the scammer 
		
		guild.channels.get(logsChannel).createMessage({ // create a message regarding the details
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
		const guild = msg.channel.guild;
		let pattern = full[result];
		// checks if the ID is from The Raven
		if (msg.author.id == storm) {	
			guild.channels.get(logsChannel).createMessage({
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
			
			guild.channels.get(logsChannel).createMessage({ // create a message regarding the details
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

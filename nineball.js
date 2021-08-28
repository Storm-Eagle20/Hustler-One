const Eris = require("eris");
const bot = new Eris("NTc0NTY5OTc0NDkzMDg1NzA2.XM7T_A.KILcXfdUBv4Gn1Sbj6NIoPXLPCI");

const logsChannel = "582775837238099988" //"201369951775227904"; // #mod-logs
const botChannel = "570160968643117077" //"517934719170641930"; // #staff-bot-channel

const storm = "160648230781059073"; // @Storm Eagle

const patterns = require("./regex.js"); // grab the regex filters

// checks if the message isn't from the bot itself and not
// from a private message
bot.on("messageCreate", async msg => {
    if (msg.author.bot) return;
    if (!msg.channel.guild) return;
    
	// checks public messages against regex filters
	if (msg.channel.id == logsChannel || msg.channel.id == botChannel) return
	if (msg.content.match(patterns)) {
		const guild = msg.channel.guild;
		// checks if the ID is from The Raven
		if (msg.author.id == storm) {	
			let result = patterns.findIndex(pattern => pattern.test(message.content));
			
			guild.channels.get(logsChannel).createMessage({
				embed: {
					"description": `Testing successful. Matched result: \n${result}`, // for testing filters
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
			let result = patterns.findIndex(pattern => pattern.test(message.content));
			
			msg.member.ban({ // ban the scammer
				"reason": "scammer"
			})
			
			guild.channels.get(logsChannel).createMessage({ // create a message regarding the details
				embed: {
					"description": `Banned a scammer! Matched result: \n${result}`,
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
			msg.message.delete(); // delete offending message. it's put after the log message to avoid any potential errors.
	    }
	};
});

bot.connect();

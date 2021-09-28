const fs = require("fs");
const {small, full} = require("./regex.js");
const {storm, logChannels} = require("./constants.js")

function saveRegex() {
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
	return
};

function messageScan(msg) {
	let guild = msg.channel.guild;
	
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
		
		guild.channels.get(logChannels).createMessage({ // create a message regarding the details
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
		return
	};
	if (result > -1) {
		let pattern = full[result];
		// checks if the ID is from The Raven
		
		if (msg.author.id == storm) {	
			guild.channels.get(logChannels).createMessage({
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
			return
		}
		else {
			msg.member.ban(0, "scammer").catch(console.error) // ban the scammer 
			
			//console.log("Banned a scammer.");
			
			guild.channels.get(logChannels).createMessage({ // create a message regarding the details
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
			return
	    }
	};	
}

module.exports = {
	saveRegex,
	messageScan
}

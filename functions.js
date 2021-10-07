const fs = require("fs");
const {small, full} = require("./regex.js");
const {storm, logChannels} = require("./constants.js")

function errorMessage(channelId, guild) { //if nine ball encounters an error
	guild.channels.get(channelId).createMessage({ // create a message regarding the details
			embed: {
				"description": `Error. Your command did not save. Check the command?`,
				"color": 15158332,
				"footer": {
					"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
					"text": "Those who only bring chaos... they are simply not part of the program."
					},
			}
	});
	return
}

function shutdown(msg) { //exiting the process
	let guild = msg.channel.guild;
	let channelId = msg.channel.id;
	guild.channels.get(channelId).createMessage("Shutting down...")
	setTimeout(function() { 
		process.exit(0); 
	}, 3000);
	return
}

function disable(guild, channelId) { //when nine ball is disabled
	if (disabled == false) {
		disabled = true
		guild.channels.get(channelId).createMessage("Nine Ball disabled!")
	}
	else {
		disabled = false
		guild.channels.get(channelId).createMessage("Nine Ball has been enabled.")
	}
	return
}

async function directMessage(dmContents, user) { //sending a DM
	let channel = await user.getDMChannel();
	return channel.createMessage(dmContents).catch(console.error)
}

function saveRegex() { //saving an updated regex list
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

function kickMember(guild, member) { //kicking a member when they're too new
	let userId = member.id;
	
	let logId = logChannels[guild.id]
	if (!logId) return  // not in a configured server
	let logChannel = guild.channels.get(logId)
	
	guild.channels.get(logId).createMessage({ // create a message regarding the details
		embed: {
			"description": `<@${userId}> was kicked for being under the one week account age threshold.`,
			"color": 5902353,
			"footer": {
				"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
				"text": "...Come no closer."
			},
		}
	});
	
	return member.kick("Account is under one week old.")
	return
}

function embedList(guild, channelId, indexLength, lines) { //a function that lists all regex filters
	let n = Math.ceil(lines.length / 20)
	for (let i = 0; i < n; i++) { //can't go over 20 lines due to text cap Discord imposes
		let response = lines.slice(i*20, (i+1)*20).join("\n")
		response = "```\n" + response + "\n```" //three backticks lets the regex be properly displayed
		if ((n - 1) == i) {
			guild.channels.get(channelId).createMessage({
				embed: {
					"description": `${response}`,
					"color": 5902353,
					"footer": {
						"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
						"text": "All system checks are complete."
					},
				}
			});
		}
		else {
			guild.channels.get(channelId).createMessage({
				embed: {
					"description": `${response}`,
					"color": 5902353,
				}
			});
		}
	}
	return
}

function postMessage(guild, channelId, regexType) { //each message has an embed
	guild.channels.get(channelId).createMessage({
		embed: {
			"description": `${regexType}`,
			"color": 3381521,
			"footer": {
				"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
				"text": "Modifying program... final level..."
			}
		}
	});	
}
async function messageScan(msg) { //the main function of nine ball is to scan messages, this is it
	let guild = msg.channel.guild;
	
	let server = msg.guild;
	let logId = logChannels[guild.id]
	if (!logId) return  // not in a configured server
	let logChannel = guild.channels.get(logId)
	
	let result = full.findIndex(pattern => pattern.test(msg.cleanContent));
	var backupFilter = false;
	let count = 0
	if (result == -1) {
		let urlPrefix = new RegExp("(https?:\/\/|www\.)")
		let urlMatch = msg.content.match(urlPrefix)
		for (let pattern of small) {
			let match = msg.content.match(pattern)
			if (match && (!urlMatch || match.index < urlMatch.index)) {
				count += 1
			}
		}
	};
	
	if (count > 2) {
		backupFilter = true;
	};
	
	if (backupFilter == true) {
		if (msg.author.id == storm) { // don't attempt to ban storm for testing this lol
			let testId = msg.channel.id;
			guild.channels.get(testId).createMessage("Generic filter working. Test complete!")
			return
		}
		else {
			let dmContents = "You have tripped an anti-scam filter. Nine Ball is meant to autoban anyone posting scam links.\nIf you are not currently active at the time of receiving this message, especially if you find yourself banned from multiple Discord servers, your Discord token has been stolen and a bot has access to your account.\nIf you were active at the time of receiving this message, it might have been a false positive and you will be promptly unbanned."
			let user = msg.author
			
			await directMessage(dmContents, user);
			
			msg.member.ban(0, "scammer").catch(console.error) // ban the scammer 
		}
   
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
		return
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
			return
		}
		else {
			let dmContents = "You have tripped an anti-scam filter. Nine Ball is meant to autoban anyone posting scam links.\nIf you are not currently active at the time of receiving this message, especially if you find yourself banned from multiple Discord servers, your Discord token has been stolen and a bot has access to your account.\nIf you were active at the time of receiving this message, it might have been a false positive and you will be promptly unbanned."
			let user = msg.author
			
			await directMessage(dmContents, user);
			msg.member.ban(0, "scammer").catch(console.error) // ban the scammer 
			
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
			return
	    }
	};	
}
//this allows all other files to utilize the functions in this file
module.exports = { 
	saveRegex,
	messageScan,
	errorMessage,
	shutdown,
	embedList,
	postMessage,
	kickMember,
	directMessage
}

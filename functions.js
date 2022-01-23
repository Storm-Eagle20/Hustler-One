const fs = require("fs");
const path = require("path")
const {small, full} = require("./regex.js");
const {whitelist} = require("./whitelist.js")
const {storm, logChannels} = require("./constants.js")

function uploadFiles(channelId, guild) {
	let filenames = ["regex.js", "whitelist.js"]
	let files = []
	for (let filename of filenames) {
		filename = path.resolve(require.main.path, filename)
		let file = {
			name: path.basename(filename),
			file: fs.readFileSync(filename),
		}
		files.push(file)
	}
	return guild.channels.get(channelId).createMessage({}, files)
}

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

function disable(channelId, guild) { //when nine ball is disabled
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

let lastWarn = null
let cooldown = 60000
function nbDisabled(guild, logId) { //while nine ball is disabled
	let currentTime = new Date()
	if (lastWarn === null || currentTime - lastWarn > cooldown) {
		guild.channels.get(logId).createMessage("Nine Ball is currently disabled. A message was posted but it was not scanned.")
		lastWarn = currentTime
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

function saveWhitelist() { //saving the whitelist
	whitelistStr = "whitelist = [\n" + whitelist.map(patt => `    ${patt},\n`).join("") + "]\n"
	exportStr = "module.exports = {\n    whitelist\n}\n"
	regexFile = `${whitelistStr}\n${exportStr}`
	
	fs.writeFile('whitelist.js', regexFile, (err) => {
		if (err) {
		console.error(err)
		return
		}
	});
	return
}

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

function noKick(guild, member) { //only used if Nine Ball is disabled and a new account joins
	let userId = member.id;
	let logId = logChannels[guild.id]
	if (!logId) return  // not in a configured server
	let logChannel = guild.channels.get(logId)
	
	guild.channels.get(logId).createMessage({ 
		embed: {
			"description": `<@${userId}> joined, but they were not kicked as Nine Ball is disabled.`,
			"color": 5902353,
			"footer": {
				"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
				"text": "...Come no closer."
			},
		}
	});
	return
}

//count number of scam bans
let banCount = 0
function countBans(channelId, guild) {
	guild.channels.get(channelId).createMessage({
		embed: {
			"description": `There have been ${banCount} scammers banned.`,
			"color": 3381521,
			"footer": {
				"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
				"text": "Those who only bring chaos... they are simply not part of the program."
			}
		}
	});	
}

function embedList(channelId, guild, indexLength, lines) { //a function that lists all regex filters
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

function postMessage(channelId, guild, regexMessage, embedColor) { //each message has an embed
	if (embedColor == true) {
		guild.channels.get(channelId).createMessage({
			embed: {
				"description": `${regexMessage}`,
				"color": 15207436, //red embed
				"footer": {
					"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
					"text": "Modifying program... final level..."
				}
			}
		});
	}
	else {
		guild.channels.get(channelId).createMessage({
			embed: {
				"description": `${regexMessage}`,
				"color": 3381521, //green embed
				"footer": {
					"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
					"text": "Modifying program... final level..."
				}
			}
		});
	}
}
async function messageScan(msg) { //the main function of nine ball is to scan messages, this is it
	let guild = msg.channel.guild;
	let server = msg.guild;
	let logId = logChannels[guild.id]
	if (!logId) return  // not in a configured server
	let logChannel = guild.channels.get(logId)
	
	let cyrillic = /\p{sc=Cyrillic}/u
	let cyrillicMatch = msg.content.match(cyrillic)
	let urlPrefix = new RegExp("(https?:\/\/|www\.)")
	let urlMatch = msg.content.match(urlPrefix)
	if (!urlMatch) { //nine ball won't scan any message without urls
		if (!cyrillicMatch) return //if cyrillic characters aren't detected
		else { //deletes any message with cyrillic characters but no url
			guild.channels.get(logId).createMessage({ //create a message after deleting the message
				embed: {
					"description": `Cyrillic message deleted. Contents:`,
					"color": 1715584,
					"footer": {
						"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
						"text": "Ranking AC identified as: Nine Ball"
					},
					"fields": [ 
						{
						"name": `**${msg.author.username}#${msg.author.discriminator}:**`, // discord ID
						"value": `\`\`\`\n${msg.cleanContent}\n\`\`\`` // copy of the scam message
						}
					]
				}
			});
			msg.delete().catch(console.error);
			return
		}
	}
	
	let dmContents = "You have tripped an anti-scam filter. Nine Ball is meant to autoban anyone posting scam links.\nIf you are not currently active at the time of receiving this message, especially if you find yourself banned from multiple Discord servers, your Discord token has been stolen and a bot has access to your account.\nIf you were active at the time of receiving this message, it might have been a false positive and you will be promptly unbanned."
	
	if (cyrillicMatch) { //bans if cyrillic characters are detected + url
		let user = msg.author
			
		try {
			await directMessage(dmContents, user)
		} catch (error) {
			console.log(error)
		}
			
		try {
			msg.member.ban(0, "scammer") // ban the scammer 
		} catch (error) {
			msg.delete().catch(console.error); // if the user is already banned but posted multiple messages
			return
		}
		
		banCount += 1
		
		guild.channels.get(logId).createMessage({ // create a message regarding the details
			embed: {
				"description": `Banned a scammer! Cyrillic with url detected.`,
				"color": 1715584,
				"footer": {
					"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
					"text": "Target verified. Commencing hostilities!"
					},
				"fields": [ 
					{
					"name": `**${msg.author.username}#${msg.author.discriminator}:**`, // discord ID
					"value": `\`\`\`\n${msg.cleanContent}\n\`\`\`` // copy of the scam message
					}
				]
			}
		});
		msg.delete().catch(console.error); // delete offending message. it's put after the log message to avoid any potential errors.
		return
	}
	
	let check = whitelist.findIndex(pattern => pattern.test(msg.content));
	if (check > -1) return
	
	let result = full.findIndex(pattern => pattern.test(msg.content));
	var backupFilter = false;
	let count = 0
	if (result == -1) {
		let text = msg.content.substring(0, urlMatch.index)
		for (let pattern of small) {
			let matches = text.match(pattern)
			if (matches) {
				count += matches.length
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
			let user = msg.author
			
			try {
				await directMessage(dmContents, user)
			} catch (error) {
				console.log(error)
			}
			
			try {
				msg.member.ban(0, "scammer") // ban the scammer 
			} catch (error) {
				msg.delete().catch(console.error); // if the user is already banned but posted multiple messages
				return
			}
		}
		
		banCount += 1
		
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
					"value": `\`\`\`\n${msg.cleanContent}\n\`\`\`` // copy of the scam message
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
						"value": `\`\`\`\n${msg.cleanContent}\n\`\`\``
						}
					]
				}
			});
			return
		}
		else {
			let user = msg.author
			
			try {
				await directMessage(dmContents, user)
			} catch (error) {
				console.log(error)
			}
			
			try {
				msg.member.ban(0, "scammer") // ban the scammer 
			} catch (error) {
				msg.delete().catch(console.error); // if the user is already banned but posted multiple messages
				return
			}
			
			banCount += 1
			
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
						"value": `\`\`\`\n${msg.cleanContent}\`\`\`` // copy of the scam message
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
	saveWhitelist,
	messageScan,
	errorMessage,
	shutdown,
	embedList,
	postMessage,
	kickMember,
	noKick,
	directMessage,
	countBans,
	nbDisabled,
	uploadFiles
}

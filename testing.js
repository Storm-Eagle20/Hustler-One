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
const update = /^8b/ //update command

const {small, full} = require("./regex.js"); // grab the regex filters

//let messageCount = 0

// checks if the message isn't from the bot itself and not
// from a private message
bot.on("messageCreate", async msg => {
    if (msg.author.bot) return;
    if (!msg.channel.guild) return;
	
	console.log("Test 1 passed.");
	
	if (msg.author.id == storm && msg.content.match(update)) {
		console.log("8b recognized!");
		let channelId = msg.channel.id;
		let newRegex = msg.content.replace("8b ","");
		full.push(newRegex);
		
		console.log("Test 2 passed.");
		
		smallStr = "small = [\n" + small.map(patt => `    ${patt},\n`).join("") + "]\n"
		fullStr = "full = [\n" + full.map(patt => `    ${patt},\n`).join("") + "]\n"
		exportStr = "module.exports = {\n    small,\n    full\n}\n"
		regexFile = `${smallStr}\n${fullStr}\n${exportStr}`
		
		console.log("Test 3 passed.");
		
		fs.writeFile('regex.js', regexFile, (err) => {
			if (err) {
			console.error(err)
			return
			}
		});
		
		console.log("Test 4 passed.");
		
		const guild = msg.channel.guild;
		guild.channels.get(channelId).createMessage({
			embed: {
				"description": `Update successful. Reload Eight Ball.`,
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
	
	console.log("Test 5 passed.");
	
	//messageCount += 1
	//console.log(`There have been ${messageCount} messages scanned.`);
	
	let moderators = msg.member.roles;
	let modValue = moderators.filter(roles => modRoles.includes(roles));
	if (msg.author.id != storm && modValue != "") return;
	
	console.log("Test 6 passed.");
	
	let server = msg.guild;
	let logId = logChannels[guild.id]
	if (!logId) return  // not in a configured server
	let logChannel = guild.channels.get(logId)
	
	console.log("Test 7 passed.");
	
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
	
	console.log("Test 8 passed.");

	if (count > 2) {
		backupFilter = true;
	};
	
	console.log("Test 9 passed.");

	if (backupFilter == true) {
		if (msg.author.id == storm) { // don't attempt to ban storm for testing this lol
			console.log("This test passed.");
		}
		else console.log("Test 10 passed."); //(msg.member.ban(0, "scammer").catch(console.error)) // ban the scammer 
		
		//console.log("Banned a scammer.");
		
		guild.channels.get(logId).createMessage({ // create a message regarding the details
			embed: {
				"description": `This would've normally resulted in a ban, but didn't.`,
				"color": 1715584,
				"footer": {
					"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
					"text": "Hustler Two"
					},
				"fields": [ 
					{
					"name": `**${msg.author.username}#${msg.author.discriminator}:**`, // discord ID
					"value": `${msg.cleanContent}` // copy of the scam message
					}
				]
			}
		});
		//msg.delete().catch(console.error); // delete offending message. it's put after the log message to avoid any potential errors.
	};
	console.log("Test 11 passed.");
	if (result > -1) {
		console.log("Test 12 passed.");
		let pattern = full[result];
		// checks if the ID is from The Raven
		if (msg.author.id == storm) {	
			guild.channels.get(logId).createMessage({
				embed: {
					"description": `Testing successful. Matched result: \n\`\`\`\n${pattern.source}\n\`\`\``, // for testing filters
					"color": 1715584,
					"footer": {
						"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
						"text": "Hustler Two"
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
			//msg.member.ban(0, "scammer").catch(console.error) // ban the scammer 
			
			console.log("Banned a scammer.");
			
			guild.channels.get(logId).createMessage({ // create a message regarding the details
				embed: {
					"description": `This would've normally resulted in a ban, but didn't.`,
					"color": 1715584,
					"footer": {
						"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
						"text": "Hustler Two"
					},
					"fields": [ 
						{
						"name": `**${msg.author.username}#${msg.author.discriminator}:**`, // discord ID
						"value": `${msg.cleanContent}` // copy of the scam message
						}
					]
				}
			});
			//msg.delete().catch(console.error); // delete offending message. it's put after the log message to avoid any potential errors.
	    }
	};
});

bot.connect();

const {small, full} = require("./regex.js");
const {saveRegex, messageScan} = require("./functions.js");

const update = /^8b(?: (commands|list|remove|modify))?(?: ([1-9][0-9]*))?(?: `(.+)`)?( \-generic)?/ //update command, explained below

//match[1] = (commands|list|remove |modify )
//match[2] = ([1-9][0-9]*)
//match[3] = ( `(.+)`)
//match[4] = the wildcard in match[3]
//match[5] = ( \-generic)

let regexType = "test"; 
//this is a variable used 
//in an embed when Nine Ball is updated.

function nbCommands(msg) {
	//let updateContent = msg.content.replace(update,'$1');
	let indexNumber = 0;
	
	let channelId = msg.channel.id;
	
	console.log("Test 1 passed.")
	
	let nbCommand = msg.content.match(update)
	if (!nbCommand) return;
	
	let guild = msg.channel.guild;
	
	if (nbCommand[1] == "commands") { //"9b commands"
		console.log("Matched commands.")
		guild.channels.get(channelId).createMessage({
			embed: {
				"description": `The commands Nine Ball has are as follows:`,
				"color": 8652567,
				"footer": {
					"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
					"text": "Hustler One"
				},
				"fields": [ 
					{
					"name": `9b commands`,
					"value": `Displays this message.`
					},
					{
					"name": `9b list`,
					"value": `Lists all targeted filters.`
					},
					{
					"name": `9b list -generic`,
					"value": `Lists all generic filters.`
					},
					{
					"name": `9b [regex here]`,
					"value": `Adds a new targeted filter. REPLACE BRACKETS WITH BACKTICKS!`
					},
					{
					"name": `9b [regex here] -generic`,
					"value": `Adds a new generic filter. REPLACE BRACKETS WITH BACKTICKS!`
					},
					{
					"name": `9b remove x`,
					"value": `Removes a targeted filter based on index number.`
					},
					{
					"name": `9b remove x -generic`,
					"value": `Removes a generic filter based on index number.`
					},
					{
					"name": `9b modify x [regex here]`,
					"value": `Replaces a targeted filter based on index number. REPLACE BRACKETS WITH BACKTICKS!`
					},
					{
					"name": `9b modify x [regex here] -generic`,
					"value": `Replaces a generic filter based on index number. REPLACE BRACKETS WITH BACKTICKS!`
					}
				]}
		})
		return
	}
	else if (nbCommand[1] == "list") {
		console.log("Matched list.")
		if (nbCommand[4]) { //generic regex filter 
			let indexLength = small.length;
			let lines = small.map((regex, index) => `${index}: ${regex}`)
			let n = Math.ceil(lines.length / 20)
			for (let i = 0; i < n; i++) { //can't go over 20 lines due to text cap Discord imposes
				let response = lines.slice(i*20, (i+1)*20).join("\n")
				response = "```\n" + response + "\n```" //three backticks lets the regex be properly displayed
				guild.channels.get(channelId).createMessage(response);
			}
			return
		}
		else {
			let indexLength = full.length; //targeted regex filter
			let lines = full.map((regex, index) => `${index}: ${regex}`)
			let n = Math.ceil(lines.length / 20)
			for (let i = 0; i < n; i++) { //can't go over 20 lines due to text cap Discord imposes
				let response = lines.slice(i*20, (i+1)*20).join("\n")
				response = "```\n" + response + "\n```" //three backticks lets the regex be properly displayed
				guild.channels.get(channelId).createMessage(response);
			}
			return
		}
	}
	else if (nbCommand[1] == "remove") {
		console.log("Matched remove.")
		indexNumber = nbCommand[2];
		if (nbCommand[4]) { //generic regex splicing
			if (nbCommand[2] > small.length) return;
			if (nbCommand[2] < 0) return; //check for invalid values
			small.splice(indexNumber, 1); //remove specified value
			saveRegex();
			guild.channels.get(channelId).createMessage("Generic filter removed.")
			return
		}
		else { //targeted regex splicing
			if (nbCommand[2] > full.length) return;
			if (nbCommand[2] < 0) return; //check for invalid values
			full.splice(indexNumber, 1); //remove specified value
			saveRegex();
			guild.channels.get(channelId).createMessage("Targeted filter removed.")
			return
		}
	}
	else if (nbCommand[1] == "modify") {
		console.log("Matched modify.")
		indexNumber = nbCommand[2];
		let regexChanges = nbCommand[3];
		if (nbCommand[3] == "``" || "") return; //don't place a blank regex filter, this results in false autobans...
		
		if (nbCommand[4]) { //generic regex editing
			if (nbCommand[2] > small.length) return;
			if (nbCommand[2] < 0) return; //check for invalid values
			small.splice(indexNumber, 1, regexChanges); //remove specified value
			saveRegex(small);
			guild.channels.get(channelId).createMessage("Generic filter updated.")
			return
		}
		else { //targeted regex editing
			if (nbCommand[2] > full.length) return;
			if (nbCommand[2] < 0) return; //check for invalid values
			full.splice(indexNumber, 1, regexChanges); //remove specified value
			saveRegex(full);
			guild.channels.get(channelId).createMessage("Targeted filter updated.")
			return
		}
	}
	else if (nbCommand[3]) { //update the bot
		console.log("Matched the update filter.")
		let newRegex = new RegExp(nbCommand[3])
		if (nbCommand[4]) {
			small.push(newRegex) //push to generic regex filter
			regexType = "generic";
			saveRegex(small); //save to file
		}
		else {
			full.push(newRegex) //push to targeted regex filter
			regexType = "targeted";
			saveRegex(full); //save to file
		}
		
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
	}
	else {
		console.log(nbCommand[3]) 
		return;
	}		
}	

module.exports = {
	nbCommands
};

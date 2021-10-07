const {small, full} = require("./regex.js");
const {saveRegex, messageScan, errorMessage, embedList, postMessage} = require("./functions.js");

const update = /^9b(?: (commands|list|remove|modify))?(?: ([1-9][0-9]*|0))?(?: `(.+)`)?( \-generic)?/ //update command, explained below

//nbCommand[1] is (commands|list|remove|modify)
//nbCommand[2] is ([1-9][0-9]*)
//nbCommand[3] is (.+)
//nbCommand[4] is ( \-generic)

let regexType = "test"; 
//this is a variable used 
//in an embed when Nine Ball is updated.

function nbCommands(msg) {
	//let updateContent = msg.content.replace(update,'$1');
	let indexNumber = 0;
	let channelId = msg.channel.id;
	let guild = msg.channel.guild;
	
	let nbCommand = msg.content.match(update)
	if (!nbCommand) return;
	
	if (nbCommand[1] == "commands") { //"9b commands"
		guild.channels.get(channelId).createMessage({
			embed: {
				"description": `The commands Nine Ball has are as follows:`,
				"color": 8652567,
				"footer": {
					"icon_url": "https://vignette.wikia.nocookie.net/armoredcore/images/0/02/Hustler_One_Emblem.jpg/revision/latest?cb=20140615012341",
					"text": "Combat mode is now engaged."
				},
				"fields": [ 
					{
					"name": `9b disable`,
					"value": `Disables all moderation from Nine Ball. Use command again to re-enable.`
					},
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
	else if (nbCommand[1] == "list") { //list the regex
		if (nbCommand[4]) { //generic regex filter 
			let indexLength = small.length;
			let lines = small.map((regex, index) => `${index}: ${regex}`)
			embedList(guild, channelId, indexLength, lines);
			return
		}
		else {
			let indexLength = full.length; //targeted regex filter
			let lines = full.map((regex, index) => `${index}: ${regex}`)
			embedList(guild, channelId, indexLength, lines);
			return
		}
	}
	else if (nbCommand[1] == "remove") { //remove a regex filter
		indexNumber = nbCommand[2];
		if (nbCommand[4]) { //generic regex splicing
			let smallSize = parseInt(small.length)

			if (indexNumber > smallSize) {
				errorMessage(channelId, guild);
				return
			}
			if (indexNumber < 0) {
				errorMessage(channelId, guild);
				return //check for invalid values
			}
			small.splice(indexNumber, 1); //remove specified value
			saveRegex();
			regexType = "Generic filter removed."
			postMessage(guild, channelId, regexType); //post confirmation message
			return
		}
		else { //targeted regex splicing
			let fullSize = parseInt(full.length)
			if (indexNumber > fullSize) {
				errorMessage(channelId, guild);
				return
			}
			if (indexNumber < 0) {
				errorMessage(channelId, guild);
				return //check for invalid values
			}
			full.splice(indexNumber, 1); //remove specified value
			saveRegex();
			regexType = "Targeted filter removed."
			postMessage(guild, channelId, regexType); //post confirmation message
			return
		}
	}
	else if (nbCommand[1] == "modify") { //modify a regex filter
		indexNumber = nbCommand[2];
		if (nbCommand[4]) { //generic regex editing
			try {
				let regexChanges = new RegExp(nbCommand[3], "g")
				let smallSize = parseInt(small.length)

				if (indexNumber > smallSize) {
					errorMessage(channelId, guild);
					return
				}
				if (indexNumber < 0) {
					errorMessage(channelId, guild);
					return //check for invalid values
				}
				small.splice(indexNumber, 1, regexChanges); //remove specified value
			}
			catch (error) {
				errorMessage(channelId, guild); //account for undefined/errors
				return
			}
			saveRegex(small);
			regexType = "Generic filter updated."
			postMessage(guild, channelId, regexType); //post confirmation message
			return
		}
		else { //targeted regex editing
			try {
				let regexChanges = new RegExp(nbCommand[3], "g")
				let smallSize = parseInt(full.length)

				if (indexNumber > smallSize) {
					errorMessage(channelId, guild);
					return
				}
				if (indexNumber < 0) {
					errorMessage(channelId, guild);
					return //check for invalid values
				}
					full.splice(indexNumber, 1, regexChanges); //remove specified value
				}
				catch (error) {
					errorMessage(channelId, guild); //account for undefined/errors
					return
				}
			saveRegex(full);
			regexType = "Targeted filter updated."
			postMessage(guild, channelId, regexType); //post confirmation message
			return
		}
	}
	else if (nbCommand[3]) { //update the regex filter with new regular expressions
		let newRegex = null;
		try {
			newRegex = new RegExp(nbCommand[3], "i")
		}
		catch (error) {
			errorMessage(channelId, guild); //account for undefined/errors
			return
		}
		if (nbCommand[4]) {
			small.push(newRegex) //push to generic regex filter
			regexType = "Update successful. New generic regular expression added.";
			saveRegex(small); //save to file
		}
		else {
			full.push(newRegex) //push to targeted regex filter
			regexType = "Update successful. New targeted regular expression added.";
			saveRegex(full); //save to file
		}
		
		postMessage(guild, channelId, regexType); //post confirmation message
		
		return
	}
	else return;
}	

module.exports = {
	nbCommands
};

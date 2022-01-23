const {small, full} = require("./regex.js");
const {whitelist} = require("./whitelist.js");
const {saveRegex, saveWhitelist, messageScan, errorMessage, embedList, postMessage, countBans, uploadFiles} = require("./functions.js");

const update = /^9b(?: (commands|list|remove|modify|scamcount|upload))?(?: ([1-9][0-9]*|0))?(?: `(.+)`)?( \-generic| \-whitelist)?/ //update command, explained below

//nbCommand[1] is (commands|list|remove|modify|scamcount|upload)
//nbCommand[2] is ([1-9][0-9]*)
//nbCommand[3] is (.+)
//nbCommand[4] is ( \-generic)

let regexMessage = "test"; 
//this is a variable used 
//in an embed when Nine Ball is updated.

function nbCommands(msg) {
	//let updateContent = msg.content.replace(update,'$1');
	let indexNumber = 0;
	let channelId = msg.channel.id;
	let guild = msg.channel.guild;
	
	let nbCommand = msg.content.match(update)
	if (!nbCommand) return;
	
	let embedColor = false //used later to determine red or green embed color
	
	if (nbCommand[4]) { //whether to update generic or whitelist filter
		if (nbCommand[4] == " -generic") {
			regexType = small
		}
		else {regexType = whitelist}
	}
	
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
					"name": `9b list -whitelist`,
					"value": `Lists the whitelist.`
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
					"name": `9b [regex here] -whitelist`,
					"value": `Adds a new term to the whitelist. REPLACE BRACKETS WITH BACKTICKS!`
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
					"name": `9b remove x -whitelist`,
					"value": `Removes a whitelisted term based on index number.`
					},
					{
					"name": `9b modify x [regex here]`,
					"value": `Replaces a targeted filter based on index number. REPLACE BRACKETS WITH BACKTICKS!`
					},
					{
					"name": `9b modify x [regex here] -generic`,
					"value": `Replaces a generic filter based on index number. REPLACE BRACKETS WITH BACKTICKS!`
					},
					{
					"name": `9b modify x [regex here] -whitelist`,
					"value": `Replaces a whitelist term based on index number. REPLACE BRACKETS WITH BACKTICKS!`
					},
					{
					"name": `9b scamcount`,
					"value": `Lists amount of scams since last bootup.`
					},
					{
					"name": `9b upload`,
					"value": `Uploads regex files.`
					}
				]}
		})
		return
	}
	else if (nbCommand[1] == "list") { //list the regex
		if (nbCommand[4]) { //generic or whitelist regex filter 
			let indexLength = regexType.length;
			let lines = regexType.map((regex, index) => `${index}: ${regex}`)
			embedList(channelId, guild, indexLength, lines);
			return
		}
		else {
			let indexLength = full.length; //targeted regex filter
			let lines = full.map((regex, index) => `${index}: ${regex}`)
			embedList(channelId, guild, indexLength, lines);
			return
		}
	}
	else if (nbCommand[1] == "remove") { //remove a regex filter
		indexNumber = nbCommand[2];
		if (nbCommand[4]) { //generic regex splicing
			let smallSize = parseInt(regexType.length)

			if (indexNumber > smallSize) {
				errorMessage(channelId, guild);
				return
			}
			if (indexNumber < 0) {
				errorMessage(channelId, guild);
				return //check for invalid values
			}
			
			if (nbCommand[4] == " -generic") {
				small.splice(indexNumber, 1); //remove specified value
				saveRegex();
				regexMessage = "Generic filter removed."
			}
			else {
				whitelist.splice(indexNumber, 1); //remove specified value
				saveWhitelist();
				regexMessage = "Whitelist filter removed."
			}
			
			embedColor = true
			
			postMessage(channelId, guild, regexMessage, embedColor); //post confirmation message
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
			regexMessage = "Targeted filter removed."
			embedColor = true
			postMessage(channelId, guild, regexMessage, embedColor); //post confirmation message
			return
		}
	}
	else if (nbCommand[1] == "modify") { //modify a regex filter
		indexNumber = nbCommand[2];
		if (nbCommand[4]) { //generic regex editing
			try {
				let regexChanges = new RegExp(nbCommand[3], "gi")
				let smallSize = parseInt(regexType.length)
				if (indexNumber > smallSize) {
					errorMessage(channelId, guild);
					return
				}
				if (indexNumber < 0) {
					errorMessage(channelId, guild);
					return //check for invalid values
				}
				
				if (nbCommand[4] == " -generic") {
					small.splice(indexNumber, 1, regexChanges); //remove specified value
					regexMessage = "Generic filter updated."
					saveRegex(small);
				}
				else {
					whitelist.splice(indexNumber, 1, regexChanges);
					regexMessage = "Whitelist updated."
					saveWhitelist(whitelist);
				}
			}
			catch (error) {
				console.log(error)
				errorMessage(channelId, guild); //account for undefined/errors
				return
			}
			postMessage(channelId, guild, regexMessage, embedColor); //post confirmation message
			return
		}
		else { //targeted regex editing
			try {
				let regexChanges = new RegExp(nbCommand[3], "gi")
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
			regexMessage = "Targeted filter updated."
			postMessage(channelId, guild, regexMessage, embedColor); //post confirmation message
			return
		}
	}
	else if (nbCommand[1] == "scamcount") {
		countBans(channelId, guild)
		return
	}
	else if (nbCommand[1] == "upload") {
		uploadFiles(channelId, guild)
		return
	}
	else if (nbCommand[3]) { //update the regex filter with new regular expressions
		let newRegex = null;
		try {
			newRegex = new RegExp(nbCommand[3], "gi")
		}
		catch (error) {
			errorMessage(channelId, guild); //account for undefined/errors
			return
		}
		if (nbCommand[4]) {
			if (nbCommand[4] == " -generic") {
				small.push(newRegex) //push to generic regex filter
				regexMessage = "Update successful. New generic regular expression added.";
				saveRegex(small); //save to file
			}
			else {
				whitelist.push(newRegex)
				regexMessage = "Update successful. New whitelist added.";
				saveWhitelist(whitelist);
			}
		}
		else {
			full.push(newRegex) //push to targeted regex filter
			regexMessage = "Update successful. New targeted regular expression added.";
			saveRegex(full); //save to file
		}
		
		postMessage(channelId, guild, regexMessage, embedColor); //post confirmation message
		
		return
	}
	else return;
}	

module.exports = {
	nbCommands
};

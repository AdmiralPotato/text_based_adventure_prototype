var outputBuffer = document.getElementById('output');
var inputForm = document.getElementById('input_form');
var commandInput = document.getElementById('command_input');
outputBuffer.innerHTML = '';
var copyToBuffer = function (input) {
	outputBuffer.innerHTML += input + '\n\n';
	outputBuffer.scrollTo(0, outputBuffer.scrollHeight);
};

var listOptions = function (options) {
	var output = '';
	var wordCount = 0;
	options.forEach(function (item) {
		output += '\t' + item;
		wordCount++;
		if (wordCount === 4) {
			output += '\n';
			wordCount = 0;
		}
	});
	return output;
};

var help = function () {
	var output = 'You can use the following commands:\n';
	output += listOptions(
		Object.keys(verbs).filter(function (verb) {
			return verbs[verb];
		})
	);
	return output;
};

var items = {
	flask: {
		description: [
			'The flask looks like it can hold 1.2 litres',
			'worth of fluids. Someone has laser-etched',
			'a PipsCat on to it.',
		].join('\n'),
		use: [
			'What are you, some kinda drunk?',
		].join('\n'),
	},
	duzzy: {
		description: [
			'He looks menacing, but definitely not a clone.',
		].join('\n'),
		use: [
			'He gives only bad advice.',
		].join('\n'),
	},
	goat: {
		description: [
			'The Goat looks very wise.',
		].join('\n'),
		use: [
			'He gives only good advice.',
		].join('\n'),
	},
	staff: {
		description: [
			'This staff has a heart, some wings, a bird beak,',
			'a moon, several different colors of gemstones,',
			'some alchemical transmutation circles, and the',
			'whole thing is covered in glitter.',
			'Somebody is compensating.',
		].join('\n'),
	},
};

var rooms = {
	start: {
		description: [
			'You have entered the Dungeon.',
			'',
			'It looks like there was some sophisticated',
			'security system that should have kept out',
			'any intruders, but there is a power switch',
			'next to it that has clearly been left off.',
		].join('\n'),
		items: [
			'flask',
			'duzzy',
		],
		directions: {
			north: 'main_hall_north',
			east: 'torii_gate',
			south: 'goat_room',
			west: 'west_room',
		},
	},
	main_hall_north: {
		description: [
			'You are in Main Hall North.',
			'There is nothing but filth here.',
			'Broken devices, empty Cactus Cooler cans, ',
			'and smelly Smash Bros. players.',
		].join('\n'),
		items: [
			'duzzy',
		],
		directions: {
			south: 'start',
		},
	},
	goat_room: {
		description: [
			'You are in the Goat Room.',
			'There is a wise old Goat here.',
		].join('\n'),
		items: [
			'goat',
		],
		directions: {
			north: 'start',
		},
	},
	west_room: {
		description: [
			'You are in the West Room.',
			'There are some Village People here.',
			'They seem to be dancing.',
			'Disco is still alive here.',
		].join('\n'),
		directions: {
			east: 'start',
		},
	},
	torii_gate: {
		description: [
			'You are at the Torii Gate.',
			'If you go through this gate, you will',
			'be transformed into a magical girl.',
		].join('\n'),
		directions: {
			west: 'start',
			gate: 'magical_girl',
		},
	},
	magical_girl: {
		description: [
			'You have transformed into a Magical Girl.',
			'',
			'Hooray.',
		].join('\n'),
		items: [
			'staff',
		],
		directions: {
			back: 'torii_gate',
		},
	},
};

var currentRoomName;
var currentRoom;
var inventoryContents;
var roomInventories;

var prepRoomInventories = function () {
	Object.keys(rooms).forEach(function (roomName) {
		roomInventories[roomName] = (rooms[roomName].items || []).slice();
	});
};

var reset = function () {
	var output = 'Game state reset';
	currentRoomName = 'start';
	currentRoom = rooms[currentRoomName];
	inventoryContents = [];
	roomInventories = {};
	prepRoomInventories();
	return output;
};

var lookupItem = function (targetString) {
	var target;
	if (targetString) {
		var isItemInInventory = inventoryContents.includes(targetString);
		var isItemRoom = roomInventories[currentRoomName].includes(targetString);
		if (
			isItemInInventory
			|| isItemRoom
		) {
			target = items[targetString];
		}
	}
	return target;
};

var look = function (targetString) {
	var output = '';
	var target = targetString
		? lookupItem(targetString)
		: currentRoom;
	if (target) {
		output += target.description + '\n';
		var itemsInRoom = roomInventories[currentRoomName];
		if (
			target.items
			&& itemsInRoom.length
		) {
			output += '\nIn this room, you see:\n';
			output += listOptions(itemsInRoom);
		}
		if (target.directions) {
			output += '\nExits are:\n';
			output += listOptions(
				Object.keys(target.directions)
			);
		}
	} else {
		output += `You try to look at "${targetString}",\nbut only the void stares back.`
	}
	return output;
};

var go = function (targetString) {
	var output = '';
	var newRoom;
	if (targetString) {
		var destinationRoomName = currentRoom.directions[targetString];
		var newRoom = rooms[destinationRoomName];
		if (newRoom) {
			currentRoomName = destinationRoomName;
			currentRoom = newRoom;
			output += look();
		} else {
			output += `You cannot go "${targetString}"`;
		}
	} else {
		output += 'You cannot go nowhere';
	}
	return output;
};

var inventory = function (targetString) {
	var output = 'You look in your Laptop Bag of Holding.\nYou have:\n';
	var options = inventoryContents.length
		? inventoryContents
		: ['nothing'];
	output += listOptions(options);
	return output;
};

var get = function (targetString) {
	var output = '';
	var target = lookupItem(targetString);
	if (!targetString) {
		output += 'You cannot get nothing';
	} else if (target) {
		if (inventoryContents.includes(targetString)) {
			output += `"${targetString}" is already in your inventory`;
		} else {
			var currentRoomInventory = roomInventories[currentRoomName];
			var currentItemIndex = currentRoomInventory.indexOf(targetString);
			currentRoomInventory.splice(currentItemIndex, 1);
			inventoryContents.push(targetString);
			output += `"${targetString}" has been added to inventory`;
		}
	} else {
		output += `You cannot get "${targetString}"`;
	}
	return output;
};

var drop = function (targetString) {
	var output = '';
	var inventoryIndex = inventoryContents.indexOf(targetString);
	if (!targetString) {
		output += 'You open your hands, and nothing falls to the ground';
	} else if (inventoryIndex === -1) {
		output += `You cannot drop "${targetString}"`;
	} else {
		var currentRoomInventory = roomInventories[currentRoomName];
		var currentItemIndex = currentRoomInventory.indexOf(targetString);
		inventoryContents.splice(inventoryIndex, 1);
		currentRoomInventory.push(targetString);
		output += `You have dropped "${targetString}" in the current room`;
	}
	return output;
};

var use = function (targetString) {
	var output = '';
	var target = lookupItem(targetString);
	if (!targetString) {
		output += 'You cannot use nothing.';
	} else if (!target) {
		output += `There is no "${targetString}" here.`;
	} else {
		output += target.use || 'Nothing happens.';
	}
	return output;
};

var verbs = {
	look,
	go,
	get,
	drop,
	inventory,
	use,
	open: null,
	hack: null,
	help,
	eat: null,
	yeet: null,
	reset,
};

reset();
copyToBuffer(look());

var processCommand = function (commandString) {
	var segments = commandString.split(' ');
	var verbString = segments[0].toLocaleLowerCase();
	var targetString = (segments[1] || '').toLocaleLowerCase();
	var verb = verbs[verbString];
	var output = '';
	if (verb) {
		output += '> ' + commandString + '\n';
		output += verb(targetString);
	} else {
		output += `INVALID COMMAND: ${commandString}`;
	}
	copyToBuffer(output);
};

inputForm.addEventListener('submit', function (event) {
	event.preventDefault();
	processCommand(commandInput.value);
	commandInput.value = '';
});

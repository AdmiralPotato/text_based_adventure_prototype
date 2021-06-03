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
		Object.keys(verbs)
	);
	copyToBuffer(output);
};

var duzzy = {
	description: [
		'He looks menacing.',
	].join('\n'),
};

var rooms = {
	start: {
		description: [
			'You have entered the Dungeon.',
			'',
			'It looks like there was some sophistocated',
			'security system that should have kept out',
			'any intruders, but there is a power switch',
			'next to it that has clearly been left off.',
		].join('\n'),
		objects: {
			flask: {
				description: [
					'The flask looks like it can hold 1.2 litres',
					'worth of fluids. Someone has laser-etched',
					'a PipsCat on to it.',
				].join('\n'),
			},
			duzzy
		},
		directions: {
			north: 'main_hall_north',
			south: 'goat_room',
		},
	},
	main_hall_north: {
		description: [
			'You are in Main Hall North.',
			'There is nothing but filth here.',
			'Broken devices, empty Cactus Cooler cans, ',
			'and smelly Smash Bros. players.',
		].join('\n'),
		objects: {
			duzzy
		},
		directions: {
			south: 'start',
		},
	},
	goat_room: {
		description: [
			'You are in the Goat Room.',
			'There is a wise old Goat here.',
		].join('\n'),
		objects: {
			goat: {
				description: [
					'The Goat looks very wise.',
				].join('\n'),
			}
		},
		directions: {
			north: 'start',
		},
	},
};

var currentRoom = rooms.start;

var look = function (targetString) {
	var target = currentRoom;
	var output = '';
	if (targetString) {
		target = currentRoom.objects[targetString];
	}
	if (target) {
		output += target.description;
		if (target.objects) {
			output += '\n\nIn this room, you see:\n';
			output += listOptions(
				Object.keys(target.objects)
			);
		}
		if (target.directions) {
			output += '\n\nExits are:\n';
			output += listOptions(
				Object.keys(target.directions)
			);
		}
	} else {
		output += `You try to look at ${targetString},\nbut only the void stares back.`
	}
	copyToBuffer(output);
};

var go = function (targetString) {
	var output = '';
	var newRoom;
	if (targetString) {
		var destinationRoomName = currentRoom.directions[targetString];
		var newRoom = rooms[destinationRoomName];
		if (newRoom) {
			currentRoom = newRoom;
			look();
		} else {
			output += `You cannot go "${targetString}"`;
		}
	} else {
		output += 'You cannot go nowhere';
	}
	copyToBuffer(output);
};

var verbs = {
	look,
	go,
	get: null,
	bag: null,
	inventory: null,
	use: null,
	open: null,
	hack: null,
	take: null,
	help,
	eat: null,
	yeet: null,
};
verbs.look();

var processCommand = function (commandString) {
	var segments = commandString.split(' ');
	var verbString = segments[0].toLocaleLowerCase();
	var targetString = (segments[1] || '').toLocaleLowerCase();
	var verb = verbs[verbString];
	if (verb) {
		copyToBuffer('> ' + commandString);
		verb(targetString);
	} else {
		copyToBuffer(`INVALID COMMAND: ${verbString}`);
	}
};

inputForm.addEventListener('submit', function (event) {
	event.preventDefault();
	processCommand(commandInput.value);
	commandInput.value = '';
});

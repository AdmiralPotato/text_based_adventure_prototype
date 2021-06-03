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

var currentRoom = {
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
		duzzy: {
			description: [
				'He looks menacing.',
			].join('\n'),
		}
	},
};

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
	} else {
		output += `You try to look at ${targetString},\nbut only the void stares back.`
	}
	copyToBuffer(output);
};

var verbs = {
	look,
	go: null,
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
	var targetString = segments[1];
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

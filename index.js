var outputBuffer = document.getElementById('output');
var inputForm = document.getElementById('input_form');
var commandInput = document.getElementById('command_input');
outputBuffer.innerHTML = '';
var copyToBuffer = function (input) {
	outputBuffer.innerHTML += input + '\n\n';
	outputBuffer.scrollTo(0, outputBuffer.scrollHeight);
};

var help = function () {
	var output = 'You can use the following commands:\n';
	var wordCount = 0;
	Object.keys(verbs).forEach(function (item) {
		output += '\t' + item;
		wordCount++;
		if (wordCount === 4) {
			output += '\n';
			wordCount = 0;
		}
	});
	copyToBuffer(output);
};

var verbs = {
	look: null,
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
verbs.help();

var processCommand = function (commandStrig) {
	var segments = commandStrig.split(' ');
	var verbString = segments[0].toLocaleLowerCase();
	var targetString = segments[1];
	var verb = verbs[verbString];
	if (verb) {
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

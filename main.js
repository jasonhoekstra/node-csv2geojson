var fs = require("fs");
var Lazy = require("lazy");
var argv = require('optimist').argv;
var Step = require('step');

var inFile, outFile;
var fieldLat = 'Latitude';
var fieldLon = 'Longitude';

var stop = false;
var i = 0;
var colCount = 0;
var headerArray;

if( typeof argv._[0] == 'undefined') {
	console.log("Input file is not specified.");
	process.exit(0);
} else {
	inFile = argv._[0];

	Step(function a() {
		new Lazy(fs.createReadStream(inFile, {
			encoding : 'utf-8'
		})).lines.forEach(function(line) {
			var elementArray = splitCSV(line.toString());
			if(i == 0) {
				colCount = elementArray.length;
				headerArray = elementArray;
				var foundLat = false;
				var foundLon = false;

				for( j = 0; j < headerArray.length; j++) {
					if(!foundLat && headerArray[j] == fieldLat)
						foundLat = true;
					if(!foundLon && headerArray[j] == fieldLon)
						foundLon = true;
				}

				if(!foundLat || !foundLon) {
					if(!foundLat)
						console.log("Latitude field (" + fieldLat + ") not found in the header");
					if(!foundLon)
						console.log("Longitude field (" + fieldLon + ") not found in the header");
					process.exit(1);
				} else {
					console.log('{');
					console.log('\t"type": "FeatureCollection", ');
					console.log('\t"features": [');
					console.log('\t\t{');
				}
			} else {
			}
			i++;
		});
	}, function b() {
		console.log('\t\t]');
		console.log('}');
	});
}

function splitCSV(txt, sep) {
	for(var foo = txt.split( sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
		if(foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
			if(( tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
				foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
			} else if(x) {
				foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
			} else
				foo = foo.shift().split(sep).concat(foo);
		} else
			foo[x].replace(/""/g, '"');
	}
	return foo;
}
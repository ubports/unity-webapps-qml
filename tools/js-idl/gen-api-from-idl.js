#!/usr/bin/nodejs

var WebIDL2 = require("webidl2");
var fs = require('fs');

if (process.argv.length < 3) {
    console.log('Invalid number of args');
    process.exit(1);
}
var IDL_FILE = process.argv[2];

var _defs = {};
var processInterfaceDefinition = function(interfaceAst) {
    var name = interfaceAst.name;
    console.log('Interface "' + name + '"');

    _defs.interfaces = _defs.interfaces || [];

    var iface = {name: name, members: { attributes: [], methods: [] }};
    for (var i = 0; i < interfaceAst.members.length; ++i) {
	var member = interfaceAst.members[i];
	console.log("\t" + member.name);
	console.log("\t\t" + member.type);

	if (member.type === 'operation') {
	    var method = {name: member.name, args: []};
	    for (var j = 0; j < member.arguments.length; ++j) {
		console.log("\t\t\t" + member.arguments[j].name
			    + ':' + member.arguments[j].idlType.idlType);

		method.args.push({name: member.arguments[j].name});
	    }
	    iface.members.methods.push(method);
	}
	else {
	    iface.members.attributes.push({name: member.name, type: member.idlType.idlType});
	}
    };

    _defs.interfaces.push(iface);
}

var generateUnityBindings = function(defs) {
    var unityif = defs.interfaces.filter(function (ifc) {
	return ifc.name === 'Unity';
    });
    if (!unityif.length) {
	console.log('Could not generate bindings');
	return;
    }
    
    
};

var processIdlFile = function (data) {
    var ast = WebIDL2.parse(data);
    for (var i = 0; i < ast.length; ++i) {
	console.log(ast[i].type);
	if (ast[i].type === "interface") {
	    processInterfaceDefinition(ast[i]);
	}
    }
    generateUnityBindings(_defs);
};


fs.readFile(IDL_FILE, 'utf8', function (err, data) {
  if (err) {
      console.log('Error while opening IDL file: ' + err);
      process.exit(1);
  }
  processIdlFile(data);
});


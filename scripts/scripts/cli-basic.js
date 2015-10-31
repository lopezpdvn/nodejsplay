var path = require('path');
var fs = require('fs');
var program = require('commander');
program.logd = "START LOG =========";

// Program configuration
program
  .version('0.0.1')
  .usage('[options] <file ...>')
  //.option('-i, --integer <n>', 'An integer argument', parseInt)
  //.option('-f, --float <n>', 'A float argument', parseFloat)
  //.option('-r, --range <a>..<b>', 'A range', range)
  .option('-c, --configdir <items>', 'List of configuration directories separated by ',
    function (val) { return val.split(new RegExp(path.delimiter, "g")) })
  //.option('-o, --optional [value]', 'An optional value')
  //.option('-c, --collect [value]', 'A repeatable value', collect, [])
  //.option('-v, --verbose', 'A value that can be increased', increaseVerbosity, 0)
  .parse(process.argv);

//console.log(' int: %j', program.integer);
//console.log(' float: %j', program.float);
//console.log(' optional: %j', program.optional);
//program.range = program.range || [];
//console.log(' range: %j..%j', program.range[0], program.range[1]);

if (typeof program.configdir === "undefined") {
    throw new Error("Please supply option -c/-- configdir ");
}
// If any path is not absolute, fail (syspol).
program.configdir.forEach(function (fpath) {
    fs.accessSync(fpath, fs.R_OK | fs.W_OK);
});

console.log(' list: %j', program.configdir);

//console.log(' collect: %j', program.collect);
//console.log(' verbosity: %j', program.verbose);
//console.log(' args: %j', program.args);


console.log(program.logd);
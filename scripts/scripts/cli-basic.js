var path = require('path');
var fs = require('fs');
var program = require('commander');
var sh = require('shelljs');

function checkDir(dirPath) {
    //fs.accessSync(fpath, fs.R_OK | fs.W_OK);
    fs.accessSync(dirPath, fs.R_OK);
    
    // test write permissions
    var fname = dirPath + '/dummy_file_name_ASDFFGAJSDFASDFASDF';
    fs.appendFileSync(fname, "DUMMY CONTENT");
    fs.unlinkSync(fname);
}

(function () {
    program.logd = "START LOG =========";
    var dateObj = new Date();
    var year = dateObj.getFullYear().toString();
    var month = (dateObj.getMonth() + 1).toString();
    var day = (dateObj.getDay() + 1).toString();
    
    datetimeElements = [[year, 4 - year.length], [month, 2 - month.length], 
        [day, 2 - day.length]].map(function (item) {
        for (var i = 0, rt = item[0]; i < item[1]; i++) {
            rt = "0" + rt;
        }
        return rt;
    });
    program.year = datetimeElements[0];
    program.month = datetimeElements[1];
    program.day = datetimeElements[2];
    program.datetimeStr = datetimeElements.join("");


})();

program
  .version('0.0.1')
  .usage('[options] <file ...>')
  //.option('-i, --integer <n>', 'An integer argument', parseInt)
  //.option('-f, --float <n>', 'A float argument', parseFloat)
  //.option('-r, --range <a>..<b>', 'A range', range)
  .option('-c, --configDir <items>', 'List of configuration directories separated by ',
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

if (typeof program.configDir === "undefined") {
    throw new Error("Please supply option -c/-- configdir ");
}
// If any path is not absolute, fail (syspol).
program.configDir.forEach(checkDir);
program.logDir = program.configDir.map(function (configDir) {
    var logDirPath = configDir + "/var/log/" + program.year + "/" 
        + program.month + "/" + program.day;
    try {
        checkDir(logDirPath);
    } catch (e) {
        sh.mkdir("-p", logDirPath);
        checkDir(logDirPath);
    }
    return logDirPath;
})

console.log(' list: %j', program.configDir);

//console.log(' collect: %j', program.collect);
//console.log(' verbosity: %j', program.verbose);
//console.log(' args: %j', program.args);

// LOG
program.log = function (msg, level) {
    level = level || 0;
    this.configDir.forEach(function (configDir) {
        var logDir = configDir + "/" 
    });
};
// log

console.log(program.logd);
throw new Error("END OF PROGRAM");
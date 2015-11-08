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

program.programName = "clibasic";
(function () {
    var dateObj = new Date();
    var year = dateObj.getFullYear().toString();
    var month = (dateObj.getMonth() + 1).toString();
    var day = dateObj.getDate().toString();
    
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
    program.logName = datetimeElements.join("") + "_log_" 
        + program.programName + ".txt";
})();

program
  .version('0.0.1')
  .usage('[options] <file ...>')
  .option('-c, --configDir <items>', 'List of configuration directories separated by ',
    function (val) { return val.split(new RegExp(path.delimiter, "g")) })
  .parse(process.argv);

if (typeof program.configDir === "undefined") {
    throw new Error("Please supply option -c/-- configdir ");
}

program.configDir.forEach(checkDir);
program.logDir = program.configDir.map(function (configDir) {
    var logDirPath = configDir + "/var/log/" + program.year + "/" 
        + program.month;
    try {
        checkDir(logDirPath);
    } catch (e) {
        sh.mkdir("-p", logDirPath);
        checkDir(logDirPath);
    }
    return logDirPath;
})

program.log = function (msg) {
    msg = "[" + (new Date()).toISOString() + "] " + msg + "\n";
    this.logDir.forEach(function (logDir) {
        msg.toEnd(logDir + "/" + program.logName);
    });
};

throw new Error("END OF PROGRAM");
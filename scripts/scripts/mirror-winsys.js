#! /usr/bin/env shjs

/* Mirrors directories/files on Windows system.
 *
 * - Depends on robocopy
 * - Doesn't support paths that contain the character ';'
*/

var sh = require('shelljs/global');
var fs = require('fs');
var path = require('path');
var program = require('commander');

// Configuration
function checkDir(dirPath) {
    //fs.accessSync(fpath, fs.R_OK | fs.W_OK);
    fs.accessSync(dirPath, fs.R_OK);
    
    // test write permissions
    var fname = dirPath + '/dummy_file_name_ASDFFGAJSDFASDFASDF';
    fs.appendFileSync(fname, "DUMMY CONTENT");
    fs.unlinkSync(fname);
}

program.programName = "mirrorwinsys";
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
  .usage('-c <dirs> -s <dirs> -d <dirs>')
  .option('-c, --config-dirs <items>',
      'List of configuration directories separated by ' + path.delimiter,
      function (val) { return val.split(new RegExp(path.delimiter, "g")) })
  .option("-s, --source-dirs <items>",
      'List of mirror source directories separated by ' + path.delimiter,
      function (val) { return val.split(new RegExp(path.delimiter, "g")) })
  .option("-d, --destination-dirs <items>",
      'List of destination directories separated by ' + path.delimiter,
      function (val) { return val.split(new RegExp(path.delimiter, "g")) })
  .parse(process.argv);

if (typeof program.configDirs === "undefined" ||
    typeof program.sourceDirs === "undefined" ||
    typeof program.destinationDirs === "undefined") {
    throw new Error("Please see usage executing with option -h only");
}

program.configDirs.forEach(checkDir);
program.logDir = program.configDirs.map(function (configDir) {
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

program.log("mirror-winsys on!");
throw new Error("END OF PROGRAM");

//var inData = ["SYSPOL_EXTERNAL_MIRROR_BACKUP_SOURCE_PATH",
//  "SYSPOL_EXTERNAL_MIRROR_BACKUP_DESTINATION_PATH"];

//function mirror(src, dst) {
//  // Build whole dst path
//  dstSubdirArr = src.split(path.sep);
//  dstSubdirRoot = dstSubdirArr[0].replace(/:$/, '');
//  dstSubdirArr = [dstSubdirRoot].concat(dstSubdirArr.slice(1));
//  dst = path.join(dst, dstSubdirArr.join(path.sep));

//  // Since robocopy doesn't like trailing backslashes, remove them.
//  // Also enclose in double quotes.
//  args = [src, dst].map(function(item) {
//    return ['"', item.replace(/\\$/, ''), '"'].join('');
//  });

//  var robocopy = exec("robocopy " + args[0] + " " + args[1] + " /E /L");
//}

//// Unfold paths
//var paths = inData.map(function(item) {
//  paths = process.env[item];
//  if(typeof(paths) == "undefined") {
//    throw Error("Environment variable %" + item + "% is empty/absent");
//  }
//  return paths.split(new RegExp(path.delimiter, "g"));
//});

//// Strip double quotes
//paths = paths.map(function(item) {
//  return item.map(function(item) {
//    return item.replace(/"/g, '');
//  });
//});

//// If any path is not absolute, fail (syspol).
//paths.forEach(function(item) {
//  item.forEach(function(item) {
//    if(!path.isAbsolute(item)) {
//      throw Error("Path `" + item + "` is not absolute");
//    }
//  });
//});

//// Mirror
//paths[1].forEach(function(dst) {
//  paths[0].forEach(function(src) {
//    mirror(src, dst);
//  });
//});

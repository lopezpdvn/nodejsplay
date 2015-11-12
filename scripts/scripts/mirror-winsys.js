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
var util = require('util');

// Configuration ==============================================================
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
    
    datetimeElements = [[year, 4], [month, 2], [day, 2]].map(function (item) {
        for (var i = 0, rt = item[0]; i < item[1] - item[0].length; i++) {
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
      .option("-n, --dry-run",
          "list only - don't copy, timestamp or delete anything")
      .option("-m, --mirror",
          "Delete dest files/folders that no longer exist in source")
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
});

program.log = function (msg) {
    msg = "[" + (new Date()).toLocaleString('en-US') + "] " + msg + "\n";
    this.logDir.forEach(function (logDir) {
        msg.toEnd(logDir + "/" + program.logName);
    });
};

// Start and end of program.
program.log("========= Start of " + program.programName);
process.on('exit', function (code) {
    if (!code) {
        program.configDirs.forEach(function (configDir) {
            var lockFilePath = path.join(configDir, "var/lock/LCK.." +
                program.programName);
            var msg = util.format("Removing lock file `%s`", lockFilePath);
            rm('-rf', lockFilePath);
        });
    }
    program.log("========= End of " + program.programName);
});

// Lock
program.configDirs.forEach(function (configDir) {
    var lockFilePath = path.join(configDir, "var/lock/LCK.." + program.programName);
    
    // Validate lock.
    try {
        fs.accessSync(lockFilePath, fs.F_OK);
        var msg = util.format("Lock file exists: `%s`", lockFilePath);
        console.error(msg);
        program.log(msg);
        process.exit(1);
    }
    catch (e) {
        var msg = util.format("Lock file doesn't exist, creating lock file `%s`",
            lockFilePath);
        process.pid.toString().toEnd(lockFilePath);
        console.log(msg);
        program.log(msg);
    }
});
// End configuration ==========================================================

var paths = [program.sourceDirs, program.destinationDirs];

function mirror(src, dst) {
    // Build whole dst path
    dstSubdirArr = src.split(path.sep);
    dstSubdirRoot = dstSubdirArr[0].replace(/:$/, '');
    dstSubdirArr = [dstSubdirRoot].concat(dstSubdirArr.slice(1));
    dst = path.join(dst, dstSubdirArr.join(path.sep));
    
    // Since robocopy doesn't like trailing backslashes, remove them.
    // Also enclose in double quotes.
    args = [src, dst].map(function(item) {
      return ['"', item.replace(/\\$/, ''), '"'].join('');
    });

    //var commandStr = "robocopy " + args[0] + " " + args[1] + " /E";
    var commandStr = util.format("robocopy %s %s /E",
        args[0], args[1]);
    if (program.dryRun) {
        commandStr += " /L";
    }
    if (program.mirror) {
        commandStr += " /PURGE";
    }
    program.log("Executing command: " + commandStr);
    exec(commandStr, { silent: false }, function (code, output) {
        program.log('Robocopy exit code: ' + code);
        program.log('Robocopy output:\n' + output);
    });
}

// Strip double quotes
paths = paths.map(function(item) {
  return item.map(function(item) {
    return item.replace(/"/g, '');
  });
});

// Check dirs
paths.forEach(function (pathArr) {
    pathArr.forEach(function (item) {
        try {
            checkDir(item);
        }
        catch (e) {
            msg = "I/O error with path: `" + item + "`";
            program.log(msg);
            throw new Error(msg);
        }
    });
});

program.log("Source dirs: " + program.sourceDirs);
program.log("Destination dirs: " + program.destinationDirs);

// Mirror
paths[1].forEach(function(dst) {
  paths[0].forEach(function(src) {
    mirror(src, dst);
  });
});
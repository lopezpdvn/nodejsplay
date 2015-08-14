#! /usr/bin/env shjs

// Mirrors directories/files on Windows system.

require('shelljs/global');
//yaml = require('js-yaml');
var fs   = require('fs');
var child_process = require('child_process');
var spawn = child_process.spawnSync;
var PATH_SEPARATOR = ';';

srcPathsEnvKey = "SYSPOL_EXTERNAL_MIRROR_BACKUP_SOURCE_PATH";
dstPathsEnvKey = "SYSPOL_EXTERNAL_MIRROR_BACKUP_DESTINATION_PATH";

srcPaths = process.env[srcPathsEnvKey];
if(typeof(srcPaths) == "undefined") {
  throw Error("Environment variable %" + srcPathsEnvKey + "% is empty/absent");
}
srcPaths = srcPaths.split(PATH_SEPARATOR);

dstPaths = process.env[dstPathsEnvKey];
if(typeof(dstPaths) == "undefined") {
  //throw Error("Environment variable %" + dstPathsEnvKey + "% is empty/absent");
}

srcPaths = srcPaths.map(function(item, index, array) {
  return item.replace(/"/g, '');
});
console.log(srcPaths);


//console.log(process.env.PATH.split(PATH_SEPARATOR));

// var rsync = exec('rsync -v');
// console.log(rsync.output);

// set src=C:\Users\user0\Pictures
// set dst=H:\the\root\of\the\backup\drives\C\Users\user0\Pictures
// robocopy %src% %dst% /E

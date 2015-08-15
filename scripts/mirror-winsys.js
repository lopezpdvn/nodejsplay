#! /usr/bin/env shjs

// Mirrors directories/files on Windows system.
// Doesn't support paths that contain the character ';'

require('shelljs/global');
//yaml = require('js-yaml');
var fs   = require('fs');
var child_process = require('child_process');
var path = require('path');
var spawn = child_process.spawnSync;

var srcPathsEnvKey = "SYSPOL_EXTERNAL_MIRROR_BACKUP_SOURCE_PATH";
var dstPathsEnvKey = "SYSPOL_EXTERNAL_MIRROR_BACKUP_DESTINATION_PATH";

var inData = [srcPathsEnvKey, dstPathsEnvKey];

// Unfold paths
var paths = inData.map(function(item, index, array) {
  paths = process.env[item];
  if(typeof(paths) == "undefined") {
    throw Error("Environment variable %" + item + "% is empty/absent");
  }
  return paths.split(new RegExp(path.delimiter, "g"));
});

// Strip double quotes
paths = paths.map(function(item, index, array) {
  return item.map(function(item, index, array) {
    return item.replace(/"/g, '');
  });
});

console.log(paths);

// var rsync = exec('rsync -v');
// console.log(rsync.output);

// set src=C:\Users\user0\Pictures
// set dst=H:\the\root\of\the\backup\drives\C\Users\user0\Pictures
// robocopy %src% %dst% /E

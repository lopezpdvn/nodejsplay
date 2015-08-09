#! /usr/bin/env shjs

// Mirrors directories/files on Windows system.

require('shelljs/global');
//yaml = require('js-yaml');
var fs   = require('fs');
var child_process = require('child_process');
var spawn = child_process.spawnSync;

var rsync = exec('rsync -v');
console.log(rsync.output);

// set src=C:\Users\user0\Pictures
// set dst=H:\the\root\of\the\backup\drives\C\Users\user0\Pictures
// robocopy %src% %dst% /E

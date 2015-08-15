#! /usr/bin/env shjs

/* Mirrors directories/files on Windows system.
 *
 * - Depends on robocopy
 * - Doesn't support paths that contain the character ';'
 * - Syspol compliant
*/

require('shelljs/global');
var fs = require('fs');
var child_process = require('child_process');
var path = require('path');

var inData = ["SYSPOL_EXTERNAL_MIRROR_BACKUP_SOURCE_PATH",
  "SYSPOL_EXTERNAL_MIRROR_BACKUP_DESTINATION_PATH"];

function mirror(src, dst) {
  // Build whole dst path
  dstSubdirArr = src.split(path.sep);
  dstSubdirRoot = dstSubdirArr[0].replace(/:$/, '');
  dstSubdirArr = [dstSubdirRoot].concat(dstSubdirArr.slice(1));
  dst = path.join(dst, dstSubdirArr.join(path.sep));

  // Since robocopy doesn't like trailing backslashes, remove them.
  // Also enclose in double quotes.
  args = [src, dst].map(function(item, index, array) {
    return ['"', item.replace(/\\$/, ''), '"'].join('');
  });

  var robocopy = exec("robocopy " + args[0] + " " + args[1] + " /E /L");
}

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

// If any path is not absolute, fail (syspol).
paths.forEach(function(item, index, array) {
  item.forEach(function(item, index, array) {
    if(!path.isAbsolute(item)) {
      throw Error("Path `" + item + "` is not absolute");
    }
  });
});

// Mirror
paths[1].forEach(function(dst, dstIndex, dstArray) {
  paths[0].forEach(function(src, srcIndex, srcArray) {
    mirror(src, dst);
  });
});

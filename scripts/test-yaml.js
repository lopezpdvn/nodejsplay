#! /usr/bin/env shjs

require('shelljs/global');
yaml = require('js-yaml');
fs   = require('fs');

var yaml_path = process.argv[2];

// Get document, or throw exception on error 
try {
  var doc = yaml.safeLoad(fs.readFileSync(yaml_path, 'utf8'));
  console.log('Loaded YAML file without errors');
} catch (e) {
  console.log('Path is not there');
  console.log(e);
}

#! /usr/bin/env shjs

// Input file is a YAML file containing a single list of strings. Each strings
// encodes a card with only two fields: a word or phrase, and its IPA
// pronunciation enclosed in forward slashes (/)

// Write tags for all cards, http://ankisrs.net/docs/manual.html#adding-tags
// Write all lines/cards

require('shelljs/global');
yaml = require('js-yaml');
fs   = require('fs');

var FIELD_SEPARATOR = '|';

function build_card_lines(item, index, array)
{
  var word, pronunciation;
  //var re = /^(.*)(\/.*\/)/;
  var re = /^(.*)$/;
  matches = re.exec(item);
  return matches[0];
}

var yaml_path = process.argv[2];
var anki_path = process.argv[3];

// Get document, or throw exception on error 
try {
  var doc = yaml.safeLoad(fs.readFileSync(yaml_path, 'utf8'));
  console.log('Loaded YAML file without errors');
} catch (e) {
  console.log('Path is not there');
  console.log(e);
}

// console.log(typeof(doc))

console.log(doc.map(build_card_lines));

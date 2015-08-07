#! /usr/bin/env shjs

// Input file is a YAML file containing a single list of strings. Each strings
// encodes a card with only two fields: a word or phrase, and its IPA
// pronunciation enclosed in forward slashes (/)

// Write tags for all cards, http://ankisrs.net/docs/manual.html#adding-tags
// Write all lines/cards

require('shelljs/global');
yaml = require('js-yaml');
fs   = require('fs');

var FIELD_SEPARATOR = '\t';

function build_card_lines(item, index, array)
{
  var word, pronunciation, line;
  var re = /^(.*)\/(.*)\/.*\[(.*)\].*$/;
  matches = re.exec(item);

  if(matches != null)
  {
    word = matches[1].trim();
    pronunciation = matches[2].trim();
    tag = matches[3] != null ? matches[3] : '';
    line = [word, pronunciation, tag].join(FIELD_SEPARATOR);
  } else
  {
    line = '';
  }

  return line;
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
  process.exit(1);
}

fstr = doc.map(build_card_lines).join('\n');
//console.log(lines);

try {
  fs.writeFileSync(anki_path, fstr);
  console.log('Success');
} catch(e) {
  console.log('Unable to write file ' + anki_path);
  process.exit(1);
}

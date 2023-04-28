import * as fs from 'node:fs';
import * as path from 'path';
import * as process from 'process';

import {micromark} from 'micromark';
import {frontmatter, frontmatterHtml} from 'micromark-extension-frontmatter';

import {readAllFiles} from './utils';


function processFile(err:Error|null, data:string) {


}

export default function buildPage(filepath:string) {

  if(!fs.statSync(filepath).isDirectory()) {
    console.log(`Invalid input: ${filepath} is not a directory`);
    return -1;
  }
  let parts:Set<string> = new Set();
  for (const file of readAllFiles(filepath)){
    console.log(`parsing ${file}`);
    fs.readFile(filepath, 'utf8', (err, data) => {
      if(err) throw err;
      const result= micromark(data,{
        extensions: [
          frontmatter(  'toml'),
        ],
        htmlExtensions: [
          frontmatterHtml('toml'),
        ]
      });
      console.log(`read in \n ${result}`)
      parts.add(result);
    });

  }

}


import fs from 'node:fs';
import yaml from 'js-yaml';
import path from 'node:path';

const configPath = path.join(process.cwd(), 'config.yml');
const fileContents = fs.readFileSync(configPath, 'utf8');
export const config = yaml.load(fileContents) as any;
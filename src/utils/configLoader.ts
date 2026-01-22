import gameConfig from '../config/gameConfig.json';
import schema from '../config/gameConfig.schema.json';
import Ajv from 'ajv';
import type { Generator, Upgrade } from '../types/game';

interface GameConfig {
  generators: Generator[];
  upgrades: Upgrade[];
}

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema as Parameters<typeof ajv.compile>[0]);

export function getDefaultGenerators(): Generator[] {
  const config = gameConfig as unknown as GameConfig;
  const valid = validate(config);
  if (!valid) {
    console.error('gameConfig.json validation errors:', validate.errors);
    throw new Error('Invalid gameConfig.json: see errors above');
  }
  return JSON.parse(JSON.stringify(config.generators));
}

export function getDefaultUpgrades(): Upgrade[] {
  const config = gameConfig as unknown as GameConfig;
  const valid = validate(config);
  if (!valid) {
    console.error('gameConfig.json validation errors:', validate.errors);
    throw new Error('Invalid gameConfig.json: see errors above');
  }
  return JSON.parse(JSON.stringify(config.upgrades));
}

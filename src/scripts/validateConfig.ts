import gameConfig from '../config/gameConfig.json';
import schema from '../config/gameConfig.schema.json';
import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema as Parameters<typeof ajv.compile>[0]);

const valid = validate(gameConfig);

if (valid) {
  console.log('✓ gameConfig.json is valid!');
  process.exit(0);
} else {
  console.error('✗ gameConfig.json has errors:');
  for (const error of validate.errors!) {
    console.error(`  - ${error.instancePath}: ${error.message}`);
  }
  process.exit(1);
}

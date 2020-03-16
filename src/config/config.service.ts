import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import * as fs from 'fs';

type EnvConfig = {
  [key: string]: string;
};

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string().valid('dev', 'prod', 'test'),
      // .default('dev'),
      MONGO_URL: Joi.string(),
      PORT: Joi.number(),
      URL: Joi.string(),
    });

    const { error, value: validatedEnvConfig } = envVarSchema.validate(envConfig);

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return validatedEnvConfig;
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}

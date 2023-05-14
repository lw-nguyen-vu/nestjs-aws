import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsConfigService {
  private readonly awsConfig: AWS.Config;

  constructor(private configService: ConfigService) {
    this.awsConfig = new AWS.Config({
      region: this.configService.get('AWS_REGION'),
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  }

  getAwsConfig(): AWS.Config {
    return this.awsConfig;
  }
}

import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import {
  DeleteObjectRequest,
  GetObjectRequest,
  ListObjectsRequest,
  PutObjectRequest,
} from 'aws-sdk/clients/s3';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  private readonly s3: S3;

  constructor() {
    this.s3 = new S3({ signatureVersion: 'v4' });
  }

  async uploadFile(
    bucketName: string,
    fileName: string,
    buffer: Readable | string,
    options?: {
      contentLanguage?: string;
      cacheControl?: string;
    },
  ): Promise<S3.ManagedUpload.SendData> {
    const params: PutObjectRequest = {
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
    };

    if (options?.contentLanguage) {
      params['ContentLanguage'] = options.contentLanguage;
    }
    if (options?.cacheControl) {
      params['CacheControl'] = options.cacheControl;
    }

    return this.s3.upload(params).promise();
  }

  async deleteFile(bucketName: string, fileName: string): Promise<void> {
    const params: DeleteObjectRequest = {
      Bucket: bucketName,
      Key: fileName,
    };

    await this.s3.deleteObject(params).promise();
  }

  async getFile(bucketName: string, fileName: string): Promise<Buffer> {
    const params: GetObjectRequest = {
      Bucket: bucketName,
      Key: fileName,
    };

    const result = await this.s3.getObject(params).promise();

    return result.Body as Buffer;
  }

  async listFiles(bucketName: string): Promise<string[]> {
    const params: ListObjectsRequest = {
      Bucket: bucketName,
    };

    const result = await this.s3.listObjects(params).promise();

    return result.Contents.map((obj) => obj.Key);
  }
}

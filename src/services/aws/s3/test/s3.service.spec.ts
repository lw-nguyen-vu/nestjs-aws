import { S3Service } from '../s3.service';

describe('S3Service', () => {
  let s3Service: S3Service;

  beforeEach(() => {
    s3Service = new S3Service();
  });

  describe('uploadFile', () => {
    const bucketName = 'mock-bucket';
    const fileName = 'mock-file';
    const buffer = 'buffer';
    const contentLanguage = 'en-us';
    const cacheControl = 'max-age=3600';

    it('should upload file to S3 with given options', async () => {
      const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentLanguage: contentLanguage,
        CacheControl: cacheControl,
      };
      const sendData = { ETag: 'mock-etag', Location: 'mock-location' };
      jest.spyOn(s3Service['s3'], 'upload').mockReturnValue({
        promise: jest.fn().mockResolvedValueOnce(sendData),
      } as any);

      const result = await s3Service.uploadFile(bucketName, fileName, buffer, {
        contentLanguage,
        cacheControl,
      });

      expect(s3Service['s3'].upload).toHaveBeenCalledWith(params);
      expect(result).toEqual(sendData);
    });

    it('should upload file to S3 without options', async () => {
      const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
      };
      const sendData = { ETag: 'mock-etag', Location: 'mock-location' };
      jest.spyOn(s3Service['s3'], 'upload').mockReturnValue({
        promise: jest.fn().mockResolvedValueOnce(sendData),
      } as any);

      const result = await s3Service.uploadFile(bucketName, fileName, buffer);

      expect(s3Service['s3'].upload).toHaveBeenCalledWith(params);
      expect(result).toEqual(sendData);
    });
  });

  describe('deleteFile', () => {
    const bucketName = 'mock-bucket';
    const fileName = 'mock-file';

    it('should delete file from S3', async () => {
      const params = {
        Bucket: bucketName,
        Key: fileName,
      };
      jest.spyOn(s3Service['s3'], 'deleteObject').mockReturnValue({
        promise: jest.fn().mockResolvedValueOnce(undefined),
      } as any);

      await s3Service.deleteFile(bucketName, fileName);

      expect(s3Service['s3'].deleteObject).toHaveBeenCalledWith(params);
    });
  });

  describe('getFile', () => {
    const bucketName = 'mock-bucket';
    const fileName = 'mock-file';

    it('should get file from S3', async () => {
      const params = {
        Bucket: bucketName,
        Key: fileName,
      };
      const expectedResult = Buffer.from('mock-data');
      jest.spyOn(s3Service['s3'], 'getObject').mockReturnValue({
        promise: jest.fn().mockResolvedValueOnce({ Body: expectedResult }),
      } as any);

      const result = await s3Service.getFile(bucketName, fileName);

      expect(s3Service['s3'].getObject).toHaveBeenCalledWith(params);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('listFiles', () => {
    it('should return list of file names in the bucket', async () => {
      // Arrange
      const bucketName = 'test-bucket';
      jest.spyOn(s3Service['s3'], 'listObjects').mockReturnValueOnce({
        promise: jest.fn().mockResolvedValueOnce({
          Contents: [{ Key: 'file1.txt' }, { Key: 'file2.txt' }],
        }),
      } as any);

      // Act
      const result = await s3Service.listFiles(bucketName);

      // Assert
      expect(s3Service['s3'].listObjects).toHaveBeenCalledWith({
        Bucket: bucketName,
      });
      expect(result).toEqual(['file1.txt', 'file2.txt']);
    });
  });
});

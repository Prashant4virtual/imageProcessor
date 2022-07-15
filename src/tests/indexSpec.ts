import supertest from 'supertest';
import app from '../index';
import transform from '../utils/imagetransform';

const request = supertest(app);

describe('Image Processor responses', () => {
  describe('Homepage endpoint', () => {
    it('gets the api homepage endpoint', async () => {
      const response = await request.get('/');
      expect(response.status).toBe(200);
    });
  });
  describe('Image retrieval endpoint', () => {
    it('gets the image from the api endpoint', async () => {
      const response = await request.get('/image/fjord');
      expect(response.status).toBe(200);
    });
    it('fails to get the non-existent image from the api endpoint', async () => {
      const response = await request.get('/image/xyzimage');
      expect(response.status).toBe(404);
    });
  });
  describe('Image processing endpoint', () => {
    it('gets the resized image from the api endpoint', async () => {
      const response = await request.get(
        '/image?filename=santamonica&width=200&height=100'
      );
      expect(response.status).toBe(200);
    });
    it('fails to get the resized image for non-existent image from the api endpoint', async () => {
      const response = await request.get(
        '/image?filename=xyzimage&width=200&height=100'
      );
      expect(response.status).toBe(400);
    });
  });
  describe('Image processing function', () => {
    it('checks if the image transform function is operational', async () => {
      const response = await transform('fjord', 400, 300);
      expect(response.err).toBeFalsy();
    });
    it('fails to transform image with incorrect parameters', async () => {
      const response = await transform('fjokkkkrd', 0, 300);
      expect(response.err).toBeTruthy();
    });
  });
});

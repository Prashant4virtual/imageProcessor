import supertest from 'supertest';
import app from '../index';

const request = supertest(app);

describe('Image Processor endpoints responses',() => {
    describe('Homepage endpoint', () => {
        it('gets the api homepage endpoint', async () => {
            const response = await request.get('/');
            expect(response.status).toBe(200);
        })
    })
    describe('Image retrieval endpoint', () => {
        it('gets the image from the api endpoint', async () => {
            const response = await request.get('/image/fjord');
            expect(response.status).toBe(200);
        })
        it('fails to get the non-existent image from the api endpoint', async () => {
            const response = await request.get('/image/xyzimage');
            expect(response.status).toBe(404);
        })
    })
    describe('Image processing endpoint', () => {
        it('gets the resized image from the api endpoint', async () => {
            const response = await request.get('/image?filename=santamonica&width=200&height=100');
            expect(response.status).toBe(200);
        })
        it('fails to get the resized image for non-existent image from the api endpoint', async () => {
            const response = await request.get('/image?filename=xyzimage&width=200&height=100');
            expect(response.status).toBe(400);
        })
    })
});

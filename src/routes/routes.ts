import express from 'express';
import get_image from './api/getimage';
const router: express.Router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
  // console.log("/ accessed");
  res.send('<h1>Welcome to the Image Processor!</h1>/');
});

router.use('/image', get_image);

export default router;

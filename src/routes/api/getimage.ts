import express, { query } from 'express';
import * as imageUtil from '../../utils/imageUtil';
import transform from '../../utils/imagetransform';

const get_image = express.Router();

get_image.get('/:image', (req: express.Request, res: express.Response) => {
  const imageName = req.params.image;
  const imagePath = imageUtil.absPath(imageUtil.imageRoot, imageName);
  if (imageUtil.objectExists(imagePath)) {
    // console.log(`${imageName} image queried`);
    res.sendFile(imagePath);
  } else {
    res.status(404).send(`Image ${imageName} not found !`);
  }
});

get_image.get('/', async (req: express.Request, res: express.Response) => {
  const queryParams = req.query;
  if (queryParams.filename && queryParams.width && queryParams.height) {
    const filename = queryParams.filename as string;
    const width = queryParams.width as unknown as number;
    const height = queryParams.height as unknown as number;

    const result = await transform(filename, width, height); //.then((result)=>{
    // console.log("transform then data:",result)
    if (
      result.errMsg === 'Query data not valid' ||
      result.errMsg === 'Failed to transform'
    ) {
      res.status(400).send(result.errMsg);
    } else if (result !== undefined) {
      setTimeout(() => {
        res.status(200).sendFile(result.file);
      }, 200);
    } else res.status(500).send('Oops something went wrong!');
    // })
  }
});

export default get_image;

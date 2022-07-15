import express from 'express';
import * as imageUtils from '../../utils/imageUtils';

const get_image = express.Router();

get_image.get('/:image', (req: express.Request, res: express.Response) => {
  const imageName = req.params.image;
  const imagePath = imageUtils.absPath(imageUtils.imageRoot, imageName);
  if (imageUtils.objectExists(imagePath)) {
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

    imageUtils.transform(filename, width, height).then((result) => {
      if (
        result.errMsg === 'Query data not valid' ||
        result.errMsg === 'Failed to transform'
      ) {
        res.status(400).send(result.errMsg);
      } else if (result !== undefined) {
        res.status(200).sendFile(result.file);
      } else res.status(500).send('Oops something went wrong!');
    });
  } else {
    res.status(400).send('Query data not valid');
  }
});

export default get_image;

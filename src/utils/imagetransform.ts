import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const transform = async (fileName: string, width: number, height: number) => {
  const imageRoot = path.join(__dirname, '..', '..', 'images');
  const imageExt = '.jpg';
  const filePath = path.join(imageRoot, `${fileName + imageExt}`);
  const thumbroot = path.join(imageRoot, '.thumbnails');
  const thumbFilePath = path.join(
    thumbroot,
    `${fileName + '_thumb' + imageExt}`
  );
  const thumbMetaFile = path.join(thumbroot, 'meta.json');

  const outData = {
    err: false,
    errMsg: '',
    file: '',
    inCache: false,
  };

  if (!(fs.existsSync(filePath) && width > 0 && height > 0)) {
    outData.err = true;
    outData.errMsg = 'Query data not valid';
  }

  if (!fs.existsSync(thumbroot)) {
    fs.mkdir(thumbroot, () => {});
  }

  if (fs.existsSync(thumbMetaFile)) {
    let readData;
    readData = fs.readFileSync(thumbMetaFile);
    // fs.readFile(thumbMetaFile,(err,data)=>{
    //     if(!err) {
    readData = readData as unknown as string;
    const datajsonified = JSON.parse(readData);
    if (
      datajsonified[fileName] &&
      datajsonified[fileName]['height'] === height &&
      datajsonified[fileName]['height'] === height
    ) {
      outData.inCache = true;
      outData.file = thumbFilePath;
    }
  }
  // })
  // }
  try {
    if (!outData.inCache) {
      sharp(filePath)
        .resize(width, height)
        .toFile(thumbFilePath, (err, info) => {
          if (!err) {
            // if(!fs.existsSync(thumbMetaFile)){
            //     // fs.writeFileSync(thumbMetaFile,JSON.stringify({}))
            //     await fs.writeFile(thumbMetaFile,JSON.stringify({}),'utf-8',(err)=>{})
            // }
            let readData = '{}';
            if (fs.existsSync(thumbMetaFile)) {
              const readDataprev = fs.readFileSync(thumbMetaFile);
              readData = readDataprev as unknown as string;
            }
            // fs.readFile(thumbMetaFile,(err,data)=>{
            // if(!err){
            // readData = readData as unknown as string;
            const infoData = info as unknown as string;
            const datajsonified = JSON.parse(readData);
            datajsonified[fileName] = infoData;
            // fs.writeFileSync(thumbMetaFile,JSON.stringify(datajsonified));
            fs.writeFile(
              thumbMetaFile,
              JSON.stringify(datajsonified),
              'utf-8',
              (err) => {}
            );
          }
        });
      outData.file = thumbFilePath;
    }
    // })
    // }
    return outData;
  } catch {
    outData.err = true;
    outData.errMsg = 'Failed to transform';
    return outData;
  }
};

export default transform;

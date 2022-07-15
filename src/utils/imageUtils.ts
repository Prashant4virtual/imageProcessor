import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

export const imageRoot = path.join(__dirname, '..', '..', 'images');
export const imageExt = '.jpg';
const thumbroot = path.join(imageRoot, '.thumbnails');

export function objectExists(loc: string): boolean {
  return fs.existsSync(loc);
}

export function absPath(
  root: string,
  obj: string,
  folder: boolean = false,
  ext: string = imageExt
): string {
  if (folder) {
    return path.join(root, obj);
  }
  return path.join(root, `${obj + ext}`);
}

export const transform = async (
  fileName: string,
  width: number,
  height: number
) => {
  const filePath = path.join(imageRoot, `${fileName + imageExt}`);
  const thumbFilePath = path.join(
    thumbroot,
    `${fileName + '_' + width + '_' + height + imageExt}`
  );

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

  if (!fs.existsSync(thumbroot) && !outData.err) {
    fs.mkdir(thumbroot, () => {});
  }

  if (fs.existsSync(thumbFilePath) && !outData.err) {
    outData.inCache = true;
    outData.file = thumbFilePath;
  }

  try {
    if (!outData.inCache && !outData.err) {
      await sharp(filePath).resize(width, height).toFile(thumbFilePath);

      outData.file = thumbFilePath;
    }
    return outData;
  } catch {
    outData.err = true;
    outData.errMsg = 'Failed to transform';
    return outData;
  }
};

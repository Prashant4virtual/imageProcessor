import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

export const imageRoot = path.join(__dirname, '..', '..', 'images');
const thumbroot = path.join(imageRoot, '.thumbnails');
const imageExt = '.jpg';
const thumbMetaFile = path.join(thumbroot, 'meta.json');

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

async function createDir(dirpath: string) {
  await fs.promises.mkdir(dirpath);
}

function writeDataToFile(
  file: string,
  data: string,
  encoding: fs.WriteFileOptions = 'utf-8'
) {
  fs.writeFile(file, data, encoding, (err) => {
    if (err) throw err;
  });
}

function updateMeta(infoData: string, filename: string) {
  try {
    if (!objectExists(thumbMetaFile)) {
      writeDataToFile(thumbMetaFile, JSON.stringify({}));
    }
    let readData;
    fs.readFile(thumbMetaFile, (err, data) => {
      if (err) throw err;
      readData = data as unknown as string;
      readData = JSON.parse(readData);
      readData[filename] = infoData;
      writeDataToFile(thumbMetaFile, JSON.stringify(readData));
    });
  } catch {
    return 'Failed to update cache!';
  }
}

// function resizeImage(fileName: string, width: number, height: number) {
//   const filePath = absPath(imageRoot, fileName);
//   const outFilePath = absPath(thumbroot, `${fileName + '_thumb'}`);
//   sharp(filePath)
//     .resize(width, height)
//     .toFile(outFilePath, (err, info) => {
//       if (err) {
//         throw err;
//       } else {
//         const infoData = info as unknown as string;
//         updateMeta(infoData, fileName);
//       }
//     });
// }

function validateQueryData(fileName: string, width: number, height: number) {
  if (objectExists(absPath(imageRoot, fileName)) && width > 0 && height > 0) {
    return true;
  } else return false;
}

// export function transform(
//   fileName: string,
//   width: number,
//   height: number
// ) {
//   if (!validateQueryData(fileName, width, height)) {
//     return 'Query data not valid';
//   }
//   const filePath = absPath(imageRoot, fileName);
//   const outFilePath = absPath(thumbroot, `${fileName + '_thumb'}`);

//   if (!objectExists(thumbroot)) {
//       console.log("checking object exists")
//       createDir(thumbroot);
//   }
//   if (!objectExists(thumbMetaFile)) {
//       console.log("checking metafile exists")
//       writeDataToFile(thumbMetaFile, JSON.stringify({}));
//       sharp(filePath)
//       .resize(width, height)
//       .toFile(outFilePath, (err, info) => {
//         if (err) {
//           throw err;
//         } else {
//           const infoData = info as unknown as string;
//           updateMeta(infoData, fileName);
//         }
//         return outFilePath;
//       })
//     } else {
//       let cacheData;
//       fs.readFile(thumbMetaFile, async (err, data) => {
//         console.log("checking cached data exists")
//         if (err) {
//           throw err;
//         }
//         cacheData = data as unknown as string;
//         cacheData = JSON.parse(cacheData);
//         if (!(
//           cacheData[fileName] &&
//           cacheData[fileName]['width'] === width &&
//           cacheData[fileName]['height'] === height)
//         ) {
//           console.log("Resizing data as cache not found")
//           sharp(filePath)
//             .resize(width, height)
//             .toFile(outFilePath, (err, info) => {
//               if (err) {
//                 throw err;
//               } else {
//               const infoData = info as unknown as string;
//               updateMeta(infoData, fileName);
//               }
//               return outFilePath;
//             })
//           }
//       })
//      }
//     // return absPath(thumbroot, `${fileName + '_thumb'}`);
// }

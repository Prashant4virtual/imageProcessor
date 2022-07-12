import express, { query } from 'express';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const get_image = express.Router();
const imageRoot = path.join(__dirname,'..','..','..','images');
const imageExt = '.jpg'

get_image.get('/:image',(req,res) => {
    const imageName =  req.params.image;
    const imagePath = path.join(imageRoot,`${imageName+imageExt}`);
    console.log(imagePath);
    if(fs.existsSync(imagePath)){
        console.log(`${imageName} image queried`);
        res.sendFile(imagePath);
    }
    else{
        res.status(404).send(`Image ${imageName} not found !`)
    }
});

get_image.get('/',(req,res) => {
    const queryParams = req.query
    if (queryParams.filename && queryParams.width && queryParams.height){
        const filename = queryParams.filename as string; 
        const width = queryParams.width as unknown as number;
        const height = queryParams.height as unknown as number;
        const filepath =  path.join(imageRoot,`${filename+imageExt}`);
        const thumbroot = path.join(imageRoot,'.thumbnails');
        const thumbMetaFile = path.join(thumbroot,'meta.json');

        if(!fs.existsSync(thumbroot)){
            async function createDir(){
                await fs.promises.mkdir(thumbroot)
            }
            createDir();
            // fs.mkdir(thumbroot,(err) => {
            //     console.log("Failed to create thumbnails directory");
            //     throw err;
            // })
        }
        const filethumbpath = path.join(thumbroot,`${filename+'_thumb'+imageExt}`);

        function updateMeta(infoData: object){
            // const thumbMetaFile = path.join(thumbroot,'meta.json');
            if(!fs.existsSync(thumbMetaFile)){
                fs.writeFile(thumbMetaFile,JSON.stringify({}),'utf-8',(err)=>{
                    if (err){
                        console.log("Failed to create thumbs meta file")
                    }
                })
            }
                let readData ;
                fs.readFile(thumbMetaFile,(err,data)=>{
                    if(err)  throw err;
                    readData = data as unknown as string;
                const datajsonified = JSON.parse(readData);
                // if(!datajsonified[filename]){
                    datajsonified[filename] = infoData;
                    // console.log(datajsonified)
                    fs.writeFile(thumbMetaFile,JSON.stringify(datajsonified),'utf-8',(err)=>{
                    if (err){
                        console.log("Failed to update thumbs meta file");
                    } else {
                        console.log(`Updated thumbs meta data for image ${filename}`);
                        console.log(datajsonified);
                    }
                })
                // };
            });
        }

        function resizeImage(){
            sharp(filepath)
                .resize(width,height)
                .toFile(filethumbpath,(err,info)=>{
                    if(err){ 
                        console.log(err);
                        res.send('Failed to resize image!');
                    } else{
                        // console.log('Resized image and updated meta for ');
                        // console.log(info);
                        updateMeta(info);
                        res.sendFile(filethumbpath);
                    }
                });
        }
        if(fs.existsSync(thumbMetaFile)){
            let readData ;
                fs.readFile(thumbMetaFile,(err,data)=>{
                    if(err)  throw err;
                    readData = data as unknown as string;
                const datajsonified = JSON.parse(readData);
                if( datajsonified[filename] && datajsonified[filename]['height'] === height && datajsonified[filename]['height'] === height){
                    console.log(`Serving image ${filename} from cache`)
                    res.sendFile(filethumbpath);
                }
                else{
                    resizeImage();
                }
            });
        }
        else {
            resizeImage();
        }
    }
    else {
        res.status(400).send('Image params in the query incorrect!')
    }
});

export default get_image;

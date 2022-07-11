import express from 'express';
import path from 'path';
import fs from 'fs';

const get_image = express.Router();
const imageRoot = path.join(__dirname,'..','..','..','images');

get_image.get('/:image',(req,res) => {
    const imageName =  req.params.image;
    const imagePath = path.join(imageRoot,imageName);
    if(fs.existsSync(imagePath)){
        console.log(`${imageName} image queried`);
        res.sendFile(`${imageRoot}/${imageName}`);
    }
    else{
        res.status(400).send(`Image ${imageName} not found !`)
    }
});

export default get_image;

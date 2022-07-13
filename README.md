# imageProcessor
  Retrieve and Process image based on user input size

## Available images:
  - encenadaport.jpg  
  - fjord.jpg  
  - icelandwaterfall.jpg  
  - palmtunnel.jpg  
  - santamonica.jpg

## Setup steps
- **Node**
    - Run 'npm install' in root folder to install all packages listed in package.json

## Endpoints
- Accessible over http://localhost:3124/

## Commands/scripts
  - npm start

  - dev scripts: 
    - "build": "npx tsc",
    - "prettier": "prettier --config .prettierrc build/**/*.js --write",
    - "lint": "eslint . --ext .js",
    - "test": "npm run build && npx jasmine"

## To retrieve an image:
  - /image/image_name -> If it's a valid image Name, returns image or else returns message "Image image_name not found !" with return status of 400.

## To process image:
  - /image?filename=name&width=size&height=size -> returns the processed image if not it's not in cache or else serves the cached image.

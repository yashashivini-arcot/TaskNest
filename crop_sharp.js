const sharp = require('sharp');
const fs = require('fs');

async function processImage() {
  try {
    const inputPath = 'frontend/public/logo.png';
    const outputPath = 'frontend/public/logo_temp.png';
    
    console.log('Reading image dimensions...');
    const metadata = await sharp(inputPath).metadata();
    console.log(`Original Dimensions: ${metadata.width}x${metadata.height}`);
    
    let size = metadata.height;
    // Attempting to crop a clean square on the very left.
    // If the image has white padding, we might want to trim first, but start with basic left-crop.
    await sharp(inputPath)
      .trim() // This trims transparent/empty padding across the whole thing automatically!
      .toBuffer()
      .then(async (trimmedBuffer) => {
          const trimmedMeta = await sharp(trimmedBuffer).metadata();
          console.log(`Trimmed Dimensions: ${trimmedMeta.width}x${trimmedMeta.height}`);
          
          const sqSize = trimmedMeta.height; // Square emblem based on height
          // Crop square from the left side
          await sharp(trimmedBuffer)
            .extract({ left: 0, top: 0, width: sqSize, height: sqSize })
            .toFile(outputPath);
            
          console.log("Successfully extracted emblem to file.");
      });
      
    // Overwrite original with the new cropped emblem
    fs.copyFileSync(outputPath, inputPath);
    fs.unlinkSync(outputPath);
    console.log('Logo physically replaced with cropped square.');
    
  } catch (err) {
    console.error("Critical error during sharp processing:", err);
    process.exit(1);
  }
}

processImage();

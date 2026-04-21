const Jimp = require('jimp');

async function crop() {
    try {
        console.log('Loading logo...');
        const image = await Jimp.read('frontend/public/logo.png');
        console.log(`Original: ${image.bitmap.width}x${image.bitmap.height}`);
        
        // Remove transparent padding around the whole image first
        image.autocrop();
        const autoWidth = image.bitmap.width;
        const autoHeight = image.bitmap.height;
        console.log(`Autocropped padding: ${autoWidth}x${autoHeight}`);
        
        // Assume the logo is on the left edge. A standard logo emblem is a square.
        // We will crop a square of size 'autoHeight' starting from the left.
        const size = Math.min(autoWidth, autoHeight);
        image.crop(0, 0, size, size);
        
        await image.writeAsync('frontend/public/logo.png');
        console.log('Successfully cropped the emblem from the text!');
    } catch (e) {
        console.error('Error during cropping:', e);
        process.exit(1);
    }
}
crop();

const fs = require('fs');

const deleteBeforeImage = async (imageURL) => {
    try{
        const path = 'public/images' + imageURL.split('images')[1];
        await fs.unlink(path, (err) => {
            if(err){
                throw err;
            }
        });
    } catch(err) {
        throw err;
    }
}
const imageUpload = async (imageURL) => {
    try{
        const domain = imageURL.split('temp')[0];
        const tempImageURL = 'temp' + imageURL.split('temp')[1];
        const newImageURL = 'images' + imageURL.split('temp')[1];

        await fs.rename('public/'+tempImageURL, 'public/'+newImageURL, (err) => {
            if(err){
                throw err;
            }
        });

        return domain + newImageURL;
    } catch(err) {
        throw err;
    }
}

module.exports = {
    imageUpload,
    deleteBeforeImage
}
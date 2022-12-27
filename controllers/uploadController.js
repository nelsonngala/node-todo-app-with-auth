const {cloudinary } = require('../Utils/cloudinaryConfig');

const uploadImage = async(req, res) => {
    try {
         console.log('uploading');
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
            folder: 'profile_images'
        })
       
        res.status(200).json({imageUrl: result.secure_url});
    } catch (error) {
        console.log(error);
    }
}

module.exports = uploadImage;
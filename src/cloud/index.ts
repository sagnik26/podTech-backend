import { v2 as cloudinary } from 'cloudinary';
import { CLOUD_NAME, CLOUD_KEY, CLOUD_SECRET } from '#/utils/variables';

cloudinary.config({ 
    cloud_name: CLOUD_NAME, 
    api_key: CLOUD_KEY, 
    api_secret: CLOUD_SECRET,
    secure: true
});

export default cloudinary;

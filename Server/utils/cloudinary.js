import { v2 as cloudinary } from 'cloudinary';
import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, '');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	},
});

const filter = (req, file, cb) => {
	if (
		file.mimetype == "image/png" ||
		file.mimetype == "image/jpeg" ||
		file.mimetype == "image/jpg"
		) {
			cb(null, true)
		} else {
			cb(null, false)
		}
	}

cloudinary.config({
	cloud_name: 'dumndb22c',
	api_key: '652179528156963',
	api_secret: 'UaHD8ROLBD-ObSHGGirr-iDfI00'
});

const upload = multer({ storage: storage, fileFilter: filter });

const uploadToCloudinary = async (localPath) => {
	try {
		let response = await cloudinary.uploader.upload(localPath);
		fs.unlinkSync(localPath);
		return {url: response.url, publicId: response.public_id};
	} catch (e) {
		console.log("Error from cloudinary");
		console.log(e);
		fs.unlinkSync(localPath);
	}
}

const deleteImage = async (publicId) => {
	try {
		let response = await cloudinary.uploader.destroy(publicId);
		return response;
	} catch (e) {
		console.log(e);
	}
}

export {
	upload,
	uploadToCloudinary,
	deleteImage
}
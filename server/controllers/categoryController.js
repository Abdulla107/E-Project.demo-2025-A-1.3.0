const fs = require('fs')
const cloudinary = require('cloudinary').v2;
const formidable = require("formidable");
const { responseReturn } = require("../utiles/response");
const categoryModel = require('../models/categoryModel')
const { mongo: { ObjectId } } = require('mongoose');


// Cloudinary cnfiguration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});


class categoryController {

    category_add = async (req, res) => {

        const form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return responseReturn(res, 400, { error: 'Form parsing error' });
            }


            try {
                let { name } = fields;
                const imageFile = files.image && Array.isArray(files.image) ? files.image[0] : null; 

                if (!imageFile || !fs.existsSync(imageFile.filepath)) {
                    return responseReturn(res, 400, { error: 'Image file not found' });
                }

                name = Array.isArray(name) ? name[0].trim() : name.trim();
                const slug = name.split(' ').join('-');

                const exgit = await categoryModel.findOne({ name })
                if (exgit) {
                    return responseReturn(res, 400, { error: 'Category already exists' })
                }

                const result = await cloudinary.uploader.upload(imageFile.filepath, {
                    folder: 'categorys',
                });

                if (result) {
                    const category = await categoryModel.create({
                        name,
                        slug,
                        image: result.url,
                    });
                    return responseReturn(res, 201, {
                        category,
                        message: 'Category added successfully',
                    });
                } else {
                    return responseReturn(res, 400, { error: 'Image upload failed' });
                }
            } catch (error) {
                return responseReturn(res, 500, { error: 'Internal server error' });
            }
        });
    };

    category_get = async (req, res) => {

        try {
            const categorys = await categoryModel.find({})
            const totalCategory = await categoryModel.find({}).countDocuments()

            if(!categorys && !totalCategory){
                return responseReturn(res, 400)
            }
            
            return responseReturn(res, 200, { categorys, totalCategory })

        } catch (error) {
            return responseReturn(res, 500, { error: 'Internal server error' })
        }
    };

    category_delete = async (req, res) => {
        try {
            const { public_id, _id } = req.body;

            if (!public_id || !_id) {
                return responseReturn(res, 400, { error: 'Missing required data (public_id or _id)' });
            }

            const image_delete_result = await cloudinary.uploader.destroy(public_id);

            if (image_delete_result.result !== 'ok' && image_delete_result.result !== 'not found') {
                return responseReturn(res, 400, { error: 'Failed to delete image from Cloudinary' });
            }
            
            const categoryId = new ObjectId(_id) 

            const delete_result = await categoryModel.findByIdAndDelete(categoryId); 

            if (delete_result.deletedCount === 0) {
                return responseReturn(res, 404, { error: 'Category not found in database' });
            }

            return responseReturn(res, 200, { message: 'Category deleted successfully' });

        } catch (error) {
            return responseReturn(res, 500, { error: 'Internal server error' });
        }
    };



}

module.exports = new categoryController();

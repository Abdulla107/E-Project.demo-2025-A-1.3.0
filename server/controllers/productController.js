const productModel = require('../models/productModel');
const bannerModel = require('../models/bannerModel');
const fs = require('fs')
const formidable = require('formidable')
const cloudinary = require('cloudinary').v2;
const { responseReturn } = require('../utiles/response')
const { mongo: { ObjectId } } = require('mongoose')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});

class productController {

    // admin 
    product_add = async (req, res) => {

        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return responseReturn(res, 500, {
                    message: "Form parsing error",
                    error: err.message,
                });
            }

            const get = (field) => Array.isArray(field) ? field[0] : field;
            const parseSafeInt = (val) => isNaN(parseInt(val)) ? 0 : parseInt(val);

            const name = get(fields.name);
            const category = get(fields.category);
            const description = get(fields.description);
            const stock = parseSafeInt(get(fields.stock));
            const price = parseSafeInt(get(fields.price));
            const discount = parseSafeInt(get(fields.discount));
            const delivery_charge = parseSafeInt(get(fields.delivery_charge));
            const brand = get(fields.brand);

            if (!name || !category || !description || !stock || !price || !discount || !delivery_charge) {
                return responseReturn(res, 400, { message: "All required fields are necessary." });
            }

            const slug = name.trim().split(" ").join("-");

            try {
                const images = Array.isArray(files.images) ? files.images : [files.images];

                const uploadPromises = images.map(image =>
                    cloudinary.uploader.upload(image.filepath, { folder: "products" })
                );

                const results = await Promise.all(uploadPromises);
                const allImageUrl = results.map(result => result.url);

                if (!results) {
                    return responseReturn(res, 400, { message: "Image upload failed." });
                };

                const product = await productModel.create({
                    name: name.trim(),
                    slug,
                    category: category.trim(),
                    description: description.trim(),
                    stock,
                    price,
                    discount,
                    delivery_charge,
                    images: allImageUrl,
                    brand: brand?.trim(),
                });

                return responseReturn(res, 201, { product, message: "Product added successfully!" });
            } catch (error) {
                return responseReturn(res, 500, { error: error.message });
            }
        });
    };


    
    products_get = async (req, res) => {

        try {
            const product = await productModel.find({})
            const totalProduct = await productModel.find({}).countDocuments()

            if (!product || !totalProduct) {
                return responseReturn(res, 400, { product: 0, totalProduct: 0})
            }
            return responseReturn(res, 200, { product, totalProduct })
        } catch (error) {
            return responseReturn(res, 500, { error: 'Internal server error' })
        }
    };

    // user
    feature_products_get = async (req, res) => {

        try {
            const faeaturlProducts = await productModel.find({}).limit(15).sort({ createdAt: -1})

            if (!faeaturlProducts) {
                return responseReturn(res, 400, { faeaturlProducts: 0})
            }
            return responseReturn(res, 200, { faeaturlProducts })
        } catch (error) {
            return responseReturn(res, 500, { error: 'Internal server error' })
        }
    };


    product_get = async (req, res) => {
        const { productId } = req.params;

        try {
            if (productId) {
                const id = new ObjectId(productId) 
                const product = await productModel.findById(id);

                if (!product) {
                    return responseReturn(res, 400)
                }
                return responseReturn(res, 200, { product });
            }
        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    };

    product_update = async (req, res) => {
        try {
            let { name, description, discount, price, brand, category, productId, stock,  delivery_charge } = req.body;

            if (!productId) {
                return responseReturn(res, 400, { error: "Product ID is required" });
            }

            // Trim and sanitize inputs
            name = name?.trim();
            description = description?.trim();
            brand = brand?.trim();
            category = category?.trim();

            const slug = name?.split(" ").join("-").toLowerCase();

            // Build the update object dynamically
            const updateData = {
                ...(name && { name }),
                ...(description && { description }),
                ...(discount !== undefined && { discount }),
                ...( delivery_charge !== undefined && {  delivery_charge }),
                ...(price !== undefined && { price }),
                ...(brand && { brand }),
                ...(category && { category }),
                ...(stock !== undefined && { stock }),
                ...(slug && { slug }),
            };

            const id = new ObjectId(productId) 
        
            await productModel.findByIdAndUpdate(id, updateData, { new: true });

            const product = await productModel.findById(id);

            return responseReturn(res, 200, {
                message: "Product updated successfully",
                product,
            });
        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    };

    porduct_deleted = async (req, res) => {
        const { product_img, _id } = req.body;

        try {
            if (!product_img || !_id) {
                return responseReturn(res, 400, { error: 'Missing required data (product_img or _id)' });
            }
           

            const getPublicId = (url) => {
                const parts = url.split('/');
                const fileName = parts.pop().split('.')[0];
                const folder = parts.pop();
                return `${folder}/${fileName}`;
            };

             const productId = new ObjectId(_id) 

            const banners = await bannerModel.find({productId});
            if (banners.length > 0) {
                for (let banner of banners) {
                    
                    const image_id = getPublicId(banner.image);

                    const result = await cloudinary.uploader.destroy(image_id);
                    if (result.result !== 'ok' && result.result !== 'not found') {
                        return responseReturn(res, 400, { error: 'Failed to delete banner image from Cloudinary' });
                    }
                }
                await bannerModel.deleteMany({ productId });
            }

            for (let imgUrl of product_img) {
                const image_id = getPublicId(imgUrl);
                const result = await cloudinary.uploader.destroy(image_id);
                if (result.result !== 'ok' && result.result !== 'not found') {
                    return responseReturn(res, 400, { error: 'Failed to delete product image from Cloudinary' });
                }
            }

            const delete_result = await productModel.findByIdAndDelete(productId);
            if (delete_result.deletedCount === 0) {
                return responseReturn(res, 404, { error: 'Product not found in database' });
            }

            return responseReturn(res, 200, { message: 'Product deleted successfully' });

        } catch (error) {
            return responseReturn(res, 500, { error: 'Internal server error' });
        }
    };


    product_banner_add = async (req, res) => {

        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return responseReturn(res, 400, { error: 'Form parsing error' });
            }

            try {
                const { productId } = fields;
                const imageFile = files.image && Array.isArray(files.image) ? files.image[0] : files.image;

                if (!productId || !imageFile || !fs.existsSync(imageFile.filepath)) {
                    return responseReturn(res, 400, { error: 'Required data missing or image file not found' });
                }


                const result = await cloudinary.uploader.upload(imageFile.filepath, {
                    folder: 'banners',
                });

                const str = productId[0].toString()
                const pId = new ObjectId(str)
                const product = await productModel.findById(pId, {slug: 1})

                const banner = await bannerModel.create({
                    productId,
                    slug: product.slug,
                    image: result.secure_url, 
                });

                return responseReturn(res, 201, { message: 'Banner added successfully', banner });
            } catch (error) {
                return responseReturn(res, 500, { error: 'Internal server error' });
            }
        });
    };

    product_banners_get = async (req, res) => {

        try {
            const banners = await bannerModel.find({})
            if (!banners) {
                return responseReturn(res, 400)
            }
            return responseReturn(res, 200, { banners })

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }

    product_get_banner = async (req, res) => {
        const { productId } = req.params;

        try {
            if (productId) {
                const id = new ObjectId(productId) 
                const banner = await bannerModel.find({ productId: id });

                if (!banner) {
                    return responseReturn(res, 400)
                }
                return responseReturn(res, 200, { banner })
            }

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }

    product_banner_delete = async (req, res) => {
        const { public_id, _id } = req.body;

        try {
            if (!public_id || !_id) {
                return responseReturn(res, 400, { error: 'Missing required data' });
            }

            const image_delete_result = await cloudinary.uploader.destroy(public_id);

            if (image_delete_result.result !== 'ok' && image_delete_result.result !== 'not found') {
                return responseReturn(res, 400, { error: 'Failed to delete image from Cloudinary' });
            }
            const bannerId = new ObjectId(_id) 

            const delete_result = await bannerModel.findByIdAndDelete(bannerId); 

            if (delete_result.deletedCount === 0) {
                return responseReturn(res, 404, { error: 'Banner not found in database' });
            }

            return responseReturn(res, 200, { message: 'Banner deleted successfully' });
        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    };




}

module.exports = new productController();

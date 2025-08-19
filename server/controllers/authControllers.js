const adminModel = require('../models/adminModel');
const myWalletModel = require('../models/myWalletModel');
const countryModel = require('../models/countryModel');
const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');
const joyentUserModel = require('../models/joyentUserModel');
const { responseReturn } = require('../utiles/response')
const bcrypt = require('bcrypt');
const { createToken } = require('../utiles/tokenCreate');
const formidable = require('formidable');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const moment = require('moment')
const api_F = require('./../api/api_F');
const { mongo: { ObjectId } } = require('mongoose');

// Cloudinary cnfiguration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});


class authControllers {

    admin_login = async (req, res) => {
        const { email, password } = req.body;
        try {

            if (!email || !password) {
                return responseReturn(res, 404, { error: 'All required fields are necessary.' })
            }


            if (password.length < 6) {
                return responseReturn(res, 400, { message: 'Password must be at least 6 characters long.' })
            }

            const admin = await adminModel.findOne({ email }).select("+password");
            if (admin) {
                const match = await bcrypt.compare(password, admin.password);
                if (match) {
                    const token = await createToken({
                        id: admin.id,
                        role: admin.role,
                    });

                    res.cookie("accessToken", token, {
                      httpOnly: true,
                      secure: true,
                      sameSite: "none",
                      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    });

                    return responseReturn(res, 200, {
                        token,
                        message: "Login successful",
                        data: {
                            id: admin.id,
                            name: admin.name,
                            role: admin.role,
                            image: admin.image

                        },
                    });
                } else {
                    return responseReturn(res, 404, { error: "Login failed!" });
                }
            } else {
                return responseReturn(res, 404, { error: "Login failed!" });
            }
        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    };


    authoriz_admin = async (req, res) => {
        const { decoded } = req.body;

        try {
            if (decoded.role !== 'admin') {
                return responseReturn(res, 403, { message: 'Unauthorized access. Admins only.' });
            }
            const adminId = new ObjectId(decoded.id) 

            const admin = await adminModel.findById(adminId); 

            if (!admin) {
                return responseReturn(res, 404, { message: 'Admin not found' });
            }

            return responseReturn(res, 200, {
                data: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role,
                    image: admin.image

                }
            });

        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    };


    // logout admin
    logout = async (req, res) => {
        try {
            res.cookie('accessToken', null, {
                expires: new Date(Date.now()),
                httpOnly: true
            })
            return responseReturn(res, 200, { message: 'Logout successful' })
        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    };

    // user Register 
    register_user = async (req, res) => {
        const { name, email, koscen, password } = req.body;

        try {
            if (!name || !email || !koscen || !password) {
                return responseReturn(res, 400, { message: "All required fields are necessary." });
            }

            if (password.length < 6) {
                return responseReturn(res, 400, { message: 'Password must be at least 6 characters long.' })
            }

            const getUser = await userModel.findOne({ email });
            if (getUser) {
                return responseReturn(res, 409, { message: 'User already exists' });
            }

            const user = await userModel.create({
                name,
                email,
                koscen: await bcrypt.hash(koscen, 10),
                password: await bcrypt.hash(password, 10)
            });

            const time = moment(Date.now()).format('l')
            const splitTime = time.split('/')

            await joyentUserModel.create({
                userId: user._id,
                month: splitTime[0],
                year: splitTime[2]
            })


            const token = await createToken({ id: user.id, role: user.role });
            res.cookie('accessToken', token, {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });

            return responseReturn(res, 201, { message: 'Register successfully' });

        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    }

    // user Login
    user_login = async (req, res) => {
        const { email, password } = req.body;

        try {
            if (!email || !password) {
                return responseReturn(res, 404, { error: 'All required fields are necessary.' })
            }

            if (password.length < 6) {
                return responseReturn(res, 400, { message: 'Password must be at least 6 characters long.' })
            }

            const user = await userModel.findOne({ email }).select("+password");
            if (user) {
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    const token = await createToken({
                        id: user.id,
                        role: user.role,
                    });

                    res.cookie("accessToken", token, {
                      httpOnly: true,
                      secure: true,
                      sameSite: "none",
                      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    });

                    return responseReturn(res, 200, {
                        token,
                        message: "Login successful",
                        data: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            date: user.date,
                            image: user.image,

                        },
                    });
                } else {
                    return responseReturn(res, 404, { error: "Login failed!" });
                }
            } else {
                return responseReturn(res, 404, { error: "Login failed!" });
            }
        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    }


    // user authorization 
    authoriz_user = async (req, res) => {
        const { decoded } = req.body;

        try {
            if (decoded.role !== 'user') {
                return responseReturn(res, 403, { message: 'Unauthorized access. User only.' });
            }
            const userId = new ObjectId(decoded.id) 

            const user = await userModel.findById(userId); 

            if (!user) {
                return responseReturn(res, 404, { message: 'User not found' });
            }

            return responseReturn(res, 200, {
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    date: user.date,
                    image: user.image,

                }
            });

        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    };

    // user logout
    user_logout = async (req, res) => {

        try {
            res.cookie('accessToken', null, {
                expires: new Date(Date.now()),
                httpOnly: true
            })
            const navigetUrl = `${api_F}/login`
            return responseReturn(res, 200, { navigetUrl, message: 'Logout successful' })
        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    };




    // add user profile image
    profile_info_add = async (req, res) => {
        const form = new formidable.IncomingForm({ multiples: false });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return responseReturn(res, 400, { error: 'Form parsing error' });
            }

            try {
                const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
                const imageFile = files.image ? files.image[0] : null;

                if (!userId) {
                    return responseReturn(res, 400, { error: 'Missing required fields' });
                }
                const _id = new ObjectId(userId) 

                const user_info = await userModel.findById(_id); 

                const tempDate = moment(Date.now()).format("LL");

                if (user_info.image) {
                    let imageURL = user_info.image;

                    if (imageFile && fs.existsSync(imageFile.filepath)) {
                        const getPublicId = (url) => {
                            const parts = url.split('/');
                            const fileName = parts.pop().split('.')[0];
                            const folder = parts.pop();
                            return `${folder}/${fileName}`;
                        };

                        const image_id = getPublicId(user_info.image);
                        const destroyResult = await cloudinary.uploader.destroy(image_id);

                        if (destroyResult.result !== 'ok' && destroyResult.result !== 'not found') {
                            return responseReturn(res, 400, { error: 'Failed to delete old image from Cloudinary' });
                        }

                        const uploadResult = await cloudinary.uploader.upload(imageFile.filepath, { folder: 'profile' });

                        if (!uploadResult?.secure_url) {
                            return responseReturn(res, 400, { error: 'Image upload failed' });
                        }

                        imageURL = uploadResult.secure_url;
                    }

                    await userModel.findByIdAndUpdate( 
                        _id,
                        { image: imageURL, date: tempDate }
                    );

                    return responseReturn(res, 201, { image: imageURL, message: 'Profile image updated successfully' });
                }

                if (!imageFile || !fs.existsSync(imageFile.filepath)) {
                    return responseReturn(res, 400, { error: 'Image file not found or invalid for new profile' });
                }

                const result = await cloudinary.uploader.upload(imageFile.filepath, { folder: 'profile' });

                if (!result?.secure_url) {
                    return responseReturn(res, 400, { error: 'Image upload failed' });
                }

                await userModel.findByIdAndUpdate(_id, { image: result.secure_url, date: tempDate }); 

                return responseReturn(res, 201, { message: 'Profile image added successfully' });

            } catch (error) {
                return responseReturn(res, 500, { error: 'Internal server error' });
            }
        });
    };


    update_password = async (req, res) => {
        const { newPassword, oldPassword, userId } = req.body;


        try {
            if (!oldPassword || !newPassword || !userId) {
                return responseReturn(res, 400, { error: 'All fields are required.' });
            }
            const _id = new ObjectId(userId) 

            const user = await userModel.findById(_id).select("+password"); 

            if (!user) {
                return responseReturn(res, 404, { error: 'User not found.' });
            }


            const isMatch = await bcrypt.compare(oldPassword, user.password);

            if (!isMatch) {
                return responseReturn(res, 401, { error: 'Old password is incorrect.' });
            }

            const isSamePassword = await bcrypt.compare(newPassword, user.password);

            if (isSamePassword) {
                return responseReturn(res, 400, { error: 'New password must be different from the old password.' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            res.cookie('accessToken', null, {
                expires: new Date(Date.now()),
                httpOnly: true
            })
            const navigetUrl = `${api_F}/login`

            return responseReturn(res, 200, { navigetUrl, message: 'Password updated successfully.' });
        } catch (error) {
            return responseReturn(res, 500, { error: 'Internal server error' });
        }
    };


    admin_add_target_country = async (req, res) => {
        const { label, value, code } = req.body;

        try {
            if (!label || !value || !code) {
                return responseReturn(res, 400, { error: 'Country add failed' })
            }

            const existeCountry = await countryModel.exists({ label })
            if (existeCountry) {
                return responseReturn(res, 400, { error: 'Country already exists' })
            }

            const country = await countryModel.create({
                label,
                value,
                code,
            })
            return responseReturn(res, 200, { country, message: 'Country add successfuly' })

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }


    }

    admin_get_target_country = async (req, res) => {

        try {

            const country = await countryModel.find()
            if (!country) {
                return responseReturn(res, 400, { error: 'Country not found' })
            }
            return responseReturn(res, 200, { country })

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    };


    admin_delete_target_country = async (req, res) => {
        const { id } = req.params;

        try {
            if (!id) {
                return responseReturn(res, 400, { error: 'Delete failed' })
            }

            const _id = new ObjectId(id)
            const delet = await countryModel.deleteOne(_id)

            if (!delet) {
                return responseReturn(res, 400, { error: 'Delete failed' })
            }
            return responseReturn(res, 200, { message: 'Delete successfuly' })

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }

    admin_get_deshboard_details = async (req, res) => {

        try {
            const sales = await myWalletModel.find({}, { amount: 1, })

            let amount = 0
            sales.map((d) => {
                for (let i = 0; i < sales.length; i++) {
                    amount += Number(d.amount)

                }
            })

            const customer_count = await userModel.find().countDocuments();
            const order_count = await orderModel.find().countDocuments();
            const new_order_count = await orderModel.find({ delivery_status: 'Pending' }).countDocuments();
            const new_orders = await orderModel.find({ delivery_status: 'Pending' }).sort({ createdAt: -1 }).limit(7)

            const time = moment(Date.now()).format('l')
            const splitTime = time.split('/')

            const month = splitTime[0]
            const year = splitTime[2]

            let order_chart = []
            for (let i = 0; i <= month; i++) {
                const count = await myWalletModel.find({ month: i, year }).countDocuments()
                order_chart.push(count)
            }


            let customer_chart = []
            for (let i = 0; i <= month; i++) {
                const count = await joyentUserModel.find({ month: i, year }).countDocuments();
                customer_chart.push(count)
            }


            return responseReturn(res, 200, {
                sales_count: parseFloat(amount.toFixed(2)),
                customer_count, order_count, new_order_count,
                new_orders, order_chart, customer_chart
            })


        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    };



    add_admin_proifle_image = async (req, res) => {
        const form = new formidable.IncomingForm({ multiples: false });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return responseReturn(res, 400, { error: 'Form parsing error' });
            }

            try {
                const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
                const imageFile = files.image ? files.image[0] : null;

                if (!userId) {
                    return responseReturn(res, 400, { error: 'Missing required fields' });
                }
                const _id = new ObjectId(userId) 

                const user_info = await adminModel.findById(_id); 


                if (user_info.image) {
                    let imageURL = user_info.image;

                    if (imageFile && fs.existsSync(imageFile.filepath)) {
                        const getPublicId = (url) => {
                            const parts = url.split('/');
                            const fileName = parts.pop().split('.')[0];
                            const folder = parts.pop();
                            return `${folder}/${fileName}`;
                        };

                        const image_id = getPublicId(user_info.image);
                        const destroyResult = await cloudinary.uploader.destroy(image_id);

                        if (destroyResult.result !== 'ok' && destroyResult.result !== 'not found') {
                            return responseReturn(res, 400, { error: 'Failed to delete old image from Cloudinary' });
                        }

                        const uploadResult = await cloudinary.uploader.upload(imageFile.filepath, { folder: 'profile' });

                        if (!uploadResult?.secure_url) {
                            return responseReturn(res, 400, { error: 'Image upload failed' });
                        }

                        imageURL = uploadResult.secure_url;
                    }

                    await adminModel.findByIdAndUpdate( 
                        _id,
                        { image: imageURL }
                    );

                    return responseReturn(res, 201, { image: imageURL, message: 'Profile image updated successfully' });
                }

                if (!imageFile || !fs.existsSync(imageFile.filepath)) {
                    return responseReturn(res, 400, { error: 'Image file not found or invalid for new profile' });
                }

                const result = await cloudinary.uploader.upload(imageFile.filepath, { folder: 'profile' });

                if (!result?.secure_url) {
                    return responseReturn(res, 400, { error: 'Image upload failed' });
                }

                await adminModel.findByIdAndUpdate(_id, { image: result.secure_url }); 

                return responseReturn(res, 201, { message: 'Profile image added successfully' });

            } catch (error) {
                return responseReturn(res, 500, { error: 'Internal server error' });
            }
        });
    };

    admin_get_profileDetails = async (req, res) => {

        try {
            const count_pending_orders = await orderModel.find({ delivery_status: 'Pending' }).countDocuments();
            const count_orders = await orderModel.find().countDocuments();

            const sales = await myWalletModel.find({}, { amount: 1, })

            let amount = 0
            sales.map((d) => {
                for (let i = 0; i < sales.length; i++) {
                    amount += Number(d.amount)

                }
            })

            return responseReturn(res, 200, {
                count_pending_orders,
                count_orders,
                count_earnings: parseFloat(amount.toFixed(2))
            })

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }

    admin_update_password = async (req, res) => {
        const { current_password, new_password, confirm_password } = req.body;

        try {
            if (!current_password || !new_password || !confirm_password) {
                return responseReturn(res, 400, { error: "All required fields are necessary." })
            }

            if (current_password.length < 6 || new_password.length < 6 || confirm_password.length < 6) {
                return responseReturn(res, 400, { error: 'Password must be at least 6 characters long.' })
            }

            if (new_password !== confirm_password) {
                return responseReturn(res, 400, { error: 'New & Confirm password not match!.' })
            }

            const admin = await adminModel.findOne().select('password')
            const match = await bcrypt.compare(current_password, admin.password)
            const new_match = await bcrypt.compare(new_password, admin.password)

            if (new_match) {
                return responseReturn(res, 400, { error: 'Current & New password match!. Place chang new password' })
            }

            if (!match) {
                return responseReturn(res, 400, { error: 'Password update failed!' })
            }

            await adminModel.updateOne({
                password: await bcrypt.hash(new_password, 10)
            })
            return responseReturn(res, 200, { message: 'Password update successfuly' })

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    };



    user_get_admin_image = async (req, res) => {

        try {
            const admin = await adminModel.findOne({}, { image: 1 })
            return responseReturn(res, 200, { admin_image: admin.image })

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    };



    admin_get_new_orderCount = async (req, res) => {

        try {
            const countOrder = await orderModel.find({ delivery_status: 'Pending' }).countDocuments()
            return responseReturn(res, 200, { countOrder })

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    };




    user_password_reset = async (req, res) => {
        const { email, secretAnswer, password } = req.body;

        try {
            if (!email || !secretAnswer || !password) {
                return responseReturn(res, 400, { error: "All required fields are necessary." });
            }

            if (password.length < 6) {
                return responseReturn(res, 400, { error: "Password must be at least 6 characters long." });
            }

            const user = await userModel.findOne({ email }).select('password koscen');

            if (!user) {
                return responseReturn(res, 404, { error: "Password Reset failed." });
            }

            const answer_match = await bcrypt.compare(secretAnswer, user.koscen);

            if (!answer_match) {
                return responseReturn(res, 403, { error: "Password Reset failed." });
            }

            const isSameAsOldPassword = await bcrypt.compare(password, user.password);
            if (isSameAsOldPassword) {
                return responseReturn(res, 400, { error: 'You are using the default password. Please enter a new password.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await userModel.findOneAndUpdate(
                { email },
                { password: hashedPassword },
                { new: true }
            );

            return responseReturn(res, 200, { message: "Password has been reset successfully." });

        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    };



}

module.exports = new authControllers();

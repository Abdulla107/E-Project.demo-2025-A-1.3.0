import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { UserCog } from "lucide-react";
import { BsImage } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { add_profileImage } from "../../store/reducers/authReducer";
import { page_color, profile_card_color } from "../../color/colors";


const Profile_card = ({ fadeUp }) => {

    const dispatch = useDispatch();
    const [editProfile, setEditProfile] = useState(false);
    const [imageShow, setImageShow] = useState(null);
    const [state, setState] = useState({ image: "" });
    const { userInfo, successMessage } = useSelector((state) => state.auth);


    const addProfileInfo = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("userId", userInfo?.id);
        formData.append("image", state.image);

        dispatch(add_profileImage(formData));
    };

    const fileInputRef = useRef(null);

    const isFormValid = () => {
        return userInfo.id && state.image;
    };

    const changeImage = (e) => {
        let files = e.target.files;
        if (files.length > 0) {
            setImageShow(URL.createObjectURL(files[0]));
            setState({
                ...state,
                image: files[0],
            });
        }
    };

    // Trigger file input click
    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    useEffect(() => {
        setState({
            name: userInfo?.name || "John Doe",
            email: userInfo?.email || "john.doe@example.com",
            image: userInfo?.image,
        });
        setImageShow(userInfo?.image);
    }, [userInfo, successMessage]);


    useEffect(() => {
        if (successMessage) {
            setEditProfile(false)
        }
    }, [successMessage])

    const color = profile_card_color || '';
    const imgColor = profile_card_color.img_upload || '';
    const btn = profile_card_color.img_upload.save_btn || '';

    return (
        <motion.div
            className={`${page_color?.bg} shadow-2xl rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8`}
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
        >
            {!editProfile ? (
                <>
                    <motion.img
                        src={userInfo?.image || "https://i.pravatar.cc/150?img=32"}
                        alt="Admin Avatar"
                        className={`w-32 h-32 rounded-full border-4 shadow-md object-cover ${color.img_border}`}
                        whileHover={{ scale: 1.1, rotate: 2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    />
                    <div className="flex-1 space-y-3 text-center md:text-left">
                        <motion.h2 className={`text-3xl font-bold ${color.n_text}`}>
                            {userInfo?.name || "admin"}
                        </motion.h2>
                        <p className={`text-sm ${color.e_text}`}>
                            {userInfo?.email || "admin@example.com"}
                        </p>
                        <span className={`inline-block px-3 py-1 text-sm rounded-full ${color.role_color}`}>
                            Super Admin
                        </span>
                        <motion.button
                            onClick={() => setEditProfile(true)}
                            className={`mt-4 flex items-center gap-2 ${color.btn}  px-5 py-2 rounded-xl shadow-lg hover:scale-105 transition-all mx-auto md:mx-0 cursor-pointer`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <UserCog className="w-4 h-4" /> Edit Profile
                        </motion.button>
                    </div>
                </>
            ) : (
                <>
                    <form className="w-full" onSubmit={addProfileInfo}>
                        {/* Image Upload */}
                        <div className="flex max-md:justify-center items-center gap-4 mb-6">
                            {imageShow ? (
                                <div
                                    className="relative w-32 h-32 cursor-pointer"
                                    onClick={handleImageClick}
                                >
                                    <img
                                        src={imageShow}
                                        alt="Preview"
                                        className="w-full h-full rounded-full object-fill border"
                                    />
                                </div>
                            ) : (
                                <label
                                    htmlFor="profileImage"
                                    className={`cursor-pointer text-center border-2 border-dashed px-4 py-2 rounded-md text-sm ${imgColor.label_color}`}
                                >
                                    <BsImage className="mx-auto mb-1 text-xl" />
                                    Add Image
                                </label>
                            )}
                            <input
                                type="file"
                                id="profileImage"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={changeImage}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex max-md:justify-center space-x-4">
                            {/* Save Profile */}
                            <button
                                type="submit"
                                disabled={!isFormValid()}
                                className={`px-4 py-1 rounded-md transition-all ${!isFormValid()
                                    ? `${btn.disabeld_color} cursor-not-allowed`
                                    : `border focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${btn.active_color}`
                                    }`}
                            >
                                Save
                            </button>

                            {/* Cancel */}
                            <button
                                type="button"
                                onClick={() => setEditProfile(false)}
                                className={`${imgColor.cancal_btn} px-4 py-1 rounded-md border transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer`}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </>
            )}
        </motion.div>
    )
}

export default Profile_card

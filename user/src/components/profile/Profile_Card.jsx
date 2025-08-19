import React, { useEffect, useState, useRef } from 'react';
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import { BsImage } from "react-icons/bs";
import { add_profile_info } from '../../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { profileCardColors } from '../../color/colors';

const Profile_Card = () => {
  const dispatch = useDispatch();
  const [editProfile, setEditProfile] = useState(false);
  const [imageShow, setImageShow] = useState(null);
  const { userInfo, successMessage } = useSelector(state => state.auth)

  const [state, setState] = useState({ image: '' });
  const fileInputRef = useRef(null);

  const changeImage = (e) => {
    let files = e.target.files;
    if (files.length > 0) {
      setImageShow(URL.createObjectURL(files[0]));
      setState({ ...state, image: files[0] });
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const isFormValid = () => userInfo.id && state.image;

  const addProfileInfo = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userId', userInfo?.id);
    formData.append('image', state.image);
    dispatch(add_profile_info(formData));
  };

  useEffect(() => {
    setState({
      name: userInfo?.name || 'John Doe',
      email: userInfo?.email || 'john.doe@example.com',
      image: userInfo?.image
    });
    setImageShow(userInfo?.image);
  }, [userInfo, successMessage]);

  useEffect(() => {
    if (successMessage) setEditProfile(false);
  }, [successMessage]);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center md:items-start gap-6 ${profileCardColors.wrapperBg}`}
      >
        {!editProfile ? (
          <>
            <img
              src={state?.image || "https://i.pravatar.cc/150?img=3"}
              alt="Profile"
              onClick={handleImageClick}
              className={`w-32 h-32 rounded-full border-4 shadow-md hover:scale-105 transition-transform duration-300 object-fill cursor-pointer ${profileCardColors.profileImageBorder}`}
            />
            <div className="flex-1 text-center md:text-start space-y-2 w-full">
              <h2 className={`text-2xl font-bold ${profileCardColors.nameText}`}>{state.name}</h2>
              <p className={profileCardColors.emailText}>{state.email}</p>
              <p className={`text-sm ${profileCardColors.joinedText}`}>
                Joined on <span>{userInfo?.date || ''}</span>
              </p>
            </div>
            <button
              onClick={() => setEditProfile(true)}
              className={`flex items-center gap-1 transition cursor-pointer ${profileCardColors.editBtnText}`}
            >
              <FaEdit /> Edit Profile
            </button>
          </>
        ) : (
          <form className="w-full" onSubmit={addProfileInfo}>

            {/* Image Upload */}
            <div className="flex max-lg:justify-center items-center gap-4 mb-6">
              {imageShow ? (
                <div className="relative w-32 h-32 cursor-pointer" onClick={handleImageClick}>
                  <img src={imageShow} alt="Preview" className="w-full h-full rounded-full object-fill border" />
                </div>
              ) : (
                <label htmlFor="profileImage" className={`cursor-pointer text-center border-2 border-dashed px-4 py-2 rounded-md text-sm ${profileCardColors.inputLabelBorder}`}>
                  <BsImage className="mx-auto mb-1 text-xl" /> Add Image
                </label>
              )}
              <input type="file" id="profileImage" className="hidden" ref={fileInputRef} onChange={changeImage} />
            </div>

            {/* Submit Button */}
            <div className="flex max-lg:justify-center space-x-4">
              <button
                type="submit"
                disabled={!isFormValid()}
                className={`px-4 py-1 rounded-md transition-all ${!isFormValid() ? profileCardColors.submitBtnDisabled : profileCardColors.submitBtnEnabled}`}
              >
                Save Profile
              </button>

              <button
                type="button"
                onClick={() => setEditProfile(false)}
                className={`px-4 py-1 rounded-md transition-all ${profileCardColors.cancelBtn}`}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Profile_Card;

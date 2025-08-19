import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import FadeLoader from 'react-spinners/FadeLoader';
import Profile_card from "../components/profile/Profile_card";
import Stat_cards from "../components/profile/Stat_cards";
import Change_password from "../components/profile/Change_password";
import toast from "react-hot-toast";
import { messageClear } from "../store/reducers/authReducer";
import { page_color, profile_color } from "../color/colors";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const Profile = () => {
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage } = useSelector((state) => state.auth);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear())

    } else if (errorMessage) {
      toast.error(errorMessage)
      dispatch(messageClear())
    }
  }, [successMessage, errorMessage])

  const color = profile_color?.password_guidelines_card || "";


  return (
    <>
      {loader && (
        <div className={`fixed inset-0 flex justify-center items-center ${page_color?.loader} bg-opacity-40 z-50`}>
          <FadeLoader color={`${page_color?.loader_icon_color}`} />
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 py-4 space-y-10">
        <Profile_card fadeUp={fadeUp} />
        <Stat_cards fadeUp={fadeUp} />

        {/* Bottom Grid: Change Password + Password Guidelines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Change_password fadeUp={fadeUp} />
          {/* Password Guidelines Card */}
          <div className="space-y-8">
            <motion.div
              className={`${page_color?.bg} p-6 rounded-2xl shadow-xl border ${color.border}`}
              custom={5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`${color.shieldAlert_color.icon} p-3 rounded-full shadow-sm`}>
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h2 className={`text-xl font-semibold ${color.shieldAlert_color.text}`}>
                  Password Guidelines
                </h2>
              </div>
              <div className={`space-y-4 ${color.text}`}>
                <ol className="list-decimal pl-5 space-y-2">
                  <li><strong>Passwords must be 6 characters or more.</strong> Lowercase letters form the word structure.</li>
                  <li><strong>Use strong words:</strong> Passwords must contain uppercase letters (A-Z), lowercase letters (a-z), numbers (0-9), and if possible, special characters (!@#$%^&*).</li>
                  <li><strong>Never share your password with anyone else.</strong> If someone else has your password, it can be seen in your super admin panel and cause problems for you.</li>
                  <li><strong>Password storage tips:</strong> Use a password manager and follow a unique pattern that you like.</li>
                </ol>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

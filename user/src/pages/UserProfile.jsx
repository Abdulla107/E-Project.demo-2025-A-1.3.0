import React from "react";
import { useSelector } from "react-redux";
import NotFound from "./NotFound";
import Shipping_Addresses from "../components/profile/Shipping_Addresses";
import Profile_Card from "../components/profile/Profile_Card";
import Summary_Cards from "../components/profile/Summary_Cards";
import Chang_password from "../components/profile/Chang_password";
import { userProfile_color } from "../color/colors";



const UserProfile = () => {

  const { userInfo } = useSelector((state) => state.auth);

  return userInfo?.id ? (
    <div className={`${userProfile_color.wrapper_bg} min-h-screen md:w-[95%] py-10 px-4 mx-auto rounded-md`}>
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <Profile_Card />
        <Summary_Cards />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${userProfile_color.card_bg} ${userProfile_color.section_padding} ${userProfile_color.section_rounded} ${userProfile_color.card_shadow} ${userProfile_color.card_shadow_hover}`}>
            <Shipping_Addresses />
          </div>
          <div className={`${userProfile_color.card_bg} ${userProfile_color.section_padding} ${userProfile_color.section_rounded} ${userProfile_color.card_shadow} ${userProfile_color.card_shadow_hover}`}>
            <Chang_password/>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <NotFound />
  );
};

export default UserProfile;

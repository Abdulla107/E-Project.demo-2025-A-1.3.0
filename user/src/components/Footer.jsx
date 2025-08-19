import React from 'react';
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
    FaPaperPlane
} from 'react-icons/fa';
import { page_color, shopName_color, footerColors } from '../color/colors';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className={`${footerColors.bg} ${footerColors.text}`}>
            <div className={`max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 border-b ${footerColors.border}`}>

                {/* Company Info */}
                <div>
                    {/* Logo */}
                    <Link to={'/'} className={`text-xl sm:text-2xl font-bold ${page_color?.bg} px-4 py-1 rounded-lg ${shopName_color?.fast}`}>
                        Shop<span className={`${shopName_color.last}`}>Zone</span>
                    </Link>
                    <p className={`text-sm leading-6 text-gray-400 mt-5`}>
                        Your trusted online marketplace. Get your daily essentials from the comfort of your home.
                    </p>
                    <div className="flex space-x-4 mt-5 text-lg">
                        <a href="#"><FaFacebookF className={`${footerColors.iconBlue} hover:text-blue-500 transition`} /></a>
                        <a href="#"><FaTwitter className={`${footerColors.iconSky} hover:text-sky-400 transition`} /></a>
                        <a href="#"><FaInstagram className={`${footerColors.iconPink} hover:text-pink-500 transition`} /></a>
                        <a href="#"><FaLinkedinIn className={`${footerColors.iconBlueDark} hover:text-blue-600 transition`} /></a>
                        <a href="#"><FaYoutube className={`${footerColors.iconRed} hover:text-red-500 transition`} /></a>
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <h3 className={`${footerColors.heading} text-lg font-semibold mb-4`}>Categories</h3>
                    <ul className="space-y-3 text-sm">
                        {["Electronics", "Fashion", "Home & Kitchen", "Beauty & Health", "Groceries"].map(item => (
                            <li key={item}>
                                <a href="#" className={`${footerColors.linkText} hover:text-white hover:underline transition`}>{item}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Customer Support */}
                <div>
                    <h3 className={`${footerColors.heading} text-lg font-semibold mb-4`}>Customer Service</h3>
                    <ul className="space-y-3 text-sm">
                        {["Help Center", "Track Order", "Returns & Refunds", "Shipping Info", "Privacy Policy"].map(item => (
                            <li key={item}>
                                <a href="#" className={`${footerColors.linkText} hover:text-white hover:underline transition`}>{item}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className={`${footerColors.heading} text-lg font-semibold mb-4`}>Stay Updated</h3>
                    <p className={`text-sm text-gray-400 mb-4`}>Subscribe to receive offers and updates:</p>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Your email"
                            className={`w-full px-4 py-2 pr-10 rounded ${footerColors.inputBg} ${footerColors.inputText} ${footerColors.inputPlaceholder} focus:outline-none ${footerColors.inputFocusRing}`}
                        />
                        <FaPaperPlane className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${footerColors.iconBlue} cursor-pointer`} />
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className={`${footerColors.bottomBg} text-center text-sm ${footerColors.bottomText} py-4`}>
                © {new Date().getFullYear()} ShopEase | All rights reserved
            </div>
        </footer>
    );
};

export default Footer;

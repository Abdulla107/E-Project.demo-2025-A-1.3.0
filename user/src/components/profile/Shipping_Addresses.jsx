import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import { get_shipping_info } from '../../store/reducers/orderReducer';
import { useDispatch, useSelector } from 'react-redux';
import { shippingColors } from '../../color/colors';

const Shipping_Addresses = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const { shippingInfo } = useSelector(state => state.order);

    useEffect(() => {
        if (userInfo.id) {
            dispatch(get_shipping_info(userInfo.id));
        }
    }, [userInfo.id, dispatch]);

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className={`flex items-center gap-3 mb-3 font-semibold text-lg ${shippingColors.headerText}`}>
                    <FaMapMarkerAlt className={shippingColors.iconColor} /> Shipping Address
                </div>

                <div className="lg:col-span-2 p-5 space-y-4 text-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <p><span className={`font-medium ${shippingColors.labelText}`}>Name:</span> <span className={shippingColors.valueText}>{shippingInfo?.fullName}</span></p>
                        <p><span className={`font-medium ${shippingColors.labelText}`}>Email:</span> <span className={shippingColors.valueText}>{shippingInfo?.email}</span></p>
                        <p><span className={`font-medium ${shippingColors.labelText}`}>Phone:</span> <span className={shippingColors.valueText}>{shippingInfo?.phone}</span></p>
                        <p><span className={`font-medium ${shippingColors.labelText}`}>Address:</span> <span className={shippingColors.valueText}>{shippingInfo?.address}</span></p>
                        <p><span className={`font-medium ${shippingColors.labelText}`}>City:</span> <span className={shippingColors.valueText}>{shippingInfo?.city}</span></p>
                        <p><span className={`font-medium ${shippingColors.labelText}`}>District:</span> <span className={shippingColors.valueText}>{shippingInfo?.district}</span></p>
                        <p><span className={`font-medium ${shippingColors.labelText}`}>Postal Code:</span> <span className={shippingColors.valueText}>{shippingInfo?.postalCode}</span></p>
                        <p><span className={`font-medium ${shippingColors.labelText}`}>Country:</span> <span className={shippingColors.valueText}>{shippingInfo?.country}</span></p>
                    </div>

                    <div className={shippingColors.valueText}>
                        <p><span className={`font-medium ${shippingColors.labelText}`}>Shipping Method:</span> {shippingInfo?.shippingMethod}</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Shipping_Addresses;

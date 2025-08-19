import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_order, messageClear, refund_request } from '../../store/reducers/orderReducer';
import { Link, useParams } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import TrackingSteps from '../../components/dashboard/TrackingSteps';
import { socket } from '../../utils/utils'
import { useState } from 'react';
import { RiRefund2Line } from "react-icons/ri";
import RefundModel from '../../components/dashboard/RefundModel';
import toast from 'react-hot-toast'


const OrderDetails = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const [status, setStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { order, errorMessage, successMessage, loader } = useSelector(state => state.order);


    const modelHendler = () => {
        if (!orderId || order.refund) {
            return toast.error('Sorry, your request cannot be accepted')
        };
        dispatch(refund_request(orderId))
    };

    useEffect(() => {
        dispatch(get_order(orderId));
    }, [orderId, dispatch]);

    useEffect(() => {
        if (order?.delivery_status) setStatus(order.delivery_status)
    }, [order])

    useEffect(() => {

        const statusHandler = (data) => {
            if (orderId === data.orderId) {
                setStatus(data.status)
            }
        }
        socket.on('update_order_status', statusHandler)

        return () => {
            socket.off('update_order_status', statusHandler)
        }
    }, [])


    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear());
            dispatch(get_order(orderId));
        } else if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage])


    const getDeliveryStatusClass = (status) => {
        switch (status) {
            case 'Cancelled':
            case 'Failed Delivery':
            case 'Refunded':
                return 'text-red-500';
            case 'Delivered':
                return 'text-green-500';
            default:
                return 'text-purple-600';
        }
    };


    return (
        <div className='px-2 my-2 mx-1'>
            <div className="p-6  mx-auto bg-white shadow-xl rounded-2xl space-y-6 min-h-screen">
                <div>
                    <h2 className="text-lg font-semibold">Order #{order?._id}</h2>
                    <p className="text-gray-500">Placed on {order?.date}</p>
                    <div className="flex items-center justify-between mt-5 gap-4">
                        <div>
                            <span className="font-semibold">Delivery Status : </span>
                            <span className={`border px-4 py-[2px] rounded-full ${getDeliveryStatusClass(order?.delivery_status)}`}>
                                {status}
                            </span>
                            <h1 className={`${order.refund ? '' : 'hidden'}`}>Refund : <span className='text-red-400'>{order.refund}</span> </h1>
                        </div>
                        <div onClick={() => setIsModalOpen(true)} className={`${order?.payment_status === 'paid' ? 'text-2xl cursor-pointer' : ' hidden'}`}>
                            <RiRefund2Line size={30} className="text-xl text-red-500" />
                        </div>

                        {isModalOpen && (
                            <RefundModel
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                onConfirm={() => {
                                    modelHendler();
                                    setIsModalOpen(false);
                                }}
                            />
                        )}

                    </div>

                    {/* Tracking Steps */}
                    {status && (
                        <div className="mt-5">
                            <TrackingSteps currentStatus={status} />
                        </div>
                    )}
                </div>

                {/* Customer & Payment Info */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                        <h3 className="text-lg font-semibold mb-2 border-b border-gray-300">Delivery Info</h3>
                        <p><span className="font-medium">Name:</span> {order?.shippingInfo?.fullName}</p>
                        <p><span className="font-medium">Email:</span> {order?.shippingInfo?.email}</p>
                        <p><span className="font-medium">Phone:</span> {order?.shippingInfo?.phone}</p>
                        <p><span className="font-medium">Address:</span> {order?.shippingInfo?.address}</p>
                        <p><span className="font-medium">City:</span> {order?.shippingInfo?.city}</p>
                        <p><span className="font-medium">District:</span> {order?.shippingInfo?.district}</p>
                        <p><span className="font-medium">PostalCode:</span> {order?.shippingInfo?.postalCode}</p>
                        <p><span className="font-medium">Country:</span> {order?.shippingInfo?.country}</p>
                        <p><span className="font-medium">ShippingMethod:</span> {order?.shippingInfo?.shippingMethod}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                        <h3 className="text-lg font-semibold mb-2 border-b border-gray-300">Payment</h3>
                        <p className="font-medium">Status :
                            <span className={`ml-2 px-4 py-1 rounded-full text-sm ${order?.payment_status === 'paid' ? 'bg-green-200 text-green-800' : 'bg-red-500 text-white'}`}>
                                {order?.payment_status}
                            </span>
                        </p>
                        <p><span className="font-medium">Total Amount :</span> ${order?.total_price}</p>
                    </div>
                </div>

                {/* Product List */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left text-sm border border-gray-200 rounded">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 whitespace-nowrap">No</th>
                                <th className="py-3 px-4 whitespace-nowrap">Image</th>
                                <th className="py-3 px-4 whitespace-nowrap">Name</th>
                                <th className="py-3 px-4 whitespace-nowrap">Category</th>
                                <th className="py-3 px-4 whitespace-nowrap">Brand</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Quantity</th>
                                <th className="py-3 px-4 whitespace-nowrap">Price</th>
                                <th className="py-3 px-4 whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order?.products?.map((d, i) => (
                                <tr key={i} className="border-t border-t-gray-400">
                                    <td className="py-2 px-4">{i + 1}</td>
                                    <td className="py-2 px-4">
                                        {d?.productInfo?.images?.[0] ? (
                                            <img
                                                src={d.productInfo.images[0]}
                                                alt="Product"
                                                className="w-[45px] h-[45px] object-cover rounded"
                                            />
                                        ) : (
                                            "No Image"
                                        )}
                                    </td>
                                    <td className="py-2 px-4">{d?.productInfo?.name?.slice(0, 16)}...</td>
                                    <td className="py-2 px-4">{d?.productInfo?.category || "N/A"}</td>
                                    <td className="py-2 px-4">{d?.productInfo?.brand || "N/A"}</td>

                                    <td className="py-2 px-4 text-center">{d?.quantity || "N/A"}</td>
                                    <td className="py-2 px-4">${
                                        d?.productInfo?.discount ?
                                            (d?.productInfo?.price - (d?.productInfo?.price * d?.productInfo?.discount) / 100).toFixed(2) : d?.productInfo?.price || "N/A"}
                                    </td>

                                    <td className="py-2 px-4">
                                        <Link
                                            to={`/product/details/${encodeURIComponent(d.productInfo.slug)}/${d.productInfo._id}`}
                                            className="inline-flex items-center justify-center p-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            <FaEye />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;

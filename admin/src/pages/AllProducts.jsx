import React, { useState, useEffect } from 'react';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { GiKnightBanner } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { delete_product, getProducts, messageClear } from '../store/reducers/productReducers';
import { FadeLoader } from 'react-spinners';
import ConfirmModal from '../components/ConfirmModal';
import { action_icon, all_products, page_color } from '../color/colors';

const AllProducts = () => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({ e: null, id: null, images: [] });

  const { userInfo } = useSelector((state) => state.auth);
  const { products, loader, successMessage, errorMessage } = useSelector((state) => state.product);


  useEffect(() => {
    if (userInfo?.id) {
      dispatch(getProducts());
    }
  }, [userInfo?.id, dispatch]);


  const deleteHandler = (e, img, _id) => {
    e.preventDefault();
    dispatch(delete_product({ product_img: img, _id }));
  };


  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      dispatch(getProducts());
    }
  }, [errorMessage, successMessage, dispatch]);

  return (
    <div>
      {loader && (
        <div
          className={`w-screen h-screen flex justify-center items-center fixed left-0 top-0 ${page_color?.loader} z-[999]`}
        >
          <FadeLoader />
        </div>
      )}

      <div className="px-2 mt-2 mx-1">
        <div className={`p-4 w-full rounded-md ${page_color?.bg} min-h-screen`}>
          <div className="relative overflow-x-auto mt-5">
            <h1 className={`text-base font-bold mx-3 mb-2 ${page_color?.text_b}`}>
              Your Total Product - {products?.length}
            </h1>
            <table className="w-full text-sm text-left">
              <thead className={`text-sm uppercase border-b ${all_products?.thead_border}`}>
                <tr>
                  <th className="py-3 px-4">No</th>
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-6">Product Action</th>
                </tr>
              </thead>
              <tbody>
                {products?.length > 0 ? (
                  products.map((d, i) => (
                    <tr key={d?._id || i} className={`border-b ${all_products?.tbody_border}`}>
                      <td className="py-1 px-4">{i + 1}</td>
                      <td className="py-1 px-4">
                        {d?.images?.[0] ? (
                          <img
                            className="w-[45px] h-[45px] object-cover"
                            src={d.images[0]}
                            alt="Product"
                            loading="lazy"
                          />
                        ) : (
                          'No Image'
                        )}
                      </td>
                      <td className="py-1 px-4">{d?.name ? `${d.name.slice(0, 16)}...` : 'N/A'}</td>
                      <td className="py-1 px-4">{d?.category || 'N/A'}</td>
                      <td className="py-1 px-4">{d?.brand || 'N/A'}</td>
                      <td className="py-1 px-4">{d?.price ? `$${d.price}` : 'N/A'}</td>
                      <td className="py-1 px-4">
                        {d?.discount === 0 ? 'No Discount' : d?.discount ? `${d.discount}%` : 'N/A'}
                      </td>
                      <td className="py-1 px-4">
                        {d?.stock < 1 ? (
                          <span className={all_products?.out_stock}>Out of Stock</span>
                        ) : (
                          d?.stock || 'N/A'
                        )}
                      </td>
                      <td className="py-1 px-4">
                        <div className="flex items-center gap-4">
                          <Link
                            to={`/admin/product/edit-product/${d._id}`}
                            className={`p-[6px] ${action_icon?.edit} rounded hover:shadow-lg`}
                          >
                            <FaEdit />
                          </Link>
                          <Link
                            to={`/admin/product/details/${d._id}`}
                            className={`p-[6px] ${action_icon?.vew} rounded hover:shadow-lg`}
                          >
                            <FaEye />
                          </Link>
                          <button
                            onClick={(e) => {
                              setDeleteData({ e, id: d?._id, images: d?.images });
                              setIsModalOpen(true);
                            }}
                            className={`p-[6px] ${action_icon?.delete} rounded hover:shadow-lg`}
                          >
                            <FaTrash />
                          </button>
                          <Link
                            to={`/admin/product/add-banner/${d._id}`}
                            className={`p-[6px] ${action_icon?.banner} rounded hover:shadow-lg`}
                          >
                            <GiKnightBanner />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      No Products Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal  */}
      {isModalOpen && (
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {
            deleteHandler(deleteData.e, deleteData.images, deleteData.id);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default AllProducts;

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { AiTwotonePlusSquare, AiTwotoneMinusSquare } from 'react-icons/ai';
import { get_card_products, messageClear, quantity_dec, quantity_inc, delete_card_product } from '../store/reducers/cardReducer';
import FadeLoader from 'react-spinners/FadeLoader';
import { card_color, page_color } from '../color/colors';

const Card = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.auth);
  const { loader, card_products, successMessage, errorMessage, price, buy_product_item, shipping_fee, outofstock_products } = useSelector(state => state.card);

  const redirect = () => {
    navigate('/shipping-info', {
      state: { card_products, price, buy_product_item, shipping_fee }
    });
  };

  useEffect(() => {
    if (userInfo.id) {
      dispatch(get_card_products(userInfo.id));
    }
  }, [userInfo.id]);

  const inc = (quantity, stock, productId) => {
    const temp = quantity + 1;
    if (temp <= stock) {
      dispatch(quantity_inc({ productId, temp }));
    }
  };

  const dec = (quantity, productId) => {
    const temp = quantity - 1;
    if (temp > 0) {
      dispatch(quantity_dec({ temp, productId }));
    }
  };

  const delete_card_p = (productId) => {
    dispatch(delete_card_product(productId))
  }

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
      dispatch(messageClear())
      dispatch(get_card_products(userInfo.id));
    }
    if (errorMessage) {
      toast.error(errorMessage)
      dispatch(messageClear())
    }
  }, [errorMessage, successMessage])

  return (
    <div>
      {loader && (
        <div className={`fixed inset-0 flex justify-center items-center ${page_color?.loader} bg-opacity-40 z-50`}>
          <FadeLoader color={`${page_color?.loader_icon_color}`} />
        </div>
      )}
      <div className={`${card_color.page_bg} min-h-screen py-10 px-4 md:px-8`}>
        <div className="max-w-7xl mx-auto">
          {(card_products.length > 0 || outofstock_products.length > 0) ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Products */}
              <div className="w-full lg:w-2/3 space-y-6">
                <div className={`${card_color.card_bg} p-5 rounded-xl shadow-sm`}>
                  <h2 className={`text-lg font-semibold ${card_color.inStock_title}`}>
                    In Stock Items ({buy_product_item})
                  </h2>
                </div>

                {card_products.map((p, i) => (
                  <div key={i} className={`${card_color.card_bg} p-5 rounded-xl shadow-sm hover:shadow-md transition duration-300`}>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex gap-4 w-full md:w-8/12">
                        <img src={p.productInfo.images[0]} alt="product" className="w-[90px] h-[90px] object-cover rounded-md border" />
                        <div className={card_color.text.primary}>
                          <h2 className="text-lg font-semibold">{p.productInfo.name?.slice(0, 50)}...</h2>
                          <p className={`text-sm ${card_color.text.secondary}`}>Brand: {p.productInfo.brand}</p>
                          <Link to={`/product/details/${encodeURIComponent(p.productInfo.slug)}/${p.productInfo._id}`} className={`${card_color.text.link} text-sm`}>
                            View Details
                          </Link>
                        </div>
                      </div>

                      <div className="flex flex-col items-end w-full md:w-4/12 gap-2 mt-4 md:mt-0">
                        <div className="text-right">
                          {p.productInfo.discount > 0 && <p className={`text-sm line-through ${card_color.price.discount}`}>${p.productInfo.price}</p>}
                          <h2 className={`text-xl font-bold ${card_color.price.normal}`}>
                            ${(p.productInfo.price - ((p.productInfo.price * p.productInfo.discount) / 100)).toFixed(2)}
                          </h2>
                        </div>
                        <div className={`flex items-center gap-2 rounded-md px-3 py-1 text-lg ${card_color.qty_box}`}>
                          <div onClick={() => dec(p.quantity, p._id)} className={`cursor-pointer ${card_color.qty_hover.dec}`}>
                            <AiTwotoneMinusSquare />
                          </div>
                          <span>{p.quantity}</span>
                          <div onClick={() => inc(p.quantity, p.productInfo.stock, p._id)} className={`cursor-pointer ${card_color.qty_hover.inc}`}>
                            <AiTwotonePlusSquare />
                          </div>
                        </div>
                        <button onClick={() => dispatch(delete_card_p(p._id))} className={`mt-2 px-4 py-1 text-sm rounded-md transition ${card_color.delete_btn}`}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Out of stock products */}
                {outofstock_products.length > 0 && (
                  <div className="space-y-4">
                    <div className={`${card_color.card_bg} p-5 rounded-xl shadow-sm`}>
                      <h2 className={`text-md font-semibold ${card_color.outStock_title}`}>
                        Out of Stock ({outofstock_products.length})
                      </h2>
                    </div>

                    {outofstock_products.map((p, i) => (
                      <div key={i} className={`${card_color.card_bg} p-5 rounded-xl shadow-sm`}>
                        <div className="flex justify-between items-start flex-col md:flex-row gap-4">
                          <div className="flex gap-4 w-full md:w-8/12">
                            <img src={p.products[0].images[0]} alt="product" className="w-[90px] h-[90px] object-cover rounded-md border" />
                            <div>
                              <h2 className={`text-lg font-semibold ${card_color.text.primary}`}>{p.products[0].name?.slice(0, 50)}...</h2>
                              <p className={`text-sm ${card_color.text.secondary}`}>Brand: {p.products[0].brand}</p>
                              <Link to={`/product/details/${encodeURIComponent(p.products[0].slug)}/${p.products[0]._id}`} className={`${card_color.text.link} text-sm`}>
                                View Details
                              </Link>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 w-full md:w-4/12">
                            <div className="text-right">
                              {p.products[0].discount > 0 && <p className={`text-sm line-through ${card_color.price.discount}`}>${p.products[0].price}</p>}
                              <h2 className={`text-xl font-bold ${card_color.price.normal}`}>
                                ${p.products[0].price - ((p.products[0].price * p.products[0].discount) / 100).toFixed(2)}
                              </h2>
                            </div>
                            <div className={`flex items-center gap-2 rounded-md px-3 py-1 text-lg ${card_color.qty_box}`}>
                              <div onClick={() => dec(p.quantity, p._id)} className={`cursor-pointer ${card_color.qty_hover.dec}`}>
                                <AiTwotoneMinusSquare />
                              </div>
                              <span>{p.quantity}</span>
                              <div className={`cursor-pointer ${card_color.qty_hover.inc}`}>
                                <AiTwotonePlusSquare />
                              </div>
                            </div>
                            <button onClick={() => dispatch(delete_card_product(p._id))} className={`px-4 py-1 text-sm rounded-md transition ${card_color.delete_btn}`}>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="w-full lg:w-1/3">
                <div className={`${card_color.card_bg} p-6 rounded-xl shadow-lg space-y-4 sticky top-32`}>
                  <h2 className={`text-xl font-bold ${card_color.orderSummary.title}`}>Order Summary</h2>
                  <div className={`flex justify-between text-sm ${card_color.orderSummary.text}`}>
                    <span>Total Stores</span>
                    <span>{card_products.length}</span>
                  </div>
                  <div className={`flex justify-between text-sm ${card_color.orderSummary.text}`}>
                    <span>{buy_product_item} Item(s)</span>
                    <span>${price.toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between text-sm ${card_color.orderSummary.text}`}>
                    <span>Shipping Fee</span>
                    <span>${shipping_fee}</span>
                  </div>

                  <div className={`flex justify-between font-semibold text-lg ${card_color.orderSummary.total}`}>
                    <span>Total</span>
                    <span className={card_color.orderSummary.total_price}>
                      ${`${(price + shipping_fee).toFixed(2)}`}
                    </span>
                  </div>
                  <button
                    onClick={redirect}
                    className={`w-full py-2 rounded-md text-sm font-bold uppercase transition cursor-pointer ${card_color.orderSummary.btn}`}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className={`text-2xl mb-4 ${card_color.emptyCart.title}`}>Your cart is empty!</h2>
              <Link to="/shop" className={`px-5 py-1 rounded transition ${card_color.emptyCart.btn}`}>
                Shop Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;

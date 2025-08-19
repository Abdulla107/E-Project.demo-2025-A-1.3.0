import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Range } from 'react-range';
import { AiFillStar } from 'react-icons/ai';
import { CiStar } from 'react-icons/ci';
import { BsFillGridFill } from 'react-icons/bs';
import { FaThList } from 'react-icons/fa';
import ShopProducts from '../components/ShopProducts';
import { getProducts } from '../store/reducers/productReducer';
import { get_products, price_range_product, query_products } from '../store/reducers/homeReducer';
import Pagination from '../components/Pagination';
import { useOutletContext } from 'react-router-dom';
import { getCategorys } from '../store/reducers/categoryReducer';
import { page_color, shop_color } from '../color/colors';

const Shop = () => {
  const { products, totalProduct, priceRange, parPage } = useSelector(state => state.home);
  const { categorys } = useSelector((state) => state.category);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [filter, setFilter] = useState(false);
  const [category, setCategory] = useState('');
  const [state, setState] = useState({ values: [] });
  const [rating, setRatingQ] = useState('');
  const [styles, setStyles] = useState('grid');
  const [sortPrice, setSortPrice] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const { searchValue } = useOutletContext();

  const queryCategory = (e, value) => {
    if (e.target.checked) {
      setCategory(value);
    } else {
      setCategory('');
    }
  };

  useEffect(() => {
    dispatch(getCategorys());
  }, [userInfo?.id]);

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  useEffect(() => {
    dispatch(get_products());
  }, []);

  useEffect(() => {
    dispatch(price_range_product());
  }, []);

  // Update slider values safely when priceRange changes
  useEffect(() => {
    if (priceRange.low !== undefined && priceRange.high !== undefined) {
      const minPrice = priceRange.low ?? 0;
      const maxPrice = priceRange.high ?? 100;
      const safeMax = minPrice >= maxPrice ? minPrice + 1 : maxPrice;
      setState({ values: [minPrice, safeMax] });
    }
  }, [priceRange]);

  // Dispatch query when filters change, but only if slider values are ready
  useEffect(() => {
    if (state.values.length === 2) {
      dispatch(
        query_products({
          low: state.values[0],
          high: state.values[1],
          category,
          rating,
          sortPrice,
          pageNumber,
          searchValue
        })
      );
    }
  }, [state.values, category, rating, pageNumber, sortPrice, searchValue]);

  const resetRating = () => {
    setRatingQ('');
    dispatch(query_products({
      low: state.values[0],
      high: state.values[1],
      category,
      rating: '',
      sortPrice,
      pageNumber,
      searchValue
    }));
  };

  // Safe min/max for slider
  const minPrice = priceRange.low ?? 0;
  const maxPrice = priceRange.high ?? 100;
  const safeMax = minPrice >= maxPrice ? minPrice + 1 : maxPrice;


  // color-------------
  const pr = shop_color?.range_color || '';
  const r_color = shop_color?.rating_color || '';
  const p_section = shop_color?.product_section || '';
  const btn = shop_color?.product_section.btn || '';

  return (
    <section className={`py-16 max-md:py-5 ${page_color?.bg} min-h-screen rounded-md`}>
      <div className='w-[90%] mx-auto'>

        {/* Filter Toggle Button (Mobile) */}
        <div className='block md:hidden mb-6'>
          <button
            onClick={() => setFilter(!filter)}
            className={`w-full py-2 px-4 cursor-pointer ${shop_color?.filter_btn}`}
          >
            {filter ? 'Hide Filter' : 'Show Filter'}
          </button>
        </div>

        <div className='w-full flex flex-wrap'>

          {/* Filter Sidebar */}
          <div
            className={`
              ${filter ? 'block' : 'hidden'} 
              md:block 
              w-full md:w-4/12 lg:w-3/12 
              md:pr-8 
              mb-6 md:mb-0
            `}
          >
            {/* Category Filter */}
            <h2 className={`text-xl font-bold mb-3 ${shop_color?.text}`}>Category</h2>
            <div className='py-2'>
              {categorys.map((c, i) => (
                <div className='flex items-center gap-2 py-1' key={c.id ?? i}>
                  <input
                    checked={category === c.name}
                    onChange={(e) => queryCategory(e, c.name)}
                    type="checkbox"
                    id={c.name}
                  />
                  <label className={`${shop_color?.text} cursor-pointer`} htmlFor={c.name}>
                    {c.name}
                  </label>
                </div>
              ))}
            </div>

            {/* Price Filter */}
            <div className="py-6 flex flex-col gap-5">
              <h2 className={`text-xl font-bold mb-3 ${`text-xl font-bold mb-3 ${shop_color?.text}`}`}>Price</h2>
              {/* Only render Range if slider values are ready */}
              {state?.values?.length === 2 && (
                <Range
                  step={1}
                  min={minPrice}
                  max={safeMax}
                  values={state.values}
                  onChange={(values) => setState({ values })}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className={`w-[85%] h-[6px] ${pr.bg1} rounded-full mx-2 cursor-pointer`}
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }, index) => (
                    <div
                      {...props}
                      className={`w-[15px] h-[15px] ${pr.bg2} rounded-full`}
                      key={index}
                    />
                  )}
                />
              )}
              <div>
                <span className={`font-bold text-lg ${pr.price_color}`}>
                  ${Math.floor(state.values[0] ?? 0)} - ${Math.floor(state.values[1] ?? 0)}
                </span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className='py-3 flex flex-col gap-4'>
              <h2 className={`text-xl font-bold mb-3 ${r_color.text}`}>Rating</h2>
              <div className='flex flex-col gap-3'>
                {[5, 4, 3, 2, 1].map((r) => (
                  <div
                    key={r}
                    onClick={() => setRatingQ(r)}
                    className={`flex gap-2 text-xl cursor-pointer ${rating === r ? `${r_color.rating_tru}` : `${r_color.rating_fal}`}`}
                  >
                    {[...Array(5)].map((_, i) =>
                      i < r ? <AiFillStar key={i} /> : <CiStar key={i} />
                    )}
                  </div>
                ))}
                <div
                  onClick={resetRating}
                  className={`flex gap-2 text-xl cursor-pointer ${r_color.rating_gero}`}
                >
                  {[...Array(5)].map((_, i) => (
                    <CiStar key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Section */}
          <div className='w-full md:w-8/12 lg:w-9/12'>
            {/* Sort & Style Switcher */}
            <div className={`w-full py-3 mb-10 px-3 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center border ${p_section.border} max-md:hidden`}>
              <h2 className={`text-lg font-medium  mb-2 md:mb-0 ${p_section.text}`}>
                {products.length} Products
              </h2>
              <div className='flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto'>
                <select
                  onChange={(e) => setSortPrice(e.target.value)}
                  className={`p-2 border ${p_section.border} outline-0 ${p_section.text} font-semibold w-full md:w-auto rounded-md`}
                >
                  <option value="">Sort By</option>
                  <option value="low-to-high">Low to High Price</option>
                  <option value="high-to-low">High to Low Price</option>
                </select>

                <div className='flex justify-center items-start gap-2'>
                  <div
                    onClick={() => setStyles('grid')}
                    className={`p-2 ${styles === 'grid' && `${btn.btn_tru}`} ${btn.main_color} cursor-pointer rounded-sm`}
                  >
                    <BsFillGridFill />
                  </div>
                  <div
                    onClick={() => setStyles('list')}
                    className={`p-2 ${styles === 'list' && `${btn.btn_tru}`} ${btn.main_color} cursor-pointer rounded-sm`}
                  >
                    <FaThList />
                  </div>
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className='text-center text-lg py-10'>
              <ShopProducts products={products} styles={styles} />
            </div>
            <div>
              {totalProduct > parPage && (
                <Pagination
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  totalItem={totalProduct}
                  parPage={parPage}
                  showItem={Math.floor(totalProduct / parPage)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shop;

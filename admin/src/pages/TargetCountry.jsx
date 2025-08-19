import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select, { components } from 'react-select';
import countries from 'world-countries';
import { add_target_country, delete_target_country, get_target_country, messageClear } from '../store/reducers/authReducer';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa6';
import { action_icon, page_color, target_country } from '../color/colors';


// Get flag image using 2-letter code
const getFlagUrl = (code) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

// Create country options with flag & code
const countryOptions = countries.map((country) => ({
  label: country.name.common,
  value: country.cca2,
  code: country.cca2,
}));

// Custom Option with flag
const CustomOption = (props) => {
  const { data, innerRef, innerProps } = props;
  return (
    <div
      ref={innerRef}
      {...innerProps}
      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
    >
      <img
        src={getFlagUrl(data.code)}
        alt={data.label}
        className="w-5 h-4 object-cover rounded-sm"
      />
      <span className="text-sm text-gray-800">{data.label}</span>
    </div>
  );
};

// Custom single value with flag
const CustomSingleValue = ({ data, ...props }) => (
  <components.SingleValue {...props}>
    <div className="flex items-center gap-2">
      {data.code &&
        <img
          src={getFlagUrl(data.code)}
          alt={data.label}
          className="w-5 h-4 object-cover rounded-sm"
        />
      }
      <span className="text-sm">{data.label || 'Select Country...'}</span>
    </div>
  </components.SingleValue>
);




const TargetCountry = () => {

  const dispatch = useDispatch();
  const [selectedCountry, setSelectedCountry] = useState({ label: '', value: '', code: '' });
  const { targetCountry, errorMessage, successMessage, loader } = useSelector(state => state.auth)

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(add_target_country(selectedCountry))

  }

  const isFormValid = () => {
    const { label, value, code } = selectedCountry;
    return label && value && code
  }

  const deleteHandler = (e, id) => {
    e.preventDefault();
    dispatch(delete_target_country(id))
  }

  useEffect(() => {
    dispatch(get_target_country())
  }, [])

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
      dispatch(messageClear())
      setSelectedCountry({ label: '', value: '', code: '' });
      dispatch(get_target_country());

    } else if (errorMessage) {
      toast.error(errorMessage)
      dispatch(messageClear())

    }
  })

  const color = target_country || '';


  return (
    <div className="md:px-4 py-2">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* add country  */}
          <div className={`w-full mix-h p-5  rounded-lg shadow-sm ${page_color?.bg}`}>
            <h2 className={`text-lg font-bold mb-3 ${color.text}`}> Add Target Country </h2>
            <p className={`text-sm mb-5 ${color.text}`}>
              <strong> Allowed Delivery Country Guidelines</strong><br /><br />
              you can specify a country from which customers are allowed to place orders. Only customers from this selected country will be permitted to purchase the product. Customers from other countries will not be able to proceed with the order.<br/><br/>

              <u>Summary :</u><br />
              • Only customers from the specified country can place orders.<br />
        
            </p>
            <form onSubmit={submitHandler}>
              <div className="flex flex-col md:flex-row gap-5">
                {/* Country with flag select */}
                <div className="flex flex-col w-full">
                  <label htmlFor="country" className={`text-sm font-medium  mb-1 ${color.select_color}`}>
                    Country
                  </label>
                  <Select
                    id="country"
                    options={countryOptions}
                    value={selectedCountry}
                    onChange={setSelectedCountry}
                    // placeholder="Select country..."
                    isSearchable
                    className="text-sm"
                    components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '40px',
                        fontSize: '14px',
                        borderRadius: '6px',
                      }),
                      menu: (base) => ({
                        ...base,
                        overflowY: 'auto',
                        zIndex: 100,
                      }),
                      option: (base) => ({
                        ...base,
                        padding: '6px 12px',
                      }),
                      input: (base) => ({
                        ...base,
                        margin: 0,
                        padding: 0,
                      }),
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button disabled={!isFormValid() || loader} className={` my-3 px-4 py-1 rounded-md ${!isFormValid() || loader ? `${color.btn.btn_disabled} cursor-not-allowed` : `border transition-all ${color.btn.btn_tru} focus:ring-offset-2 cursor-pointer`}`}>
                  Submit
                </button>
              </div>
            </form>
          </div>
          {/* Target country name */}
          <div className={`w-full p-5 ${page_color?.bg} rounded-lg shadow-sm`}>
            <h2 className={`text-lg font-bold mb-3 ${color.text}`}>Target Country - {targetCountry?.length || 0}</h2>
            <div className=' relative overflow-auto max-h-[440px]'>
              <table className='w-full text-sm text-left'>
                <thead className={`text-sm uppercase border-b ${color.thead_color} whitespace-nowrap`}>
                  <tr>
                    <th scope='col' className='px-4 py-3 text-nowrap'>NO</th>
                    <th scope='col' className='px-4 py-3 text-nowrap'>Target Country</th>
                    <th scope='col' className='px-4 p-3 text-nowrap text-center'>Action</th>
                  </tr>
                </thead>
                <tbody className={`${color.tbody.bg}`}>
                  {targetCountry?.length > 0 ? (
                    targetCountry.map((d, i) => <tr key={i} className={`border-b ${color.tbody.tr}`}>
                      <td scope='row' className='px-4 py-3 text-nowrap '>{i + 1}</td>
                      <td scope='row' className='px-4 py-3 text-nowrap'>
                        <div className="flex items-center gap-2">
                          <img
                            src={getFlagUrl(d.code)}
                            alt={d.value}
                            className="w-5 h-4 object-cover rounded-sm"
                          />
                          <span className="text-sm">{d.label}</span>
                        </div>
                      </td>
                      <td scope='row' className='px-4 py-3 text-nowrap text-center'>
                        <div className='flex gap-4 justify-center'>
                          <span onClick={(e) => deleteHandler(e, d._id)} className={`p-[6px] rounded-md cursor-pointer ${action_icon?.delete}`}>
                            <FaTrash />
                          </span>
                        </div>
                      </td>
                    </tr>)) : (<tr>
                      <td colSpan="9" className="text-center py-4">
                        No Country Found!. Place Add Country.
                      </td>
                    </tr>)}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetCountry;

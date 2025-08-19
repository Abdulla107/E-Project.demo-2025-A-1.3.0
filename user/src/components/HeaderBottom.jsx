import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { header_color } from '../color/colors'

const HeaderBottom = () => {
  
  const { pathname } = useLocation()

  const color = header_color?.profile_color?.header_bottom || '';

  return (
    <div className=' container flex justify-center items-center overflow-x-auto px-8'>
      <div className='font-semibold uppercase py-1 text-center '>
        <div className="flex flex-wrap justify-center items-center w-full"> 
          <ul className="flex justify-start items-start gap-8 max-sm:gap-3 text-sm font-bold uppercase">
            <li>
              <Link to={'/'} className={`p-2 block ${pathname === '/' ? `${color.action_tr}` : ''}`}>Home</Link>
            </li>
            <li>
              <Link to={'/shop'} className={`p-2 block ${pathname === '/shop' ? `${color.action_tr}` : ''}`}>Shop</Link>
            </li>
          </ul>
    </div>
      </div>
    </div>
  )
}

export default HeaderBottom

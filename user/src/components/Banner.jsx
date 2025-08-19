import React, { useEffect, useState } from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { home_color } from '../color/colors';

const Banner = () => {
    const { banners } = useSelector(state => state.product)
        const [arrowShow, setArrowShow] = useState(window.innerWidth > 1024);

    useEffect(() => {
        const handleResize = () => {
            setArrowShow(window.innerWidth > 1024);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [])


    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 1
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    }


    return (
        <div className='w-full max-lg::mt-6'>
            <div className='w-[100%] lg:w-[90%] mx-auto'>
                <div className='w-full flex flex-wrap max-[991px]:gap-8'>
                    <div className='w-full px-5'>
                        <div className='my-8 relative z-40'>
                            <Carousel
                                autoPlay={true}
                                infinite={true}
                                arrows={arrowShow}
                                showDots={true}
                                responsive={responsive}
                            >
                                {
                                    banners?.map((b, i) => (
                                        <Link className={`h-auto w-full border-2 ${home_color?.banner_border} block`} key={i} to={`/product/details/${encodeURIComponent(b.slug)}/${b.productId}`} >
                                            <img className='w-full h-full' src={b.image} alt="" />
                                        </Link>
                                    ))
                                }
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner

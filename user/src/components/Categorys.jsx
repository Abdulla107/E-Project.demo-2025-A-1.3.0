import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { getCategorys } from "../store/reducers/categoryReducer";
import { home_color } from "../color/colors";

const Categorys = () => {
    const dispatch = useDispatch()
    const { userInfo } = useSelector((state) => state.auth);
    const { categorys } = useSelector(state => state.category)
    const [arrowShow, setArrowShow] = useState(window.innerWidth > 1024);

    useEffect(() => {
        const handleResize = () => {
            setArrowShow(window.innerWidth > 1024);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [])


    useEffect(() => {
        dispatch(getCategorys());
    }, [userInfo?.id]);


    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 6
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 7
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 6
        },
        mdtablet: {
            breakpoint: { max: 991, min: 464 },
            items: 5
        },
        mobile: {
            breakpoint: { max: 768, min: 0 },
            items: 4
        },
        smmobile: {
            breakpoint: { max: 640, min: 0 },
            items: 3
        },
        xsmobile: {
            breakpoint: { max: 440, min: 0 },
            items: 3
        }
    }

    const color = home_color?.category_color || ''
    
    return (
        <div className="my-4">
            <div className='w-[87%] mx-auto relative z-40'>
                <Carousel
                    autoPlay={false}
                    infinite={false}
                    arrows={arrowShow}
                    responsive={responsive}
                    transitionDuration={500}
                >
                    {
                        categorys.map((c, i) => <div className='h-[100px] block' key={i}>
                            <div className={`h-full relative border-2 mx-1 ${color.border}`}>
                                <img src={c.image} alt="image" className=" h-full w-full object-fill" />
                                <div className='absolute bottom-6 w-full mx-auto font-bold left-0 flex justify-center items-center'>
                                    <span className={`py-[2px] px-2 ${color.name_bg} ${color.text}`}>{c.name?.slice(0, 8)}</span>
                                </div>
                            </div>
                        </div>)
                    }
                </Carousel>
            </div>
        </div>
    );
};

export default Categorys;

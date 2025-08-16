import React from 'react'
import Slider from 'react-slick'
import ava01 from '../assets/images/ava-1.jpg'
import ava02 from '../assets/images/ava-2.jpg'
import ava03 from '../assets/images/ava-3.jpg'
import pic1 from "../assets/images/female-tourist-with-camera-balcony_23-2147981883.jpg"
const Testimonials = () => {

    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        speed: 2000,
        swipeToSlide: true,
        autoplaySpeed: 2000,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: false
                }
            }
        ]
    }

    return (
        <div className="testimonials-container px-2 md:px-4">
            <Slider {...settings}>
                <div className="testimonial py-4 px-3 mx-2 md:mx-1">
                    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 h-full">
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                            Planning our dream getaway was a breeze, thanks to TripToIndia's website!
                            It wasn't just a trip; it was an unforgettable odyssey.
                            From the comprehensive guidance on the Dodecanese Greek Islands
                            to the seamless booking process, every click felt like a step
                            closer to paradise.
                        </p>

                        <div className="flex items-center gap-3 md:gap-4 mt-3">
                            <img src={ava01} className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-full border border-gray-300 flex-shrink-0" alt="" />
                            <div>
                                <h6 className='text-sm md:text-base font-semibold text-gray-800 mb-0'>Rahul Gupta</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="testimonial py-4 px-3 mx-2 md:mx-1">
                    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 h-full">
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                            Our dream getaway planning became a delight, all thanks to TripToIndia's
                            website! It evolved into an unforgettable
                            odyssey. The comprehensive insights into the Mumbai's beach and the effortless booking process made
                            us feel like we were inching
                            closer to paradise with every click.
                        </p>

                        <div className="flex items-center gap-3 md:gap-4 mt-3">
                            <img src={ava02} className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-full border border-gray-300 flex-shrink-0" alt="" />
                            <div>
                                <h6 className='text-sm md:text-base font-semibold text-gray-800 mb-0'>Priya Mishra</h6>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="testimonial py-4 px-3 mx-2 md:mx-1">
                    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 h-full">
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                            Planning our dream getaway was a breeze, thanks to TripToIndia's website!
                            It wasn't just a trip; it was an unforgettable odyssey.
                            From the comprehensive guidance on the Dodecanese Greek Islands
                            to the seamless booking process, every click felt like a step
                            closer to paradise.
                        </p>

                        <div className="flex items-center gap-3 md:gap-4 mt-3">
                            <img src={ava03} className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-full border border-gray-300 flex-shrink-0" alt="" />
                            <div>
                                <h6 className='text-sm md:text-base font-semibold text-gray-800 mb-0'>Aryan Sharma</h6>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="testimonial py-4 px-3 mx-2 md:mx-1">
                    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 h-full">
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                            Our dream getaway planning became a delight, all thanks to TripToIndia's
                            website! It evolved into an unforgettable
                            odyssey. The comprehensive insights into the Mumbai's beach and the effortless booking process made
                            us feel like we were inching
                            closer to paradise with every click.
                        </p>

                        <div className="flex items-center gap-3 md:gap-4 mt-3">
                            <img src={pic1} className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-full border border-gray-300 flex-shrink-0" alt="" />
                            <div>
                                <h6 className='text-sm md:text-base font-semibold text-gray-800 mb-0'>Pooja Bhat</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </Slider>
        </div>
    )
}

export default Testimonials





'use client';

import Slider from 'react-slick';
import { FaStar } from 'react-icons/fa';
import { testimonials, Testimonial } from '@/constants/testimonials';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const TestimonialSlider = () => {
	const sliderSettings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	};

	return (
		<Slider
			{...sliderSettings}
			className='testimonial-slider'>
			{testimonials.map((testimonial: Testimonial, index: number) => (
				<div
					key={index}
					className='px-4 h-full'>
					<div className='bg-slate-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full'>
						<div className='flex text-yellow-400 mb-5 text-xl'>
							{[...Array(5)].map((_, i) => (
								<FaStar key={i} />
							))}
						</div>
						<p className='text-gray-700 mb-6 italic flex-grow'>
							&quot;{testimonial.quote}&quot;
						</p>
						<div className='flex items-center mt-auto pt-4 border-t border-slate-200'>
							<div
								className={`w-12 h-12 ${
									testimonial.bgColorClass
								} rounded-full flex items-center justify-center mr-4 ring-2 ring-opacity-50 ${testimonial.bgColorClass.replace(
									'bg-',
									'ring-',
								)}`}>
								<span
									className={`font-bold text-lg ${testimonial.textColorClass}`}>
									{testimonial.initials}
								</span>
							</div>
							<div>
								<p className='font-semibold text-slate-900'>
									{testimonial.name}
								</p>
								<p className='text-sm text-gray-600'>{testimonial.major}</p>
							</div>
						</div>
					</div>
				</div>
			))}
		</Slider>
	);
};

export default TestimonialSlider;

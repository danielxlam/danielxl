
import React, { useState, useEffect, useRef } from 'react';

// Function to get a seed based on the current date, so images change daily.
const getDailySeed = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
};

const dailySeed = getDailySeed();

const exampleImages = [
  {
    before: `https://picsum.photos/seed/${dailySeed}_person_bw/600/600?grayscale`,
    after: `https://picsum.photos/seed/${dailySeed}_person_bw/600/600`,
    description: '黑白照片上色',
    prompt: 'Professional coloring for black and white photos...',
  },
  {
    before: `https://picsum.photos/seed/${dailySeed}_old_photo/600/600?grayscale&blur=1`,
    after: `https://picsum.photos/seed/${dailySeed}_old_photo/600/600`,
    description: '老照片修复',
    prompt: 'Old photo restoration, repair scratches, creases, fading, and mold spots...',
  },
  {
    before: `https://picsum.photos/seed/${dailySeed}_hairstyle1/600/600`,
    after: `https://picsum.photos/seed/${dailySeed}_hairstyle2/600/600`,
    description: '为人物更换发型',
    prompt: 'Design a new hairstyle for the person in the picture...',
  },
  {
    before: `https://picsum.photos/seed/${dailySeed}_person_to_3d/600/600`,
    after: `https://picsum.photos/seed/${dailySeed}_3d_model/600/600`,
    description: '图片转3D立体卡通',
    prompt: 'Fully retain the color and outline shape of the original image\'s main subject...',
  },
];

const ArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ArrowRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);


export const ExampleCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(
            () =>
                setCurrentIndex((prevIndex) =>
                    prevIndex === exampleImages.length - 1 ? 0 : prevIndex + 1
                ),
            5000 // Change slide every 5 seconds
        );

        return () => {
            resetTimeout();
        };
    }, [currentIndex]);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? exampleImages.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === exampleImages.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 relative group">
             <h2 className="text-xl font-bold text-center text-text-primary mb-4">应用示例</h2>
            <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-base-200">
                <div className="whitespace-nowrap transition-transform duration-500 ease-in-out" style={{ transform: `translateX(${-currentIndex * 100}%)` }}>
                    {exampleImages.map((example, index) => (
                        <div key={index} className="inline-block w-full h-full align-top">
                            <div className="flex flex-col md:flex-row gap-4 p-4 h-full">
                                <div className="w-full md:w-1/2 h-full flex flex-col items-center">
                                    <h3 className="text-md text-text-secondary mb-2">原始图片</h3>
                                    <img src={example.before} alt="Before" className="w-full h-full object-contain rounded-md" />
                                </div>
                                <div className="w-full md:w-1/2 h-full flex flex-col items-center">
                                    <h3 className="text-md text-text-secondary mb-2">编辑后</h3>
                                    <img src={example.after} alt="After" className="w-full h-full object-contain rounded-md" />
                                </div>
                            </div>
                             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center w-full px-4">
                                <p className="text-lg font-semibold text-white bg-black/50 rounded-md px-3 py-1 inline-block">{example.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <button onClick={goToPrevious} className="absolute top-1/2 -translate-y-1/2 left-2 p-2 bg-black/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowLeft />
            </button>
            <button onClick={goToNext} className="absolute top-1/2 -translate-y-1/2 right-2 p-2 bg-black/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight />
            </button>

            {/* Dots */}
            <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 flex justify-center py-2 space-x-2">
                {exampleImages.map((_, slideIndex) => (
                    <div
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${currentIndex === slideIndex ? 'bg-brand-primary' : 'bg-base-300'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

import React, { useState, useEffect, useCallback } from 'react';

const videos = [
  { id: 'dQw4w9WgXcQ', title: 'FreePods Pro Review' },
  { id: '3tmd-ClpJxA', title: 'Powerank 20K Durability Test' },
  { id: 'V_jK_6zT4Ao', title: 'A Day with WatchFit 2' },
  { id: 'u_p2t1-_i4s', title: 'Unboxing the BoomBass Speaker' },
];

export const BrandGallery: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextVideo = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % videos.length);
    }, []);

    useEffect(() => {
        const videoInterval = setInterval(nextVideo, 7000);
        return () => clearInterval(videoInterval);
    }, [nextVideo]);

    const goToVideo = (index: number) => {
        setCurrentIndex(index);
    }
    
    return (
        <section className="bg-gray-800 py-16 animate-fade-in">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Brand Gallery</h2>
                 <div className="relative aspect-video max-w-4xl mx-auto overflow-hidden rounded-lg shadow-2xl">
                    <div 
                        className="flex transition-transform duration-500 ease-in-out h-full"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                         {videos.map(video => (
                            <div key={video.id} className="w-full flex-shrink-0 h-full">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${video.id}?autoplay=0&mute=1&controls=1&loop=1&playlist=${video.id}`}
                                    title={video.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ))}
                    </div>
                 </div>
                 <div className="flex justify-center mt-4 space-x-2">
                    {videos.map((_, index) => (
                        <button key={index} onClick={() => goToVideo(index)} className={`w-12 h-2 rounded-full transition-colors ${currentIndex === index ? 'bg-green-500' : 'bg-gray-600 hover:bg-gray-500'}`}></button>
                    ))}
                 </div>
            </div>
        </section>
    );
};
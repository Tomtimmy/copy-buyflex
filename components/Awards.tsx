import React from 'react';
import { TrophyIcon } from './icons/TrophyIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

const AwardItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="text-center p-4">
        <div className="flex justify-center items-center mb-4 text-green-400">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
);

export const Awards: React.FC = () => {
  return (
    <section className="animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Awards & Certifications</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 bg-gray-800 rounded-lg p-8">
          <AwardItem 
            icon={<TrophyIcon className="w-12 h-12" />} 
            title="Tech Innovator 2023"
            description="Awarded for excellence in consumer electronics design."
          />
          <AwardItem 
            icon={<ShieldCheckIcon className="w-12 h-12" />} 
            title="Certified Quality"
            description="All products pass rigorous ISO 9001 quality assurance tests."
          />
          <AwardItem 
            icon={<TrophyIcon className="w-12 h-12" />} 
            title="Eco-Friendly Brand"
            description="Recognized for our commitment to sustainable packaging."
          />
        </div>
      </div>
    </section>
  );
};
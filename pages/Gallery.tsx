
import React from 'react';
import { GalleryImage } from '../types';

const Gallery: React.FC<{ gallery: GalleryImage[] }> = ({ gallery }) => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Our Facilities</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Take a visual tour of Goodlife Fitness. Designed for performance, built for community.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((img) => (
            <div key={img.id} className="group relative rounded-2xl overflow-hidden shadow-md aspect-[4/3]">
              <img 
                src={img.url} 
                alt={img.caption} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-medium">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;

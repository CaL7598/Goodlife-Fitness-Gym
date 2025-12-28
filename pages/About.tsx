
import React from 'react';
import { ShieldCheck, Target, Users2 } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">Our Story</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Founded in 2018, Goodlife Fitness began with a single mission: to provide a high-quality fitness experience that is accessible to everyone. We believed that a gym shouldn't just be a place to sweat, but a sanctuary for mental and physical growth.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Today, we serve over 2,000 members with state-of-the-art facilities across three locations. Our team of certified professionals is dedicated to maintaining an environment where every member feels supported, motivated, and empowered.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl rotate-2">
            <img src="https://picsum.photos/800/600?random=about" alt="Gym Team" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-slate-50 p-10 rounded-3xl text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <ShieldCheck className="text-rose-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Our Mission</h3>
            <p className="text-slate-500 text-sm leading-relaxed">To inspire health and wellness through professional guidance and premium facilities.</p>
          </div>
          <div className="bg-slate-50 p-10 rounded-3xl text-center">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Target className="text-rose-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Our Vision</h3>
            <p className="text-slate-500 text-sm leading-relaxed">To be the leading fitness community known for transforming lives and fostering strength.</p>
          </div>
          <div className="bg-slate-50 p-10 rounded-3xl text-center">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Users2 className="text-rose-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Our Community</h3>
            <p className="text-slate-500 text-sm leading-relaxed">A diverse family of individuals striving together towards their personal best.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

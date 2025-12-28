
import React from 'react';
import { ArrowRight, CheckCircle, Clock, MapPin, Zap } from 'lucide-react';

const PublicHome: React.FC<{ setCurrentPage: (p: string) => void }> = ({ setCurrentPage }) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src="https://picsum.photos/1920/1080?grayscale&random=hero" 
            alt="Gym Atmosphere" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-rose-600 text-xs font-bold uppercase tracking-widest mb-4">Goodlife Fitness</span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              REDEFINE YOUR <span className="text-rose-500">STRENGTH</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
              Join the most supportive fitness community in town. Premium equipment, expert training, and results that speak for themselves.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setCurrentPage('plans')}
                className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
              >
                Join Now Today
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => setCurrentPage('about')}
                className="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold rounded-lg transition-all"
              >
                Explore Facilities
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Goodlife?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We provide everything you need to reach your fitness goals, from beginner to elite levels.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Modern Equipment</h3>
              <p className="text-slate-600 leading-relaxed">Top-of-the-line cardio, strength, and functional equipment to optimize your training sessions.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">24/7 Access</h3>
              <p className="text-slate-600 leading-relaxed">Your schedule, your workout. Our flexible hours ensure you never miss a beat.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Coaching</h3>
              <p className="text-slate-600 leading-relaxed">Our certified trainers are dedicated to helping you master form and maximize results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-rose-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-rose-100 mb-10">Sign up for a membership today and get your first week of personal training for free!</p>
          <button 
            onClick={() => setCurrentPage('plans')}
            className="px-10 py-4 bg-white text-rose-600 font-extrabold rounded-full hover:bg-slate-100 transition-colors shadow-xl"
          >
            SEE MEMBERSHIP PLANS
          </button>
        </div>
      </section>
    </div>
  );
};

export default PublicHome;

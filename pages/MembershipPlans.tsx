
import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

const MembershipPlans: React.FC = () => {
  const plans = [
    {
      name: 'Basic',
      price: '150',
      period: 'Month',
      features: ['Access during peak hours', 'Basic weight room access', '1 Fitness assessment', 'Locker access'],
      color: 'slate',
      recommended: false
    },
    {
      name: 'Premium',
      price: '300',
      period: 'Month',
      features: ['24/7 Full Access', 'All group classes included', 'Pool & Sauna access', 'Monthly PT session', 'Guest passes'],
      color: 'rose',
      recommended: true
    },
    {
      name: 'VIP',
      price: '1,500',
      period: '6 Months',
      features: ['Full Premium benefits', 'Private locker & laundry', 'Nutritional planning', 'Unlimited PT sessions', 'Complimentary supplements'],
      color: 'slate',
      recommended: false
    }
  ];

  return (
    <div className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Choose Your Plan</h2>
          <p className="text-slate-600">Flexible options tailored to your fitness lifestyle.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col ${
                plan.recommended ? 'border-2 border-rose-500 scale-105 z-10' : 'border border-slate-200'
              }`}
            >
              {plan.recommended && (
                <div className="bg-rose-500 text-white text-xs font-bold uppercase tracking-widest text-center py-1">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">₵{plan.price}</span>
                  <span className="text-slate-500 ml-1">/{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-slate-600 text-sm">
                      <Check className="text-rose-500 shrink-0" size={18} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 mt-auto border-t border-slate-100 bg-slate-50">
                <button className={`w-full py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${
                  plan.recommended 
                    ? 'bg-rose-600 text-white hover:bg-rose-700' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}>
                  Select {plan.name}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center text-slate-500 text-sm">
          * Corporate discounts available for teams of 5 or more. Contact us for details.
        </div>
      </div>
    </div>
  );
};

export default MembershipPlans;

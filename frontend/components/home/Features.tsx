import { Lock, CheckCircle2, Globe, LineChart, ShieldAlert, Code2 } from 'lucide-react';

const features = [
  {
    title: 'Immutable Security',
    description: 'Documents stored on blockchain cannot be altered, ensuring complete integrity and authenticity of all verified credentials.',
    icon: Lock,
  },
  {
    title: 'Instant Verification',
    description: 'Verify any document in seconds with our real-time blockchain verification system. No more waiting days for credential confirmation.',
    icon: CheckCircle2,
  },
  {
    title: 'Global Accessibility',
    description: 'Access and verify documents from anywhere in the world, 24/7. Our platform works across all devices and browsers.',
    icon: Globe,
  },
  {
    title: 'Analytics Dashboard',
    description: 'Track verification requests, monitor usage patterns, and generate detailed reports with our comprehensive analytics.',
    icon: LineChart,
  },
  {
    title: 'Fraud Prevention',
    description: 'Eliminate document fraud with our AI-powered verification system that detects and prevents counterfeit credentials.',
    icon: ShieldAlert,
  },
  {
    title: 'API Integration',
    description: 'Seamlessly integrate with existing systems using our robust RESTful API and comprehensive developer documentation.',
    icon: Code2,
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#141B34] tracking-tight mb-4">
            Enterprise-Grade Infrastructure
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to secure, issue, and instantly verify critical documents at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-10 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_-4px_rgba(0,0,0,0.1)] group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-[#5236FF] mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-[#141B34] mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}

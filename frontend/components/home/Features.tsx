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
    <section className="py-24 bg-[#0A0A0A] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight mb-4">
            Enterprise-Grade Infrastructure
          </h2>
          <p className="text-lg text-gray-400 font-light">
            Everything you need to secure, issue, and instantly verify critical documents at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="transition-all duration-300 hover:-translate-y-1 group h-full">
              <div 
                className="bg-[#111111] rounded-2xl p-8 text-left border border-white/10 h-full relative overflow-hidden hover:border-white/20 transition-colors shadow-lg"
              >
                {/* Subtle hover glow effect */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-[#5236FF]/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-gray-300 mb-6 group-hover:text-white transition-colors">
                  <feature.icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm font-light">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

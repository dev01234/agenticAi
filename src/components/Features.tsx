import React from 'react';
import { Zap, Shield, Palette, Code, Rocket, Users } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built with Vite for instant hot reload and optimized production builds.',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    icon: Shield,
    title: 'Type Safe',
    description: 'Full TypeScript support with intelligent autocomplete and error detection.',
    color: 'from-blue-400 to-blue-600'
  },
  {
    icon: Palette,
    title: 'Beautiful Design',
    description: 'Modern UI components with Tailwind CSS and smooth animations.',
    color: 'from-purple-400 to-pink-500'
  },
  {
    icon: Code,
    title: 'Developer Experience',
    description: 'Optimized tooling and hot module replacement for productive development.',
    color: 'from-green-400 to-teal-500'
  },
  {
    icon: Rocket,
    title: 'Production Ready',
    description: 'Optimized builds, code splitting, and performance monitoring out of the box.',
    color: 'from-red-400 to-red-600'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Backed by a thriving community and extensive ecosystem of plugins.',
    color: 'from-indigo-400 to-purple-600'
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to build{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              amazing apps
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features and tools that make development faster, safer, and more enjoyable.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group hover:border-gray-200"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
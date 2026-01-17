'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export default function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="group relative"
    >
      {/* Glassmorphic Card */}
      <div className="relative h-full p-8 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 hover:border-violet-500/50 transition-all duration-300 overflow-hidden">
        {/* Glow Effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-violet-600/0 group-hover:from-cyan-500/10 group-hover:to-violet-600/10 transition-all duration-500" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-7 h-7 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>

          {/* Description */}
          <p className="text-slate-400 leading-relaxed">{description}</p>
        </div>

        {/* Corner Accent */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-violet-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      </div>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Bot, Zap, Shield, Clock, TrendingUp, Sparkles } from 'lucide-react';
import FeatureCard from './FeatureCard';

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Summaries',
    description: 'GPT-4o-mini analyzes your emails and creates concise, actionable summaries delivered instantly to Telegram.',
  },
  {
    icon: Zap,
    title: 'Instant Replies',
    description: 'Reply to emails directly from Telegram. AI assists with drafting professional responses in seconds.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'End-to-end encryption with OAuth 2.0. Your data is never stored or shared. Full GDPR compliance.',
  },
  {
    icon: Clock,
    title: 'Real-Time Sync',
    description: 'Get notified the moment important emails arrive. Never miss critical messages again.',
  },
  {
    icon: TrendingUp,
    title: 'Smart Filtering',
    description: 'AI learns your preferences and prioritizes emails that matter. Say goodbye to notification fatigue.',
  },
  {
    icon: Sparkles,
    title: 'Context Awareness',
    description: 'MailSync understands email threads and provides context-aware summaries with key action items.',
  },
];

export default function Features() {
  return (
    <section className="relative py-24 px-6 bg-slate-950">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">Powerful Features</span>
          </motion.div>

          <h2 className="text-5xl font-bold text-white mb-4">
            Everything You Need to
            <br />
            <span className="bg-clip-text text-transparent bg-glow-gradient">
              Master Your Inbox
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            MailSync combines cutting-edge AI with seamless integration to transform how you handle emails.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={idx * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

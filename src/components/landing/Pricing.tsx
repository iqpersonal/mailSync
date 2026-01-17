'use client';

import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';

const TELEGRAM_BOT_URL = 'https://t.me/Maisync_bot';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for trying out MailSync',
    features: [
      '50 emails per month',
      'AI summaries',
      'Telegram integration',
      'Basic support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For power users and professionals',
    features: [
      '1,000 emails per month',
      'Advanced AI summaries',
      'Priority Telegram delivery',
      'Email reply assistance',
      'Priority support',
      'Custom filters',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For teams and organizations',
    features: [
      'Unlimited emails',
      'Team management',
      'Custom AI models',
      'Dedicated support',
      'SLA guarantee',
      'Advanced analytics',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 px-6 overflow-hidden bg-slate-950">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-slate-400">
            Choose the plan that fits your needs
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`relative ${plan.popular ? 'md:-mt-4' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-semibold">
                    <Zap className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Card */}
              <div
                className={`relative h-full p-8 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
                  plan.popular
                    ? 'bg-slate-900/90 border-violet-500 shadow-2xl shadow-violet-500/20'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Glow Effect */}
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-600/5 rounded-2xl" />
                )}

                <div className="relative z-10">
                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  
                  {/* Description */}
                  <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>

                  {/* CTA Button */}
                  <a
                    href={TELEGRAM_BOT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 mb-8 text-center ${
                      plan.popular
                        ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-105'
                        : 'bg-slate-800 text-white hover:bg-slate-700'
                    }`}
                  >
                    {plan.cta}
                  </a>

                  {/* Features */}
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-cyan-400" />
                        </div>
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

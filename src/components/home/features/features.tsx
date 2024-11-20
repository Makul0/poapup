'use client'

import { motion } from 'framer-motion'
import { 
  CollectionIcon, 
  ShieldCheckIcon, 
  SparklesIcon,
  TrophyIcon 
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Collect and Showcase',
    description:
      'Build your digital collection of memories. Each POAP represents a unique moment in your journey.',
    icon: CollectionIcon,
  },
  {
    name: 'True Ownership',
    description:
      'Your memories are truly yours. POAPs are stored on Solana blockchain, giving you complete ownership.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Rank Up',
    description:
      'Earn points and climb the leaderboard as you collect more POAPs. Show off your event attendance.',
    icon: TrophyIcon,
  },
  {
    name: 'Special Perks',
    description:
      'Unlock exclusive benefits and rewards based on your POAP collection and ranking.',
    icon: SparklesIcon,
  },
]

export function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Collect POAPs
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to collect and manage your memories
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            POAPup makes it easy to collect, manage, and showcase your event attendance.
            Start building your collection today.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <motion.dl 
            className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                className="relative pl-16"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  {feature.description}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </div>
  )
}
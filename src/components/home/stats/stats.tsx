'use client'

import { motion } from 'framer-motion'

const stats = [
  { id: 1, name: 'POAPs Created', value: '8,000+' },
  { id: 2, name: 'Unique Collectors', value: '5,000+' },
  { id: 3, name: 'Events', value: '1,000+' },
  { id: 4, name: 'Total POAPs Minted', value: '50,000+' },
]

export function Stats() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.dl
          className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              className="mx-auto flex max-w-xs flex-col gap-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                {stat.value}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </div>
  )
}
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const testimonials = [
  {
    body: "POAPup has revolutionized how we track event attendance. The ranking system adds a fun competitive element!",
    author: {
      name: 'Sarah Chen',
      handle: '@sarahchen',
      imageUrl: '/api/placeholder/32/32',
      role: 'Event Organizer',
    },
  },
  {
    body: "I love collecting POAPs from various events. It's like a digital scrapbook of my journey in the web3 space.",
    author: {
      name: 'Marcus Rodriguez',
      handle: '@marcusrodz',
      imageUrl: '/api/placeholder/32/32',
      role: 'Community Member',
    },
  },
]
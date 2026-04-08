"use client"

import React, { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { SparklesIcon } from '@heroicons/react/24/solid'

const ROTATING_WORDS = ['Next.js 14', 'Three.js', 'React Native', 'Node.js', 'TypeScript']

const SkillText = () => {
    const [wordIndex, setWordIndex] = useState(0)
    const [displayed, setDisplayed] = useState('')
    const [deleting, setDeleting] = useState(false)
    const ref = React.useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    // Typewriter effect
    useEffect(() => {
        const current = ROTATING_WORDS[wordIndex]
        let timeout: ReturnType<typeof setTimeout>

        if (!deleting && displayed.length < current.length) {
            timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80)
        } else if (!deleting && displayed.length === current.length) {
            timeout = setTimeout(() => setDeleting(true), 1800)
        } else if (deleting && displayed.length > 0) {
            timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45)
        } else if (deleting && displayed.length === 0) {
            setDeleting(false)
            setWordIndex((i) => (i + 1) % ROTATING_WORDS.length)
        }

        return () => clearTimeout(timeout)
    }, [displayed, deleting, wordIndex])

    return (
        <div ref={ref} className='w-full flex flex-col items-center justify-center text-center px-4'>
            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className='flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-950/40 backdrop-blur-sm mb-6'
            >
                <SparklesIcon className='text-violet-400 h-4 w-4' />
                <span className='text-xs font-semibold tracking-widest text-violet-300 uppercase'>
                    Technical Arsenal
                </span>
            </motion.div>

            {/* Main heading */}
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className='text-4xl md:text-6xl font-black text-white leading-tight mb-3 h-20'
            >
                Building with{' '}
                <span className='relative inline-block'>
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 '>
                        {displayed}
                        <span className='animate-pulse text-cyan-400'>|</span>
                    </span>
                </span>
            </motion.h2>

            {/* Sub heading */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className='text-gray-400 text-base md:text-lg max-w-xl leading-relaxed'
            >
                A full-spectrum stack — from pixel-perfect UIs to distributed backends,
                mobile apps, and real-time 3D experiences.
            </motion.p>

            {/* Divider */}
            <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={inView ? { scaleX: 1, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className='mt-8 h-px w-40 rounded-full'
                style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)' }}
            />
        </div>
    )
}

export default SkillText
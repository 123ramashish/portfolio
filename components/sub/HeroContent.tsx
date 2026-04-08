"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { slideInFromLeft, slideInFromRight, slideInFromTop } from '@/lib/motion'
import { SparklesIcon } from '@heroicons/react/16/solid'
import Image from 'next/image'
import styles from "./MyButton.module.css";

const HeroContent = () => {
    return (
        <motion.section
            initial="hidden"
            animate="visible"
            className='relative flex flex-col md:flex-row items-center justify-center w-full min-h-screen py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-10 lg:px-20 sm:mt-20 md:mt-28 lg:mt-40 z-[20]'
        >
            {/* Content Column */}
            <div className='w-full md:w-1/2 flex flex-col gap-4 sm:gap-5 justify-center items-center md:items-start text-center md:text-start mb-8 md:mb-0 md:pr-4 lg:pr-8'>
                
                {/* Welcome Badge */}
                <motion.div
                    variants={slideInFromTop}
                    className='Welcome-box py-2 px-3 sm:py-[8px] sm:px-[7px] border border-[#7042f88b] opacity-[0.9] rounded-full inline-flex items-center'
                >
                    <SparklesIcon className='text-[#b49bff] mr-2 h-4 w-4 sm:h-5 sm:w-5' />
                    <h1 className='Welcome-text text-[11px] sm:text-[13px] font-medium'>
                        Fullstack Developer Portfolio
                    </h1>
                </motion.div>

                {/* Main Headline - Responsive Typography */}
                <motion.div
                    variants={slideInFromLeft(0.5)}
                    className='flex flex-col gap-2 sm:gap-3 mt-2 sm:mt-4'
                >
                    <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight sm:leading-snug max-w-full sm:max-w-[600px]'>
                        <span className='block'>Providing</span>
                        <span className='block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500'>
                            the best
                        </span>
                        <span className='block'>project experience</span>
                    </h2>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    variants={slideInFromLeft(0.8)}
                    className='text-sm sm:text-base text-gray-400 my-2 sm:my-4 max-w-full sm:max-w-[600px] leading-relaxed'
                >
                    I&apos;m a Full Stack Software Engineer with experience in Website,
                    Mobile, and Software development. Check out my projects and skills.
                </motion.p>

                {/* CTA Button - Full width on mobile */}
                <motion.div
                    variants={slideInFromLeft(1)}
                    className='w-full sm:w-auto flex justify-center md:justify-start mt-2 sm:mt-4'
                >
                    <a href='#footer' className='w-full sm:w-auto'>
                        <button
                            className={`${styles.button} w-full sm:w-auto min-h-[44px] sm:min-h-[48px] px-6 py-3 text-sm sm:text-base font-semibold rounded-xl touch-manipulation`}
                        >
                            Let&apos;s Work Together
                        </button>
                    </a>
                </motion.div>
            </div>

            {/* Image Column */}
            <motion.div
                variants={slideInFromRight(0.8)}
                className='w-full md:w-1/2 flex justify-center items-center mt-6 md:mt-0 md:pl-4 lg:pl-8'
            >
                <div className='relative w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[650px] aspect-square'>
                    <Image
                        src="/mainIconsdark.svg"
                        alt='Development work icons'
                        fill
                        sizes="(max-width: 640px) 320px, (max-width: 768px) 400px, (max-width: 1024px) 500px, 650px"
                        className='object-contain drop-shadow-2xl'
                        priority
                    />
                </div>
            </motion.div>

            {/* Mobile-only decorative gradient */}
            <div className='absolute bottom-0 left-0 right-0 h-24 md:hidden pointer-events-none'
                style={{ 
                    background: 'linear-gradient(to top, rgba(5,5,16,0.8), transparent)',
                    zIndex: -1 
                }} 
            />
        </motion.section>
    )
}

export default HeroContent
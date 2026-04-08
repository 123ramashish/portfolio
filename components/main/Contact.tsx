"use client"

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import ContactAddress from '../sub/ContactAddress'
import ContactForm from '../sub/ContactForm'

const Contact = () => {
    const sectionRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef(null)
    const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    })

    // Scroll-driven parallax
    const bgY = useTransform(scrollYProgress, [0, 1], [-50, 50])
    const titleY = useTransform(scrollYProgress, [0, 0.4], [60, 0])
    const titleOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1])
    const cardScale = useTransform(scrollYProgress, [0.1, 0.5], [0.96, 1])

    return (
        <section
            ref={sectionRef}
            id='contact'
            className='relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-28 px-4'
            style={{ background: 'linear-gradient(180deg, #040412 0%, #06060f 50%, #040412 100%)' }}
        >
       
            {/* ── Parallax ambient blobs ── */}
            <motion.div style={{ y: bgY }} className='absolute inset-0 pointer-events-none z-0'>
                <div className='absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full'
                    style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
                <div className='absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full'
                    style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            </motion.div>

            {/* ── Dot grid overlay ── */}
            <div className='absolute inset-0 z-0 pointer-events-none opacity-[0.03]'
                style={{
                    backgroundImage: 'radial-gradient(circle, #a78bfa 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }} />

            {/* ── Content ── */}
            <div className='relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center gap-16'>

                {/* Header */}
                <motion.div
                    ref={titleRef}
                    style={{ y: titleY, opacity: titleOpacity }}
                    className='flex flex-col items-center text-center gap-4'
                >
                    {/* Eyebrow */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={titleInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className='flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/25 bg-violet-950/30 backdrop-blur-sm'
                    >
                        <span className='w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse' />
                        <span className='text-[10px] tracking-widest text-violet-300 uppercase font-semibold'>
                            Open to Opportunities
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        animate={titleInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className='text-4xl md:text-6xl font-black text-white leading-tight tracking-tight'
                    >
                        Let&apos;s{' '}
                        <span className='text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400'>
                            build something
                        </span>
                        <br />great together.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={titleInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className='text-gray-400 text-base max-w-md leading-relaxed'
                    >
                        Have a project in mind, want to collaborate, or just want to say hi?
                        My inbox is always open.
                    </motion.p>

                    {/* Scroll-driven reveal line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={titleInView ? { scaleX: 1 } : {}}
                        transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className='h-px w-32 rounded-full'
                        style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)' }}
                    />
                </motion.div>

                {/* Cards */}
                <motion.div
                    style={{ scale: cardScale }}
                    className='w-full flex flex-col md:flex-row gap-8 md:gap-12 items-start justify-center'
                >
                    {/* Address panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className='flex-1 max-w-sm'
                    >
                        <div
                            className='rounded-2xl p-6 border border-white/5 h-full'
                            style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(12px)' }}
                        >
                            <ContactAddress />
                        </div>
                    </motion.div>

                    {/* Vertical divider */}
                    <motion.div
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className='hidden md:block w-px self-stretch rounded-full'
                        style={{ background: 'linear-gradient(to bottom, transparent, #7c3aed40, #06b6d440, transparent)' }}
                    />

                    {/* Form panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className='flex-1 w-full'
                    >
                        <div
                            className='rounded-2xl p-6 border border-white/5'
                            style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(12px)' }}
                        >
                            <ContactForm />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Footer note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className='text-[11px] text-gray-600 font-mono tracking-widest text-center'
                >
                    TYPICALLY RESPONDS WITHIN 24 HOURS · BASED IN NOIDA, INDIA
                </motion.p>
            </div>

            {/* Corner brackets */}
            {[
                'top-6 left-6 border-t border-l',
                'top-6 right-6 border-t border-r',
                'bottom-6 left-6 border-b border-l',
                'bottom-6 right-6 border-b border-r',
            ].map((cls, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 0.25, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    className={`absolute w-8 h-8 border-violet-500 ${cls} pointer-events-none z-10`}
                />
            ))}
        </section>
    )
}

export default Contact
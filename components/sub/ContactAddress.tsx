"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaPhone, FaLocationDot } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'    
import { FaGithub, FaLinkedin } from 'react-icons/fa'

const INFO = [
    {
        icon: FaPhone,
        label: 'Phone',
        value: '+91-7542918414',
        href: 'tel:+917542918414',
        color: '#a78bfa',
        delay: 0.1,
    },
    {
        icon: MdEmail,
        label: 'Email',
        value: 'ramashish62127@gmail.com',
        href: 'mailto:ramashish62127@gmail.com',
        color: '#22d3ee',
        delay: 0.22,
    },
    {
        icon: FaLocationDot,
        label: 'Location',
        value: 'Noida, Uttar Pradesh (201310)',
        href: 'https://maps.google.com/?q=Noida',
        color: '#34d399',
        delay: 0.34,
    },
]

const SOCIALS = [
    { icon: FaGithub,   label: 'GitHub',   href: 'https://github.com',   color: '#e2e8f0' },
    { icon: FaLinkedin, label: 'LinkedIn',  href: 'https://linkedin.com', color: '#38bdf8' },
]

const ContactAddress = () => {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <div ref={ref} className='flex flex-col gap-5 z-30 w-full md:w-80'>

            {/* Section label */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className='flex items-center gap-2 mb-2'
            >
                <div className='h-px w-6 bg-violet-500' />
                <span className='text-[10px] tracking-widest text-violet-400 uppercase font-semibold'>
                    Contact Info
                </span>
            </motion.div>

            {/* Info cards */}
            {INFO.map(({ icon: Icon, label, value, href, color, delay }) => (
                <motion.a
                    key={label}
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                    initial={{ opacity: 0, x: -40 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ x: 6 }}
                    className='group flex items-center gap-4 p-4 rounded-2xl border border-white/5 backdrop-blur-sm cursor-pointer transition-all duration-300'
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                    {/* Icon bubble */}
                    <motion.div
                        whileHover={{ scale: 1.15, rotate: -8 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className='flex items-center justify-center w-11 h-11 rounded-xl shrink-0 transition-all duration-300 group-hover:shadow-lg'
                        style={{
                            background: `${color}18`,
                            border: `1px solid ${color}35`,
                            boxShadow: `0 0 0 0 ${color}00`,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 16px ${color}50`
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 0 0 ${color}00`
                        }}
                    >
                        <Icon style={{ color, fontSize: 18 }} />
                    </motion.div>

                    <div className='overflow-hidden'>
                        <p className='text-[10px] tracking-widest uppercase mb-0.5'
                            style={{ color: `${color}99` }}>
                            {label}
                        </p>
                        <p className='text-sm text-gray-300 group-hover:text-white transition-colors duration-200 truncate'>
                            {value}
                        </p>
                    </div>

                    {/* Hover accent line */}
                    <div
                        className='ml-auto h-8 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300'
                        style={{ background: `linear-gradient(to bottom, transparent, ${color}, transparent)` }}
                    />
                </motion.a>
            ))}

            {/* Divider */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.5 }}
                className='h-px rounded-full'
                style={{ background: 'linear-gradient(90deg, transparent, #7c3aed55, #06b6d455, transparent)' }}
            />

            {/* Social links */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.55 }}
                className='flex gap-3'
            >
                {SOCIALS.map(({ icon: Icon, label, href, color }) => (
                    <motion.a
                        key={label}
                        href={href}
                        target='_blank'
                        rel='noopener noreferrer'
                        whileHover={{ y: -4, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className='flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/7 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200'
                        style={{ background: 'rgba(255,255,255,0.03)', borderColor: `${color}20` }}
                    >
                        <Icon style={{ color, fontSize: 16 }} />
                        <span>{label}</span>
                    </motion.a>
                ))}
            </motion.div>

            {/* Availability badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.7 }}
                className='flex items-center gap-2 px-4 py-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 w-fit'
            >
                <span className='relative flex h-2 w-2'>
                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75' />
                    <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-400' />
                </span>
                <span className='text-[11px] text-emerald-400 font-medium tracking-wide'>
                    Available for new projects
                </span>
            </motion.div>
        </div>
    )
}

export default ContactAddress

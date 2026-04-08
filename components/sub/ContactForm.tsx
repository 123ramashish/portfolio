"use client"

import { useState, useRef, ChangeEvent, FormEvent } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { FaArrowRightLong } from 'react-icons/fa6'

interface Contact {
    name: string
    email: string
    subject: string
    message: string
}

const FIELDS = [
    { id: 'name',    label: 'Full Name',    type: 'text',  placeholder: 'John Doe',              multiline: false },
    { id: 'email',   label: 'Email',        type: 'email', placeholder: 'john@example.com',      multiline: false },
    { id: 'subject', label: 'Subject',      type: 'text',  placeholder: 'Project Enquiry...',    multiline: false },
    { id: 'message', label: 'Message',      type: 'text',  placeholder: 'Tell me about your project...', multiline: true },
] as const

// ── Particle burst on send (mobile-optimized) ────────────────────────────────
const SendParticles = ({ trigger }: { trigger: boolean }) => {
    const particles = Array.from({ length: 12 }, (_, i) => ({ // Reduced count for mobile performance
        angle: (i / 12) * 360,
        dist: 40 + Math.random() * 30, // Reduced distance for mobile
        color: i % 3 === 0 ? '#7c3aed' : i % 3 === 1 ? '#06b6d4' : '#a78bfa',
        size: 2 + Math.random() * 2, // Smaller particles on mobile
    }))
    return (
        <AnimatePresence>
            {trigger && (
                <div className='absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible'>
                    {particles.map((p, i) => {
                        const r = (p.angle * Math.PI) / 180
                        return (
                            <motion.div
                                key={i}
                                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                animate={{ x: Math.cos(r) * p.dist, y: Math.sin(r) * p.dist, opacity: 0, scale: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.025, ease: 'easeOut' }}
                                className='absolute rounded-full'
                                style={{ width: p.size, height: p.size, background: p.color, boxShadow: `0 0 6px ${p.color}` }}
                            />
                        )
                    })}
                </div>
            )}
        </AnimatePresence>
    )
}

const ContactForm = () => {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })
    const [contact, setContact] = useState<Contact>({ name: '', email: '', subject: '', message: '' })
    const [focused, setFocused] = useState<string | null>(null)
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const [burst, setBurst] = useState(false)
    const [error, setError] = useState(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setContact((p) => ({ ...p, [e.target.id]: e.target.value }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setSending(true)
        setError(false)
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact),
            })
            if (res.ok) {
                setBurst(true)
                setTimeout(() => setBurst(false), 800)
                setTimeout(() => setSent(true), 400)
                setContact({ name: '', email: '', subject: '', message: '' })
            } else {
                setError(true)
            }
        } catch {
            setError(true)
        } finally {
            setSending(false)
        }
    }

    return (
        <div ref={ref} className='w-full mx-auto z-50 px-2 sm:px-0'>

            {/* Section label - centered on mobile, right-aligned on desktop */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className='flex items-center gap-2 mb-4 sm:mb-6 justify-center sm:justify-end'
            >
                <span className='text-[10px] tracking-widest text-cyan-400 uppercase font-semibold'>
                    Send a message
                </span>
                <div className='h-px w-6 bg-cyan-500' />
            </motion.div>

            <AnimatePresence mode='wait'>
                {sent ? (
                    <motion.div
                        key='success'
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className='flex flex-col items-center justify-center gap-4 sm:gap-5 py-12 sm:py-16 text-center rounded-2xl border border-emerald-500/20 mx-2 sm:mx-0'
                        style={{ background: 'rgba(16,185,129,0.05)' }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.2 }}
                            className='w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl'
                            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}
                        >
                            ✓
                        </motion.div>
                        <div className='px-4'>
                            <p className='text-white font-semibold text-base sm:text-lg'>Message Sent!</p>
                            <p className='text-gray-500 text-xs sm:text-sm mt-1 leading-relaxed'>I&apos;ll get back to you within 24 hours.</p>
                        </div>
                        <button
                            onClick={() => setSent(false)}
                            className='text-[10px] sm:text-xs text-violet-400 hover:text-violet-300 transition-colors tracking-widest uppercase py-2 px-4 rounded-lg hover:bg-white/5'
                        >
                            Send another →
                        </button>
                    </motion.div>
                ) : (
                    <motion.form
                        key='form'
                        onSubmit={handleSubmit}
                        className='flex flex-col gap-3 sm:gap-4 w-full'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {FIELDS.map(({ id, label, type, placeholder, multiline }, i) => (
                            <motion.div
                                key={id}
                                initial={{ opacity: 0, y: 24 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.55, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className='relative group'
                            >
                                <motion.label
                                    htmlFor={id}
                                    animate={{
                                        y: focused === id || contact[id as keyof Contact] ? -22 : 0,
                                        scale: focused === id || contact[id as keyof Contact] ? 0.78 : 1,
                                        color: focused === id ? '#a78bfa' : '#4b5563',
                                    }}
                                    transition={{ duration: 0.2 }}
                                    className='absolute left-4 top-3.5 text-[11px] sm:text-sm pointer-events-none origin-left font-medium z-10'
                                    style={{ transformOrigin: 'left center' }}
                                >
                                    {label}
                                </motion.label>

                                <motion.div
                                    animate={{
                                        opacity: focused === id ? 1 : 0,
                                        boxShadow: focused === id ? '0 0 0 1px #7c3aed, 0 0 20px rgba(124,58,237,0.2)' : 'none',
                                    }}
                                    transition={{ duration: 0.2 }}
                                    className='absolute inset-0 rounded-xl pointer-events-none z-0'
                                />

                                {multiline ? (
                                    <textarea
                                        id={id}
                                        rows={4} // Reduced rows for mobile
                                        required
                                        value={contact[id as keyof Contact]}
                                        onChange={handleChange}
                                        onFocus={() => setFocused(id)}
                                        onBlur={() => setFocused(null)}
                                        placeholder={focused === id ? placeholder : ''}
                                        className='w-full pt-5 pb-3 px-4 rounded-xl text-[13px] sm:text-sm text-white resize-none outline-none transition-all duration-200 relative z-1 min-h-[100px] sm:min-h-[120px]'
                                        style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            border: `1px solid ${focused === id ? '#7c3aed60' : 'rgba(255,255,255,0.07)'}`,
                                        }}
                                    />
                                ) : (
                                    <input
                                        id={id}
                                        type={type}
                                        required
                                        value={contact[id as keyof Contact]}
                                        onChange={handleChange}
                                        onFocus={() => setFocused(id)}
                                        onBlur={() => setFocused(null)}
                                        placeholder={focused === id ? placeholder : ''}
                                        className='w-full pt-5 pb-3 px-4 rounded-xl text-[13px] sm:text-sm text-white outline-none transition-all duration-200 relative z-1 min-h-[44px]' // 44px touch target
                                        style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            border: `1px solid ${focused === id ? '#7c3aed60' : 'rgba(255,255,255,0.07)'}`,
                                        }}
                                    />
                                )}
                            </motion.div>
                        ))}

                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className='text-[11px] sm:text-xs text-red-400 text-center px-4'
                                >
                                    Something went wrong. Please try again.
                                </motion.p>
                            )}
                        </AnimatePresence>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.55, delay: 0.55 }}
                            className='relative flex justify-center sm:justify-end mt-1 sm:mt-2'
                        >
                            <div className='relative'>
                                <SendParticles trigger={burst} />
                                <motion.button
                                    type='submit'
                                    disabled={sending}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                    className='relative flex items-center justify-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl font-semibold text-[13px] sm:text-sm text-white overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px] sm:min-h-[48px] w-full sm:w-auto'
                                    style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
                                >
                                    <motion.div
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
                                        className='absolute inset-0 w-1/3 skew-x-12 pointer-events-none'
                                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                                    />

                                    <span className='relative z-10'>
                                        {sending ? 'Sending...' : 'Send Message'}
                                    </span>

                                    <motion.span
                                        animate={sending ? { x: [0, 6, 0] } : {}}
                                        transition={{ duration: 0.6, repeat: Infinity }}
                                        className='relative z-10'
                                    >
                                        <FaArrowRightLong className='text-white/80 text-sm sm:text-base' />
                                    </motion.span>
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ContactForm
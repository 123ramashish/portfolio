"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// ─── Cipher / Glitch Text ─────────────────────────────────────────────────────
const CHARS = '!<>-_\\/[]{}—=+*^?#@$%&ABCDEFabcdef0123456789'

const GlitchDecrypt = ({ text, trigger, delay = 0 }: { text: string; trigger: boolean; delay?: number }) => {
    const [display, setDisplay] = useState(() => text.replace(/./g, '?'))
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        if (!trigger) return
        let iteration = 0
        const total = text.length * 6
        const to = setTimeout(() => {
            intervalRef.current = setInterval(() => {
                setDisplay(
                    text.split('').map((char, i) => {
                        if (char === ' ') return ' '
                        if (i < iteration / 6) return text[i]
                        return CHARS[Math.floor(Math.random() * CHARS.length)]
                    }).join('')
                )
                iteration++
                if (iteration >= total) {
                    clearInterval(intervalRef.current!)
                    setDisplay(text)
                }
            }, 30)
        }, delay)

        return () => {
            clearTimeout(to)
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [trigger, text, delay])

    return <span className='font-mono'>{display}</span>
}

// ─── Matrix Rain Column ───────────────────────────────────────────────────────
const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEF0123456789'

const MatrixColumn = ({ x, delay, trigger }: { x: number; delay: number; trigger: boolean }) => {
    const [chars, setChars] = useState<{ ch: string; opacity: number }[]>([])
    const col = Math.floor(Math.random() * 18) + 8

    useEffect(() => {
        if (!trigger) return
        setChars(
            Array.from({ length: col }, () => ({
                ch: MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
                opacity: Math.random(),
            }))
        )
        const iv = setInterval(() => {
            setChars((prev) =>
                prev.map((c) => ({
                    ch: Math.random() > 0.85 ? MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)] : c.ch,
                    opacity: Math.random() * 0.7 + 0.1,
                }))
            )
        }, 120)
        return () => clearInterval(iv)
    }, [trigger])

    return (
        <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={trigger ? { opacity: 1, y: 0 } : {}}
            transition={{ delay, duration: 0.6, ease: 'easeOut' }}
            className='absolute top-0 flex flex-col items-center'
            style={{ left: `${x}%`, fontSize: 11, fontFamily: 'monospace', lineHeight: '1.4' }}
        >
            {chars.map((c, i) => (
                <span
                    key={i}
                    style={{
                        color: i === chars.length - 1 ? '#fff' : '#22d3ee',
                        opacity: i === chars.length - 1 ? 1 : c.opacity * (1 - i / chars.length),
                        textShadow: i === chars.length - 1 ? '0 0 8px #fff' : `0 0 6px #22d3ee`,
                    }}
                >
                    {c.ch}
                </span>
            ))}
        </motion.div>
    )
}

// ─── Hex Packet Stream ────────────────────────────────────────────────────────
const HexStream = ({ trigger }: { trigger: boolean }) => {
    const [packets, setPackets] = useState<string[]>([])

    useEffect(() => {
        if (!trigger) return
        const gen = () =>
            Array.from({ length: 8 }, () =>
                Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
            ).join(' ')

        setPackets(Array.from({ length: 6 }, gen))
        const iv = setInterval(() => setPackets(Array.from({ length: 6 }, gen)), 800)
        return () => clearInterval(iv)
    }, [trigger])

    return (
        <AnimatePresence>
            {trigger && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className='absolute inset-x-0 bottom-16 flex flex-col items-center gap-1 pointer-events-none'
                >
                    {packets.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            animate={{ opacity: 0.35, x: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className='text-cyan-500 font-mono text-[10px] tracking-widest'
                        >
                            {p}
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// ─── Scan Line ────────────────────────────────────────────────────────────────
const ScanLine = ({ trigger }: { trigger: boolean }) => (
    <AnimatePresence>
        {trigger && (
            <motion.div
                initial={{ top: '-2%' }}
                animate={{ top: '102%' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.4, ease: 'linear', delay: 0.3 }}
                className='absolute left-0 right-0 h-px pointer-events-none z-30'
                style={{
                    background: 'linear-gradient(90deg, transparent 0%, #22d3ee 20%, #a78bfa 50%, #22d3ee 80%, transparent 100%)',
                    boxShadow: '0 0 12px #22d3ee, 0 0 24px #a78bfa',
                }}
            />
        )}
    </AnimatePresence>
)

// ─── Lock with scroll-driven shackle ─────────────────────────────────────────
const AnimatedLock = ({ progress }: { progress: number }) => {
    // 0 = unlocked (shackle up), 1 = locked (shackle down)
    const shackleY = Math.max(0, (1 - progress) * 28)
    const glowOpacity = progress

    return (
        <div className='flex flex-col items-center group cursor-pointer w-auto h-auto select-none'>
            {/* Glow ring behind lock */}
            <div
                className='absolute rounded-full pointer-events-none transition-all duration-300'
                style={{
                    width: 120,
                    height: 120,
                    background: `radial-gradient(circle, rgba(124,58,237,${glowOpacity * 0.6}) 0%, transparent 70%)`,
                    filter: 'blur(20px)',
                    transform: 'translateY(10px)',
                }}
            />

            {/* Shackle (top part) moves down to lock */}
            <div
                style={{ transform: `translateY(${shackleY}px)`, transition: 'transform 0.05s linear', zIndex: 10 }}
            >
                <Image
                    src='/LockTop.png'
                    alt='Lock top'
                    width={50}
                    height={50}
                    className='w-[50px]'
                />
            </div>

            {/* Lock body */}
            <div className='relative z-20' style={{ marginTop: shackleY > 0 ? -shackleY : 0 }}>
                <Image
                    src='/LockMain.png'
                    alt='Lock main'
                    width={70}
                    height={70}
                />
                {/* Locked flash */}
                {progress > 0.9 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 3, opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className='absolute inset-0 rounded-full bg-violet-400 pointer-events-none'
                    />
                )}
            </div>
        </div>
    )
}

// ─── Shield burst particles ────────────────────────────────────────────────────
const ShieldParticles = ({ trigger }: { trigger: boolean }) => {
    const particles = Array.from({ length: 12 }, (_, i) => ({
        angle: (i / 12) * 360,
        distance: 80 + Math.random() * 40,
        size: 3 + Math.random() * 4,
        color: i % 2 === 0 ? '#7c3aed' : '#06b6d4',
    }))

    return (
        <AnimatePresence>
            {trigger && (
                <div className='absolute inset-0 flex items-center justify-center pointer-events-none z-40'>
                    {particles.map((p, i) => {
                        const rad = (p.angle * Math.PI) / 180
                        return (
                            <motion.div
                                key={i}
                                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                animate={{
                                    x: Math.cos(rad) * p.distance,
                                    y: Math.sin(rad) * p.distance,
                                    opacity: 0,
                                    scale: 0,
                                }}
                                transition={{ duration: 0.9, delay: i * 0.03, ease: 'easeOut' }}
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

// ─── Status messages that type in ────────────────────────────────────────────
const STATUS_MSGS = [
    { text: '> Initializing AES-256 cipher...', color: '#94a3b8' },
    { text: '> Handshake complete ✓', color: '#34d399' },
    { text: '> Certificate verified ✓', color: '#34d399' },
    { text: '> End-to-end tunnel established', color: '#a78bfa' },
    { text: '> Connection SECURED ✓✓', color: '#22d3ee' },
]

const StatusLog = ({ trigger }: { trigger: boolean }) => (
    <div className='flex flex-col gap-1 font-mono text-[11px] text-left w-full max-w-xs'>
        {STATUS_MSGS.map((msg, i) => (
            <AnimatePresence key={i}>
                {trigger && (
                    <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.35, duration: 0.4 }}
                        style={{ color: msg.color }}
                    >
                        {msg.text}
                    </motion.div>
                )}
            </AnimatePresence>
        ))}
    </div>
)

// ─── Main Encryption Component ────────────────────────────────────────────────
const Encryption = () => {
    const sectionRef = useRef<HTMLDivElement>(null)
    const inView = useInView(sectionRef, { once: false, margin: '-15%' })
    const [locked, setLocked] = useState(false)
    const [scanDone, setScanDone] = useState(false)
    const [particleBurst, setParticleBurst] = useState(false)

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'center center'],
    })

    // Scroll-driven values
    const lockProgress = useTransform(scrollYProgress, [0.2, 0.85], [0, 1])
    const titleY = useTransform(scrollYProgress, [0, 0.3], [-60, 0])
    const titleOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1])
    const bgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1])
    const vignette = useTransform(scrollYProgress, [0, 0.5], [0.2, 0.85])

    // Springified lock value for smooth animation
    const springLock = useSpring(lockProgress, { stiffness: 80, damping: 18 })
    const [lockVal, setLockVal] = useState(0)

    useEffect(() => {
        return springLock.on('change', (v) => {
            setLockVal(v)
            if (v > 0.92 && !locked) {
                setLocked(true)
                setTimeout(() => setParticleBurst(true), 100)
                setTimeout(() => setParticleBurst(false), 1000)
            }
            if (v < 0.5) setLocked(false)
        })
    }, [springLock, locked])

    // Scan completes after entry
    useEffect(() => {
        if (inView) {
            const t = setTimeout(() => setScanDone(true), 2800)
            return () => clearTimeout(t)
        } else {
            setScanDone(false)
        }
    }, [inView])

    // Matrix column positions
    const columns = Array.from({ length: 14 }, (_, i) => ({
        x: (i / 13) * 100,
        delay: i * 0.12,
    }))

    return (
        <section
            ref={sectionRef}
            className='relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden'
            style={{ background: '#040410' }}
        >
            {/* ── Background video (parallax scaled) ── */}
            <motion.div
                style={{ scale: bgScale }}
                className='absolute inset-0 z-0 pointer-events-none'
            >
                <video
                    loop muted autoPlay playsInline preload='none'
                    className='w-full h-full object-cover opacity-25'
                    src='/encryption.webm'
                />
            </motion.div>

            {/* ── Dynamic vignette ── */}
            <motion.div
                style={{ opacity: vignette }}
                className='absolute inset-0 z-1 pointer-events-none'
            >
                <div className='w-full h-full'
                    style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #000 100%)' }} />
            </motion.div>

            {/* ── Grid overlay ── */}
            <div className='absolute inset-0 z-1 pointer-events-none opacity-[0.04]'
                style={{
                    backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }} />

            {/* ── Matrix rain (side columns) ── */}
            <div className='absolute inset-0 z-2 pointer-events-none overflow-hidden'>
                {columns.map((col, i) => (
                    <MatrixColumn key={i} x={col.x} delay={col.delay} trigger={inView} />
                ))}
            </div>

            {/* ── Scan line ── */}
            <ScanLine trigger={inView} />

            {/* ── Hex packet stream ── */}
            <HexStream trigger={scanDone} />

            {/* ── Title ── */}
            <motion.div
                style={{ y: titleY, opacity: titleOpacity }}
                className='absolute top-12 z-20 w-full text-center px-4'
            >
                <h2 className='text-4xl md:text-5xl font-black text-white tracking-tight'>
                    <GlitchDecrypt text='Performance' trigger={inView} delay={200} />
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400'> &amp; </span>
                    <GlitchDecrypt text='Security' trigger={inView} delay={600} />
                </h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 1.8, duration: 0.8 }}
                    className='text-xs font-mono tracking-widest text-cyan-600 mt-2 uppercase'
                >
                    [ AES-256 · TLS 1.3 · Zero-Knowledge ]
                </motion.p>
            </motion.div>

            {/* ── Center lock + badge ── */}
            <div className='relative z-20 flex flex-col items-center gap-6'>

                {/* Orbital ring */}
                <motion.div
                    animate={locked ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className='absolute pointer-events-none'
                    style={{ width: 160, height: 160 }}
                >
                    <svg width='160' height='160' viewBox='0 0 160 160'>
                        <circle cx='80' cy='80' r='72' fill='none'
                            stroke='url(#ring-grad)' strokeWidth='1' strokeDasharray='4 8' />
                        <defs>
                            <linearGradient id='ring-grad' x1='0' y1='0' x2='1' y2='1'>
                                <stop offset='0%' stopColor='#7c3aed' />
                                <stop offset='100%' stopColor='#06b6d4' />
                            </linearGradient>
                        </defs>
                    </svg>
                </motion.div>

                {/* Shield burst on lock */}
                <ShieldParticles trigger={particleBurst} />

                <AnimatedLock progress={lockVal} />

                {/* Encryption badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 0.95, scale: 1 } : {}}
                    transition={{ delay: 0.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className='flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/40 backdrop-blur-md'
                    style={{ background: 'rgba(124,58,237,0.12)' }}
                >
                    <span className='w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse' />
                    <span className='font-mono text-xs text-violet-300 tracking-widest uppercase'>
                        {locked ? 'SECURED' : 'ENCRYPTING...'}
                    </span>
                </motion.div>

                {/* Lock progress bar */}
                <div className='w-48 h-0.5 rounded-full bg-white/5 overflow-hidden'>
                    <motion.div
                        className='h-full rounded-full'
                        style={{
                            width: `${lockVal * 100}%`,
                            background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                            boxShadow: '0 0 8px #06b6d4',
                        }}
                    />
                </div>

                {/* Status log */}
                <StatusLog trigger={inView} />
            </div>

            {/* ── Bottom tagline ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={scanDone ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className='absolute bottom-10 z-20 text-center px-6'
            >
                <p className='text-gray-400 text-base font-light tracking-wide'>
                    Secure your data with{' '}
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 font-semibold'>
                        end-to-end encryption
                    </span>
                </p>
                <p className='text-gray-600 font-mono text-[10px] mt-1 tracking-widest'>
                    YOUR DATA NEVER LEAVES YOUR DEVICE UNENCRYPTED
                </p>
            </motion.div>

            {/* ── Corner brackets ── */}
            {[
                'top-6 left-6 border-t border-l',
                'top-6 right-6 border-t border-r',
                'bottom-6 left-6 border-b border-l',
                'bottom-6 right-6 border-b border-r',
            ].map((cls, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={inView ? { opacity: 0.4, scale: 1 } : {}}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className={`absolute w-8 h-8 border-cyan-500 ${cls} pointer-events-none z-20`}
                />
            ))}
        </section>
    )
}

export default Encryption

"use client"

import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

interface Props {
    src: string
    width: number
    height: number
    index: number
    skill_name: string
    categoryColor: string
}

const SkillsDataProvider = ({ src, width, height, index, skill_name, categoryColor }: Props) => {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: '-60px' })
    const [tilt, setTilt] = useState({ x: 0, y: 0 })
    const [hovered, setHovered] = useState(false)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (e.clientX - cx) / (rect.width / 2)
        const dy = (e.clientY - cy) / (rect.height / 2)
        setTilt({ x: dy * -12, y: dx * 12 })
    }

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 })
        setHovered(false)
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30, scale: 0.85 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
                duration: 0.55,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: hovered ? 'transform 0.1s ease' : 'transform 0.5s ease',
            }}
            className='group relative flex flex-col items-center justify-center gap-2 cursor-pointer'
        >
            {/* Card */}
            <div
                className='relative flex items-center justify-center rounded-2xl p-4 border transition-all duration-300'
                style={{
                    background: hovered
                        ? `radial-gradient(circle at center, ${categoryColor}18, rgba(255,255,255,0.03))`
                        : 'rgba(255,255,255,0.03)',
                    borderColor: hovered ? `${categoryColor}60` : 'rgba(255,255,255,0.07)',
                    boxShadow: hovered
                        ? `0 0 24px ${categoryColor}30, 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)`
                        : '0 4px 16px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(10px)',
                    width: 90,
                    height: 90,
                }}
            >
                {/* Glow ring on hover */}
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className='absolute inset-0 rounded-2xl pointer-events-none'
                        style={{
                            background: `conic-gradient(from 0deg, ${categoryColor}00, ${categoryColor}50, ${categoryColor}00)`,
                            animation: 'spin 2s linear infinite',
                        }}
                    />
                )}

                <Image
                    src={src}
                    width={width}
                    height={height}
                    alt={skill_name}
                    className='object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110'
                    style={{ maxWidth: width, maxHeight: height }}
                />
            </div>

            {/* Label */}
            <motion.span
                animate={{ opacity: hovered ? 1 : 0.5, y: hovered ? 0 : 2 }}
                transition={{ duration: 0.2 }}
                className='text-[10px] font-semibold tracking-wider text-center leading-tight'
                style={{ color: hovered ? categoryColor : '#6b7280', maxWidth: 80, textTransform: 'uppercase' }}
            >
                {skill_name}
            </motion.span>
        </motion.div>
    )
}

export default SkillsDataProvider
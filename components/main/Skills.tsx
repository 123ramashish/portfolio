"use client"

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
    Backend_skill,
    Frontend_skill,
    Full_stack,
    Other_skill,
    Skill_data,
} from '@/constants'
import SkillsDataProvider from '../sub/SkillsDataProvider'
import SkillText from '../sub/SkillText'

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORIES = [
    {
        key: 'all',
        label: 'All',
        data: [] as typeof Skill_data,
        color: '#a78bfa',
        description: 'Complete technology stack',
        icon: '⚡',
    },
    {
        key: 'frontend',
        label: 'Frontend',
        data: [] as typeof Frontend_skill,
        color: '#38bdf8',
        description: 'UI / UX & visual layer',
        icon: '🎨',
    },
    {
        key: 'backend',
        label: 'Backend',
        data: [] as typeof Backend_skill,
        color: '#34d399',
        description: 'Servers, APIs & databases',
        icon: '⚙️',
    },
    {
        key: 'fullstack',
        label: 'DevOps',
        data: [] as typeof Full_stack,
        color: '#fb923c',
        description: 'Deployment & workflow',
        icon: '🚀',
    },
    {
        key: 'other',
        label: 'Other',
        data: [] as typeof Other_skill,
        color: '#f472b6',
        description: 'Additional expertise',
        icon: '🧩',
    },
]

// ─── Three.js Background (Mobile-Optimized) ───────────────────────────────────
const ThreeBackground = () => {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (typeof window === "undefined") return
        if (!mountRef.current) return
        const el = mountRef.current
        
        // Mobile performance: reduce particle count on small screens
        const isMobile = window.innerWidth < 768
        const PARTICLE_COUNT = isMobile ? 12 : 28
        
        const W = el.clientWidth
        const H = el.clientHeight

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100)
        camera.position.z = isMobile ? 10 : 8

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
        renderer.setSize(W, H)
        const pixelRatio = typeof window !== "undefined" ? window.devicePixelRatio : 1
        renderer.setPixelRatio(Math.min(pixelRatio, isMobile ? 1.5 : 2))
        el.appendChild(renderer.domElement)

        const nodes: THREE.Mesh[] = []
        const nodeColors = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e']
        const geoTypes = [
            new THREE.OctahedronGeometry(0.2, 0),
            new THREE.TetrahedronGeometry(0.22, 0),
            new THREE.IcosahedronGeometry(0.18, 0),
        ]

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const geo = geoTypes[i % geoTypes.length]
            const mat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(nodeColors[i % nodeColors.length]),
                wireframe: true,
                transparent: true,
                opacity: isMobile ? 0.12 : 0.18 + Math.random() * 0.12,
            })
            const mesh = new THREE.Mesh(geo, mat)
            const spread = isMobile ? 12 : 18
            mesh.position.set(
                (Math.random() - 0.5) * spread,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 4 - 2
            )
            mesh.userData = {
                rotX: (Math.random() - 0.5) * 0.006,
                rotY: (Math.random() - 0.5) * 0.009,
                floatSpeed: 0.2 + Math.random() * 0.4,
                floatAmp: 0.05 + Math.random() * 0.08,
                originY: mesh.position.y,
            }
            scene.add(mesh)
            nodes.push(mesh)
        }

        // Fewer connections on mobile for performance
        const lineMat = new THREE.LineBasicMaterial({ 
            color: '#7c3aed', 
            transparent: true, 
            opacity: isMobile ? 0.03 : 0.06 
        })
        const connectionThreshold = isMobile ? 7 : 5
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (nodes[i].position.distanceTo(nodes[j].position) < connectionThreshold) {
                    const points = [nodes[i].position.clone(), nodes[j].position.clone()]
                    const geo = new THREE.BufferGeometry().setFromPoints(points)
                    scene.add(new THREE.Line(geo, lineMat))
                }
            }
        }

        let mouseX = 0, mouseY = 0
        const onMouse = (e: MouseEvent) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 0.3
            mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3
        }
        // Only track mouse on desktop
        if (!isMobile) window.addEventListener('mousemove', onMouse)

        const onResize = () => {
            const nW = el.clientWidth, nH = el.clientHeight
            camera.aspect = nW / nH
            camera.updateProjectionMatrix()
            renderer.setSize(nW, nH)
        }
        window.addEventListener('resize', onResize)

        let raf: number
        const tick = () => {
            raf = requestAnimationFrame(tick)
            const t = Date.now() * 0.001
            nodes.forEach((n) => {
                n.rotation.x += n.userData.rotX
                n.rotation.y += n.userData.rotY
                n.position.y = n.userData.originY + Math.sin(t * n.userData.floatSpeed) * n.userData.floatAmp
            })
            // Smoother camera follow on mobile
            const lerpFactor = isMobile ? 0.02 : 0.04
            camera.position.x += (mouseX - camera.position.x) * lerpFactor
            camera.position.y += (-mouseY - camera.position.y) * lerpFactor
            camera.lookAt(scene.position)
            renderer.render(scene, camera)
        }
        tick()

        return () => {
            cancelAnimationFrame(raf)
            if (!isMobile) window.removeEventListener('mousemove', onMouse)
            window.removeEventListener('resize', onResize)
            if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
            renderer.dispose()
            // Clean up geometries
            geoTypes.forEach(g => g.dispose())
        }
    }, [])

    return <div ref={mountRef} className='absolute inset-0 z-0 pointer-events-none' />
}

// ─── Stat counter (Mobile-Optimized) ──────────────────────────────────────────
const StatPill = ({ value, label, color }: { value: string; label: string; color: string }) => {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true })
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4 }}
            className='flex flex-col items-center gap-1 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl border border-white/5 min-w-[72px] sm:min-w-[auto]'
            style={{ background: `${color}10`, borderColor: `${color}25` }}
        >
            <span className='text-xl sm:text-2xl font-black' style={{ color }}>{value}</span>
            <span className='text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest text-gray-500 uppercase text-center leading-tight'>{label}</span>
        </motion.div>
    )
}

// ─── Main Skills Component ────────────────────────────────────────────────────
const Skills = () => {
    const [activeTab, setActiveTab] = useState('all')
    const sectionRef = useRef<HTMLDivElement>(null)
    const gridRef = useRef(null)
    const gridInView = useInView(gridRef, { once: true, margin: '-60px' })

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
    // Reduced parallax intensity for mobile performance
    const bgY = useTransform(scrollYProgress, [0, 1], [-30, 30])
    const titleY = useTransform(scrollYProgress, [0, 0.5], [20, 0])
    const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

    // Build category data
    const cats = CATEGORIES.map((c) => ({
        ...c,
        data:
            c.key === 'all' ? Skill_data
                : c.key === 'frontend' ? Frontend_skill
                    : c.key === 'backend' ? Backend_skill
                        : c.key === 'fullstack' ? Full_stack
                            : Other_skill,
    }))

    const activeCat = cats.find((c) => c.key === activeTab) ?? cats[0]

    return (
        <section
            ref={sectionRef}
            id='skills'
            className='relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-10'
            style={{ background: 'linear-gradient(180deg, #050510 0%, #080818 60%, #050510 100%)' }}
        >
            {/* Three.js floating geometries - mobile optimized */}
            {/* <ThreeBackground /> */}

            {/* Ambient glow blobs - smaller on mobile */}
            <div className='absolute top-1/4 left-1/2 -translate-x-1/2 sm:left-1/4 sm:translate-x-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full pointer-events-none'
                style={{ background: 'radial-gradient(circle, #7c3aed18 0%, transparent 70%)', filter: 'blur(32px) sm:blur(40px)' }} />
            <div className='absolute bottom-1/4 right-1/2 translate-x-1/2 sm:right-1/4 sm:translate-x-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full pointer-events-none'
                style={{ background: 'radial-gradient(circle, #06b6d418 0%, transparent 70%)', filter: 'blur(32px) sm:blur(40px)' }} />

            {/* Grid overlay - finer on mobile */}
            <div className='absolute inset-0 pointer-events-none z-0 opacity-[0.025]'
                style={{
                    backgroundImage: 'linear-gradient(#7c3aed 1px, transparent 1px), linear-gradient(90deg, #7c3aed 1px, transparent 1px)',
                    backgroundSize: '40px 40px', // Smaller grid for mobile
                }} />

            {/* ── Content ── */}
            <div className='relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center gap-8 sm:gap-10 md:gap-12'>

                {/* Header */}
                <motion.div style={{ y: titleY, opacity: titleOpacity }} className='w-full flex justify-center'>
                    <SkillText />
                </motion.div>

                {/* Stat pills - wrap on mobile */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className='flex flex-wrap justify-center gap-2.5 sm:gap-4'
                >
                    <StatPill value='15+' label='Technologies' color='#a78bfa' />
                    <StatPill value='2+' label='Years coding' color='#38bdf8' />
                    <StatPill value='4' label='Domains' color='#34d399' />
                    <StatPill value='∞' label='Learning' color='#fb923c' />
                </motion.div>

                {/* Tab filter - horizontal scroll on mobile, wrap on larger */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className='w-full overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0'
                >
                    <div className='flex sm:flex-wrap justify-start sm:justify-center gap-2 min-w-max sm:min-w-0'>
                        {cats.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setActiveTab(cat.key)}
                                className='relative px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 overflow-hidden whitespace-nowrap touch-manipulation min-h-[40px] sm:min-h-[44px]'
                                style={{
                                    color: activeTab === cat.key ? '#fff' : '#6b7280',
                                    border: `1px solid ${activeTab === cat.key ? cat.color + '60' : 'rgba(255,255,255,0.07)'}`,
                                    background: activeTab === cat.key ? `${cat.color}20` : 'rgba(255,255,255,0.02)',
                                    boxShadow: activeTab === cat.key ? `0 0 20px ${cat.color}25` : 'none',
                                }}
                            >
                                <span className='mr-1.5'>{cat.icon}</span>
                                {cat.label}
                                {activeTab === cat.key && (
                                    <motion.div
                                        layoutId='tab-indicator'
                                        className='absolute bottom-0 left-0 right-0 h-0.5 rounded-full'
                                        style={{ background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)` }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Category description - mobile optimized */}
                <AnimatePresence mode='wait'>
                    <motion.p
                        key={activeTab + '-desc'}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.25 }}
                        className='text-[10px] sm:text-xs tracking-wider uppercase text-center -mt-2 sm:-mt-4 px-4'
                        style={{ color: activeCat.color }}
                    >
                        {activeCat.description} — {activeCat.data.length} technologies
                    </motion.p>
                </AnimatePresence>

                {/* Skill icons grid - responsive columns */}
                <div ref={gridRef} className='w-full'>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-items-center'
                        >
                            {activeCat.data.map((item, i) => (
                                <SkillsDataProvider
                                    key={`${activeTab}-${item.skill_name}-${i}`}
                                    src={item.Image}
                                    width={item.width}
                                    height={item.height}
                                    index={i}
                                    skill_name={item.skill_name}
                                    categoryColor={activeCat.color}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Bottom divider - shorter on mobile */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className='w-3/4 sm:w-full max-w-xs h-px rounded-full mt-2 sm:mt-4'
                    style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)' }}
                />
            </div>

            {/* Video BG — subtle, disabled on mobile for performance */}
            <div className='absolute inset-0 z-0 opacity-5 sm:opacity-10 pointer-events-none hidden sm:block'>
                <video
                    className='w-full h-full object-cover'
                    preload='none'
                    playsInline
                    loop
                    muted
                    autoPlay
                    src='/cards-video.webm'
                />
            </div>
        </section>
    )
}

export default Skills
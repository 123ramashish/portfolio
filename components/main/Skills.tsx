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
        label: 'All Skills',
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
        label: 'DevOps & Tools',
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

// ─── Three.js Background ──────────────────────────────────────────────────────
const ThreeBackground = () => {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (typeof window === "undefined") return
        if (!mountRef.current) return
        const el = mountRef.current
        const W = el.clientWidth
        const H = el.clientHeight

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100)
        camera.position.z = 8

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(W, H)
        const pixelRatio =
            typeof window !== "undefined" ? window.devicePixelRatio : 1
        renderer.setPixelRatio(Math.min(pixelRatio, 2))
        el.appendChild(renderer.domElement)

        // Floating mesh grid of skill "nodes"
        const nodes: THREE.Mesh[] = []
        const nodeColors = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e']
        const geoTypes = [
            new THREE.OctahedronGeometry(0.25, 0),
            new THREE.TetrahedronGeometry(0.28, 0),
            new THREE.IcosahedronGeometry(0.22, 0),
        ]

        for (let i = 0; i < 28; i++) {
            const geo = geoTypes[i % geoTypes.length]
            const mat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(nodeColors[i % nodeColors.length]),
                wireframe: true,
                transparent: true,
                opacity: 0.18 + Math.random() * 0.12,
            })
            const mesh = new THREE.Mesh(geo, mat)
            mesh.position.set(
                (Math.random() - 0.5) * 18,
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 6 - 2
            )
            mesh.userData = {
                rotX: (Math.random() - 0.5) * 0.008,
                rotY: (Math.random() - 0.5) * 0.012,
                floatSpeed: 0.3 + Math.random() * 0.5,
                floatAmp: 0.08 + Math.random() * 0.12,
                originY: mesh.position.y,
            }
            scene.add(mesh)
            nodes.push(mesh)
        }

        // Connecting lines between nearby nodes
        const lineMat = new THREE.LineBasicMaterial({ color: '#7c3aed', transparent: true, opacity: 0.06 })
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (nodes[i].position.distanceTo(nodes[j].position) < 5) {
                    const points = [nodes[i].position.clone(), nodes[j].position.clone()]
                    const geo = new THREE.BufferGeometry().setFromPoints(points)
                    scene.add(new THREE.Line(geo, lineMat))
                }
            }
        }

        let mouseX = 0
        let mouseY = 0
        const onMouse = (e: MouseEvent) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5
            mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5
        }
        window.addEventListener('mousemove', onMouse)

        const onResize = () => {
            const nW = el.clientWidth
            const nH = el.clientHeight
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
            camera.position.x += (mouseX - camera.position.x) * 0.04
            camera.position.y += (-mouseY - camera.position.y) * 0.04
            camera.lookAt(scene.position)
            renderer.render(scene, camera)
        }
        tick()

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('mousemove', onMouse)
            window.removeEventListener('resize', onResize)
            if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
            renderer.dispose()
        }
    }, [])

    return <div ref={mountRef} className='absolute inset-0 z-0 pointer-events-none' />
}

// ─── Stat counter ─────────────────────────────────────────────────────────────
const StatPill = ({ value, label, color }: { value: string; label: string; color: string }) => {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true })
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className='flex flex-col items-center gap-1 px-6 py-3 rounded-2xl border border-white/5'
            style={{ background: `${color}10`, borderColor: `${color}25` }}
        >
            <span className='text-2xl font-black' style={{ color }}>{value}</span>
            <span className='text-[10px] tracking-widest text-gray-500 uppercase'>{label}</span>
        </motion.div>
    )
}

// ─── Main Skills Component ────────────────────────────────────────────────────
const Skills = () => {
    const [activeTab, setActiveTab] = useState('all')
    const sectionRef = useRef(null)
    const gridRef = useRef(null)
    const gridInView = useInView(gridRef, { once: true, margin: '-60px' })

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
    const bgY = useTransform(scrollYProgress, [0, 1], [-60, 60])
    const titleY = useTransform(scrollYProgress, [0, 0.5], [40, 0])
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
            className='relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden py-28 px-4 md:px-10'
            style={{ background: 'linear-gradient(180deg, #050510 0%, #080818 60%, #050510 100%)' }}
        >
            {/* Three.js floating geometries */}
            {/* <ThreeBackground /> */}

            {/* Ambient glow blobs */}
            <div className='absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none'
                style={{ background: 'radial-gradient(circle, #7c3aed18 0%, transparent 70%)', filter: 'blur(40px)' }} />
            <div className='absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none'
                style={{ background: 'radial-gradient(circle, #06b6d418 0%, transparent 70%)', filter: 'blur(40px)' }} />

            {/* Grid overlay */}
            <div className='absolute inset-0 pointer-events-none z-0 opacity-[0.025]'
                style={{
                    backgroundImage: 'linear-gradient(#7c3aed 1px, transparent 1px), linear-gradient(90deg, #7c3aed 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }} />

            {/* ── Content ── */}
            <div className='relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center gap-12'>

                {/* Header */}
                <motion.div style={{ y: titleY, opacity: titleOpacity }} className='w-full'>
                    <SkillText />
                </motion.div>

                {/* Stat pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className='flex flex-wrap gap-4 justify-center'
                >
                    <StatPill value='15+' label='Technologies' color='#a78bfa' />
                    <StatPill value='2+' label='Years coding' color='#38bdf8' />
                    <StatPill value='4' label='Skill domains' color='#34d399' />
                    <StatPill value='∞' label='Still learning' color='#fb923c' />
                </motion.div>

                {/* Tab filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className='flex flex-wrap justify-center gap-2'
                >
                    {cats.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveTab(cat.key)}
                            className='relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden'
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
                </motion.div>

                {/* Category description */}
                <AnimatePresence mode='wait'>
                    <motion.p
                        key={activeTab + '-desc'}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.3 }}
                        className='text-xs tracking-widest uppercase text-center -mt-6'
                        style={{ color: activeCat.color }}
                    >
                        {activeCat.description} — {activeCat.data.length} technologies
                    </motion.p>
                </AnimatePresence>

                {/* Skill icons grid */}
                <div ref={gridRef} className='w-full'>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className='flex flex-row flex-wrap justify-center gap-5 md:gap-6'
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

                {/* Bottom divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className='w-full max-w-xs h-px rounded-full mt-4'
                    style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)' }}
                />
            </div>

            {/* Video BG — subtle */}
            <div className='absolute inset-0 z-0 opacity-10 pointer-events-none'>
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
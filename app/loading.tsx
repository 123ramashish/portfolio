"use client"

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'

// ── Wormhole Three.js tunnel ──────────────────────────────────────────────────
const WormholeTunnel = () => {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = mountRef.current
        if (!el) return

        const W = typeof window !== "undefined" ? window.innerWidth : 0;
        const H = typeof window !== "undefined" ? window.innerHeight : 0;
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(90, W / H, 0.01, 100)
        camera.position.z = 0.5

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(W, H)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        el.appendChild(renderer.domElement)

        // ── Tube / tunnel geometry ──────────────────────────────────────────
        const points: THREE.Vector3[] = []
        for (let i = 0; i <= 120; i++) {
            const t = i / 120
            const angle = t * Math.PI * 8
            points.push(new THREE.Vector3(
                Math.sin(angle) * 0.3 * t,
                Math.cos(angle) * 0.3 * t,
                -t * 30
            ))
        }

        const curve = new THREE.CatmullRomCurve3(points)
        const tubeGeo = new THREE.TubeGeometry(curve, 400, 0.35, 12, false)
        const tubeMat = new THREE.MeshBasicMaterial({
            color: '#7c3aed',
            side: THREE.BackSide,
            wireframe: true,
            transparent: true,
            opacity: 0.35,
        })
        const tube = new THREE.Mesh(tubeGeo, tubeMat)
        scene.add(tube)

        // ── Inner glow tube ──────────────────────────────────────────────────
        const innerGeo = new THREE.TubeGeometry(curve, 200, 0.15, 8, false)
        const innerMat = new THREE.MeshBasicMaterial({
            color: '#06b6d4',
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.18,
        })
        scene.add(new THREE.Mesh(innerGeo, innerMat))

        // ── Floating particles inside tunnel ────────────────────────────────
        const particleCount = 600
        const pPositions = new Float32Array(particleCount * 3)
        const pColors = new Float32Array(particleCount * 3)
        const palette = [
            new THREE.Color('#7c3aed'),
            new THREE.Color('#06b6d4'),
            new THREE.Color('#a78bfa'),
            new THREE.Color('#22d3ee'),
        ]
        for (let i = 0; i < particleCount; i++) {
            const t = Math.random()
            const pt = curve.getPoint(t)
            const spread = 0.25
            pPositions[i * 3] = pt.x + (Math.random() - 0.5) * spread
            pPositions[i * 3 + 1] = pt.y + (Math.random() - 0.5) * spread
            pPositions[i * 3 + 2] = pt.z
            const c = palette[Math.floor(Math.random() * palette.length)]
            pColors[i * 3] = c.r; pColors[i * 3 + 1] = c.g; pColors[i * 3 + 2] = c.b
        }
        const pGeo = new THREE.BufferGeometry()
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))
        pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3))
        const pMat = new THREE.PointsMaterial({
            size: 0.04, vertexColors: true, transparent: true, opacity: 0.8, sizeAttenuation: true,
        })
        scene.add(new THREE.Points(pGeo, pMat))

        // ── Resize ───────────────────────────────────────────────────────────
        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
        window.addEventListener('resize', onResize)

        // ── Animation — fly through ──────────────────────────────────────────
        let raf: number
        let progress = 0
        const tick = () => {
            raf = requestAnimationFrame(tick)
            progress = (progress + 0.0008) % 0.9

            const pos = curve.getPoint(progress)
            const ahead = curve.getPoint(Math.min(progress + 0.01, 0.99))
            camera.position.copy(pos)
            camera.lookAt(ahead)

            tube.rotation.z += 0.002
            renderer.render(scene, camera)
        }
        tick()

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', onResize)
            if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
            renderer.dispose()
        }
    }, [])

    return <div ref={mountRef} className='absolute inset-0 z-0' />
}

// ── Morphing progress ring ────────────────────────────────────────────────────
const ProgressRing = ({ progress }: { progress: number }) => {
    const r = 40
    const circ = 2 * Math.PI * r
    return (
        <svg width={100} height={100} viewBox='0 0 100 100' className='absolute'>
            {/* Track */}
            <circle cx={50} cy={50} r={r} fill='none' stroke='rgba(255,255,255,0.05)' strokeWidth={2} />
            {/* Progress arc */}
            <motion.circle
                cx={50} cy={50} r={r}
                fill='none'
                stroke='url(#ring-grad)'
                strokeWidth={2.5}
                strokeLinecap='round'
                strokeDasharray={circ}
                strokeDashoffset={circ - (circ * progress) / 100}
                transform='rotate(-90 50 50)'
                style={{ filter: 'drop-shadow(0 0 6px #7c3aed)' }}
            />
            <defs>
                <linearGradient id='ring-grad' x1='0' y1='0' x2='1' y2='0'>
                    <stop offset='0%' stopColor='#7c3aed' />
                    <stop offset='100%' stopColor='#06b6d4' />
                </linearGradient>
            </defs>
        </svg>
    )
}

// ── Loading messages ──────────────────────────────────────────────────────────
const MESSAGES = [
    'Initializing systems...',
    'Loading assets...',
    'Calibrating interface...',
    'Preparing experience...',
    'Almost there...',
]

export default function Loading() {
    const [progress, setProgress] = useState(0)
    const [msgIdx, setMsgIdx] = useState(0)

    useEffect(() => {
        const iv = setInterval(() => {
            setProgress((p) => {
                const next = p + (Math.random() * 4 + 0.5)
                if (next >= 100) { clearInterval(iv); return 100 }
                return Math.min(next, 100)
            })
        }, 80)
        const mv = setInterval(() => setMsgIdx((i) => (i + 1) % MESSAGES.length), 1400)
        return () => { clearInterval(iv); clearInterval(mv) }
    }, [])

    return (
        <div className='relative flex items-center justify-center w-screen h-screen overflow-hidden'
            style={{ background: '#03020e' }}>

            {/* Three.js wormhole */}
            <WormholeTunnel />

            {/* Radial vignette */}
            <div className='absolute inset-0 z-1 pointer-events-none'
                style={{ background: 'radial-gradient(ellipse at center, transparent 20%, rgba(3,2,14,0.85) 100%)' }} />

            {/* Center content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className='relative z-10 flex flex-col items-center gap-8'
            >
                {/* Rings + percentage */}
                <div className='relative flex items-center justify-center w-[100px] h-[100px]'>
                    {/* Outer pulse ring */}
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className='absolute w-full h-full rounded-full border border-violet-500/30'
                    />
                    <ProgressRing progress={progress} />
                    <motion.span
                        key={Math.floor(progress)}
                        initial={{ scale: 1.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className='absolute text-sm font-black font-mono text-white'
                    >
                        {Math.floor(progress)}
                        <span className='text-violet-400 text-xs'>%</span>
                    </motion.span>
                </div>

                {/* Logo / name */}
                <div className='flex flex-col items-center gap-1'>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className='text-2xl font-black tracking-tight text-white'
                    >
                        <span className='text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400'>
                            PORTFOLIO
                        </span>
                    </motion.div>
                    <div className='h-px w-24 rounded-full'
                        style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)' }} />
                </div>

                {/* Cycling message */}
                <div className='h-5 flex items-center justify-center'>
                    <AnimatePresence mode='wait'>
                        <motion.p
                            key={msgIdx}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.35 }}
                            className='text-[11px] font-mono tracking-widest text-gray-500 uppercase'
                        >
                            {MESSAGES[msgIdx]}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Segment bar */}
                <div className='flex gap-1.5'>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className='w-1 rounded-full'
                            animate={{
                                height: i < progress / 5 ? 20 : 6,
                                background: i < progress / 5
                                    ? `hsl(${260 + i * 4}, 80%, 65%)`
                                    : 'rgba(255,255,255,0.06)',
                            }}
                            transition={{ duration: 0.3, delay: i * 0.02 }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Corner HUD brackets */}
            {['top-5 left-5 border-t border-l', 'top-5 right-5 border-t border-r',
                'bottom-5 left-5 border-b border-l', 'bottom-5 right-5 border-b border-r'].map((cls, i) => (
                    <motion.div key={i}
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 0.3, scale: 1 }}
                        transition={{ delay: 0.1 * i }}
                        className={`absolute w-8 h-8 border-violet-500 z-20 ${cls}`}
                    />
                ))}
        </div>
    )
}
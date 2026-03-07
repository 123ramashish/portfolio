"use client"

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'

// ── Shattered fragments Three.js ──────────────────────────────────────────────
const ShatteredBg = () => {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = mountRef.current
        if (!el) return

const W = typeof window !== "undefined" ? window.innerWidth : 0;
const H = typeof window !== "undefined" ? window.innerHeight : 0;
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100)
        camera.position.z = 6

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(W, H)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        el.appendChild(renderer.domElement)

        // ── Shattered glass triangles ────────────────────────────────────────
        const FRAG_COUNT = 60
        const fragments: {
            mesh: THREE.Mesh
            vx: number; vy: number; vz: number
            rx: number; ry: number; rz: number
            life: number; maxLife: number
        }[] = []

        const shardColors = ['#7c3aed', '#dc2626', '#9333ea', '#ef4444', '#6d28d9', '#b91c1c']

        const spawnFragments = () => {
            fragments.forEach(f => scene.remove(f.mesh))
            fragments.length = 0

            for (let i = 0; i < FRAG_COUNT; i++) {
                // Random triangle shape
                const size = 0.15 + Math.random() * 0.5
                const geo = new THREE.BufferGeometry()
                const verts = new Float32Array([
                    0, size, 0,
                    -size * 0.8, -size * 0.6, 0,
                    size * 0.8, -size * 0.4, 0,
                ])
                geo.setAttribute('position', new THREE.BufferAttribute(verts, 3))
                const colorHex = shardColors[Math.floor(Math.random() * shardColors.length)]
                const mat = new THREE.MeshBasicMaterial({
                    color: colorHex,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.15 + Math.random() * 0.35,
                    wireframe: Math.random() > 0.5,
                })
                const mesh = new THREE.Mesh(geo, mat)
                mesh.position.set(0, 0, (Math.random() - 0.5) * 2)

                const life = 2 + Math.random() * 3
                fragments.push({
                    mesh,
                    vx: (Math.random() - 0.5) * 0.06,
                    vy: (Math.random() - 0.5) * 0.06,
                    vz: (Math.random() - 0.5) * 0.02,
                    rx: (Math.random() - 0.5) * 0.04,
                    ry: (Math.random() - 0.5) * 0.04,
                    rz: (Math.random() - 0.5) * 0.06,
                    life,
                    maxLife: life,
                })
                scene.add(mesh)
            }
        }
        spawnFragments()

        // ── Error grid plane ─────────────────────────────────────────────────
        const gridGeo = new THREE.PlaneGeometry(20, 12, 24, 14)
        const gridMat = new THREE.MeshBasicMaterial({
            color: '#dc2626',
            wireframe: true,
            transparent: true,
            opacity: 0.04,
        })
        scene.add(new THREE.Mesh(gridGeo, gridMat))

        // ── Floating error particles ─────────────────────────────────────────
        const pCount = 300
        const pPos = new Float32Array(pCount * 3)
        for (let i = 0; i < pCount; i++) {
            pPos[i * 3]     = (Math.random() - 0.5) * 20
            pPos[i * 3 + 1] = (Math.random() - 0.5) * 12
            pPos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2
        }
        const pGeo = new THREE.BufferGeometry()
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
        const pMat = new THREE.PointsMaterial({ color: '#ef4444', size: 0.03, transparent: true, opacity: 0.5 })
        scene.add(new THREE.Points(pGeo, pMat))

        let mx = 0, my = 0
        const onMouse = (e: MouseEvent) => {
            mx = (e.clientX / W - 0.5) * 2
            my = -(e.clientY / H - 0.5) * 2
        }
        window.addEventListener('mousemove', onMouse)
        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
        window.addEventListener('resize', onResize)

        // Respawn every 4s
        const respawn = setInterval(spawnFragments, 4000)

        let raf: number
        const tick = () => {
            raf = requestAnimationFrame(tick)
            const dt = 0.016

            fragments.forEach((f) => {
                f.life -= dt
                const t = 1 - f.life / f.maxLife
                f.mesh.position.x += f.vx
                f.mesh.position.y += f.vy
                f.mesh.position.z += f.vz
                f.mesh.rotation.x += f.rx
                f.mesh.rotation.y += f.ry
                f.mesh.rotation.z += f.rz
                    ; (f.mesh.material as THREE.MeshBasicMaterial).opacity =
                    (0.15 + Math.random() * 0.2) * Math.sin(t * Math.PI)
            })

            camera.position.x += (mx * 0.4 - camera.position.x) * 0.04
            camera.position.y += (my * 0.3 - camera.position.y) * 0.04
            camera.lookAt(scene.position)

            renderer.render(scene, camera)
        }
        tick()

        return () => {
            cancelAnimationFrame(raf)
            clearInterval(respawn)
            window.removeEventListener('mousemove', onMouse)
            window.removeEventListener('resize', onResize)
            if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
            renderer.dispose()
        }
    }, [])

    return <div ref={mountRef} className='absolute inset-0 z-0 pointer-events-none' />
}

// ── Glitch text effect ────────────────────────────────────────────────────────
const GLITCH_CHARS = '!@#$%^&*<>[]{}|/\\'
const GlitchText = ({ text, className }: { text: string; className?: string }) => {
    const [glitched, setGlitched] = useState(text)
    const [active, setActive] = useState(false)

    useEffect(() => {
        const burst = () => {
            setActive(true)
            let count = 0
            const iv = setInterval(() => {
                setGlitched(
                    text.split('').map((c, i) =>
                        i < count / 3 ? c : Math.random() > 0.4 ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : c
                    ).join('')
                )
                count++
                if (count > text.length * 3) {
                    setGlitched(text)
                    setActive(false)
                    clearInterval(iv)
                }
            }, 35)
        }
        burst()
        const t = setInterval(burst, 3500 + Math.random() * 2000)
        return () => clearInterval(t)
    }, [text])

    return (
        <span
            className={className}
            style={{ fontFamily: 'monospace', position: 'relative' }}
        >
            {glitched}
            {active && (
                <span className='absolute inset-0 opacity-50'
                    style={{ color: '#06b6d4', transform: 'translate(2px, 1px)', mixBlendMode: 'screen', pointerEvents: 'none' }}>
                    {glitched}
                </span>
            )}
        </span>
    )
}

// ── Error code lines ──────────────────────────────────────────────────────────
const ERROR_LINES = [
    '> SYSTEM.core.exception(0x500)',
    '> STACK_TRACE: null reference at render()',
    '> Memory dump initiated...',
    '> Recovery protocol: FAILED',
    '> Attempting restart...',
]

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const [lineIdx, setLineIdx] = useState(0)
    const [shake, setShake] = useState(true)

    useEffect(() => {
        const iv = setInterval(() => setLineIdx(i => Math.min(i + 1, ERROR_LINES.length)), 600)
        const sh = setTimeout(() => setShake(false), 1000)
        return () => { clearInterval(iv); clearTimeout(sh) }
    }, [])

    return (
        <html>
            <body>
                <div
                    className='relative flex items-center justify-center w-screen h-screen overflow-hidden'
                    style={{ background: '#0a0203' }}
                >
                    <ShatteredBg />

                    {/* Red vignette */}
                    <div className='absolute inset-0 z-1 pointer-events-none'
                        style={{ background: 'radial-gradient(ellipse at center, transparent 25%, rgba(10,2,3,0.92) 100%)' }} />

                    {/* Scanline overlay */}
                    <div className='absolute inset-0 z-2 pointer-events-none opacity-[0.03]'
                        style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.3) 2px, rgba(255,0,0,0.3) 3px)',
                            backgroundSize: '100% 3px',
                        }} />

                    {/* Main content */}
                    <motion.div
                        animate={shake ? { x: [-8, 8, -5, 5, -2, 2, 0] } : {}}
                        transition={{ duration: 0.5 }}
                        className='relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-lg w-full'
                    >
                        {/* 500 */}
                        <div className='relative'>
                            <motion.div
                                initial={{ opacity: 0, scale: 1.4 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className='text-[120px] md:text-[160px] font-black leading-none select-none'
                                style={{
                                    color: 'transparent',
                                    WebkitTextStroke: '1px rgba(220,38,38,0.5)',
                                    fontFamily: 'monospace',
                                }}
                            >
                                <GlitchText text='500' />
                            </motion.div>
                            {/* Red ghost layer */}
                            <div className='absolute inset-0 text-[120px] md:text-[160px] font-black leading-none pointer-events-none select-none opacity-20'
                                style={{ color: '#dc2626', transform: 'translate(4px, 4px)', fontFamily: 'monospace', filter: 'blur(2px)' }}>
                                500
                            </div>
                        </div>

                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className='flex flex-col gap-2'
                        >
                            <h1 className='text-2xl md:text-3xl font-black text-white tracking-tight'>
                                Critical{' '}
                                <span className='text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500'>
                                    System Error
                                </span>
                            </h1>
                            <p className='text-gray-500 text-sm leading-relaxed max-w-sm'>
                                An unexpected exception has occurred. The system has logged the fault.
                            </p>
                        </motion.div>

                        {/* Terminal log */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className='w-full rounded-xl border border-red-900/30 overflow-hidden'
                            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                        >
                            <div className='flex items-center gap-1.5 px-4 py-2.5 border-b border-red-900/20'>
                                <div className='w-2.5 h-2.5 rounded-full bg-red-500/80' />
                                <div className='w-2.5 h-2.5 rounded-full bg-yellow-500/40' />
                                <div className='w-2.5 h-2.5 rounded-full bg-green-500/20' />
                                <span className='ml-2 text-[10px] font-mono text-red-400/60 tracking-widest'>CRASH_LOG</span>
                            </div>
                            <div className='p-4 font-mono text-[11px] text-left space-y-1.5' style={{ minHeight: 120 }}>
                                {ERROR_LINES.slice(0, lineIdx).map((line, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={i === lineIdx - 1 ? 'text-red-400' : 'text-gray-600'}
                                    >
                                        {line}
                                    </motion.div>
                                ))}
                                {lineIdx < ERROR_LINES.length && (
                                    <span className='text-red-400 animate-pulse'>▋</span>
                                )}
                                {error?.digest && (
                                    <div className='text-gray-700 mt-2'>DIGEST: {error.digest}</div>
                                )}
                            </div>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className='flex gap-3'
                        >
                            <motion.button
                                onClick={reset}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className='relative px-7 py-3 rounded-xl font-semibold text-sm text-white overflow-hidden'
                                style={{ background: 'linear-gradient(135deg, #dc2626, #7c3aed)' }}
                            >
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                    className='absolute inset-0 w-1/3 skew-x-12'
                                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                                />
                                <span className='relative z-10'>↺ Restart System</span>
                            </motion.button>
                            <motion.a
                                href='/'
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className='px-7 py-3 rounded-xl font-semibold text-sm text-gray-400 border border-white/8 hover:text-white hover:border-white/20 transition-colors duration-200'
                                style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)' }}
                            >
                                ← Go Home
                            </motion.a>
                        </motion.div>
                    </motion.div>

                    {/* Corner brackets — red */}
                    {['top-5 left-5 border-t border-l', 'top-5 right-5 border-t border-r',
                      'bottom-5 left-5 border-b border-l', 'bottom-5 right-5 border-b border-r'].map((cls, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.25 }}
                            transition={{ delay: 0.1 * i }}
                            className={`absolute w-8 h-8 border-red-500 z-20 ${cls}`}
                        />
                    ))}
                </div>
            </body>
        </html>
    )
}
"use client"

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// ── Deep space Three.js ───────────────────────────────────────────────────────
const DeepSpaceBg = () => {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = mountRef.current
        if (!el) return

        const W = typeof window !== "undefined" ? window.innerWidth : 0;
        const H = typeof window !== "undefined" ? window.innerHeight : 0;
        const scene = new THREE.Scene()
        scene.fog = new THREE.FogExp2('#010108', 0.04)

        const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 100)
        camera.position.z = 5

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(W, H)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        el.appendChild(renderer.domElement)

        // ── Star field (3 depth layers) ──────────────────────────────────────
        const starLayers = [
            { count: 1200, spread: 80, size: 0.015, opacity: 0.9, color: '#ffffff' },
            { count: 600, spread: 60, size: 0.025, opacity: 0.6, color: '#c4b5fd' },
            { count: 200, spread: 40, size: 0.04, opacity: 0.4, color: '#67e8f9' },
        ]
        const starMeshes: THREE.Points[] = []
        starLayers.forEach(({ count, spread, size, opacity, color }) => {
            const pos = new Float32Array(count * 3)
            for (let i = 0; i < count; i++) {
                pos[i * 3] = (Math.random() - 0.5) * spread
                pos[i * 3 + 1] = (Math.random() - 0.5) * spread
                pos[i * 3 + 2] = (Math.random() - 0.5) * spread
            }
            const geo = new THREE.BufferGeometry()
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
            const mat = new THREE.PointsMaterial({ color, size, transparent: true, opacity, sizeAttenuation: true })
            const pts = new THREE.Points(geo, mat)
            scene.add(pts)
            starMeshes.push(pts)
        })

        // ── Asteroids ────────────────────────────────────────────────────────
        const asteroids: { mesh: THREE.Mesh; vx: number; vy: number; rSpeed: THREE.Vector3 }[] = []
        const astColors = ['#4b3f72', '#3b4f72', '#503b72', '#2d4a5e']

        for (let i = 0; i < 20; i++) {
            const size = 0.08 + Math.random() * 0.22
            const geo = new THREE.IcosahedronGeometry(size, 0)
            // Distort vertices for organic feel
            const pos = geo.attributes.position
            for (let v = 0; v < pos.count; v++) {
                pos.setXYZ(v,
                    pos.getX(v) * (0.8 + Math.random() * 0.4),
                    pos.getY(v) * (0.8 + Math.random() * 0.4),
                    pos.getZ(v) * (0.8 + Math.random() * 0.4),
                )
            }
            geo.computeVertexNormals()

            const mat = new THREE.MeshBasicMaterial({
                color: astColors[Math.floor(Math.random() * astColors.length)],
                wireframe: true,
                transparent: true,
                opacity: 0.2 + Math.random() * 0.3,
            })
            const mesh = new THREE.Mesh(geo, mat)
            mesh.position.set(
                (Math.random() - 0.5) * 14,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 8 - 2
            )
            scene.add(mesh)
            asteroids.push({
                mesh,
                vx: (Math.random() - 0.5) * 0.004,
                vy: (Math.random() - 0.5) * 0.003,
                rSpeed: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.008,
                    (Math.random() - 0.5) * 0.012,
                    (Math.random() - 0.5) * 0.006,
                ),
            })
        }

        // ── Nebula (large translucent torus) ─────────────────────────────────
        const nebulaGeo = new THREE.TorusGeometry(4, 1.5, 4, 24)
        const nebulaMat = new THREE.MeshBasicMaterial({
            color: '#312e81',
            wireframe: true,
            transparent: true,
            opacity: 0.04,
        })
        const nebula = new THREE.Mesh(nebulaGeo, nebulaMat)
        nebula.rotation.x = 0.6
        scene.add(nebula)

        // ── Mouse parallax ───────────────────────────────────────────────────
        let mx = 0, my = 0
        const onMouse = (e: MouseEvent) => {
            mx = (e.clientX / W - 0.5) * 0.8
            my = -(e.clientY / H - 0.5) * 0.6
        }
        window.addEventListener('mousemove', onMouse)
        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
        window.addEventListener('resize', onResize)

        // ── Animation ────────────────────────────────────────────────────────
        let raf: number
        const tick = () => {
            raf = requestAnimationFrame(tick)
            const t = Date.now() * 0.001

            // Slowly drift stars
            starMeshes.forEach((s, i) => { s.rotation.y = t * 0.003 * (i + 1) * 0.5 })

            // Float asteroids, wrap around
            asteroids.forEach(({ mesh, vx, vy, rSpeed }) => {
                mesh.position.x += vx
                mesh.position.y += vy
                mesh.rotation.x += rSpeed.x
                mesh.rotation.y += rSpeed.y
                mesh.rotation.z += rSpeed.z
                if (Math.abs(mesh.position.x) > 8) mesh.position.x *= -0.98
                if (Math.abs(mesh.position.y) > 6) mesh.position.y *= -0.98
            })

            nebula.rotation.z = t * 0.02

            camera.position.x += (mx - camera.position.x) * 0.03
            camera.position.y += (my - camera.position.y) * 0.03
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

// ── Floating astronaut emoji ──────────────────────────────────────────────────
const FloatingAstronaut = () => {
    const y = useMotionValue(0)
    const springY = useSpring(y, { stiffness: 30, damping: 8 })

    useEffect(() => {
        let dir = 1
        const iv = setInterval(() => {
            y.set(dir * 18)
            dir *= -1
        }, 2000)
        return () => clearInterval(iv)
    }, [y])

    return (
        <motion.div style={{ y: springY }} className='text-7xl select-none'>
            🧑‍🚀
        </motion.div>
    )
}

// ── Countdown to redirect ─────────────────────────────────────────────────────
const SUGGESTIONS = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Contact', href: '/#contact' },
]

export default function NotFound() {
    const [dots, setDots] = useState('')

    useEffect(() => {
        const iv = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500)
        return () => clearInterval(iv)
    }, [])

    return (
        <div
            className='relative flex items-center justify-center w-screen h-screen overflow-hidden z-50'
            style={{ background: 'radial-gradient(ellipse at 50% 60%, #0a0820 0%, #010108 100%)' }}
        >
            <DeepSpaceBg />

            {/* Deep vignette */}
            <div className='absolute inset-0 z-1 pointer-events-none'
                style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(1,1,8,0.8) 100%)' }} />

            {/* Center content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className='relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-xl w-full'
            >
                {/* 404 number */}
                <div className='relative'>
                    {/* Glow behind text */}
                    <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                        <div className='w-64 h-24 rounded-full'
                            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', filter: 'blur(30px)' }} />
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: -30, scale: 1.1 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className='text-[130px] md:text-[180px] font-black leading-none tracking-tighter select-none'
                        style={{
                            fontFamily: 'monospace',
                            background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 40%, #22d3ee 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 40px rgba(129,140,248,0.4))',
                        }}
                    >
                        404
                    </motion.h1>
                </div>

                {/* Astronaut */}
                <FloatingAstronaut />

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className='flex flex-col gap-2'
                >
                    <h2 className='text-xl md:text-2xl font-bold text-white tracking-tight'>
                        Lost in{' '}
                        <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400'>
                            deep space
                        </span>
                    </h2>
                    <p className='text-gray-500 text-sm leading-relaxed max-w-sm mx-auto font-mono'>
                        The page you're looking for has drifted beyond the observable universe{dots}
                    </p>
                </motion.div>

                {/* Navigation pills */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                    className='flex flex-col items-center gap-4 w-full'
                >
                    {/* Primary CTA */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        className='relative px-10 py-3.5 rounded-full font-semibold text-sm text-white overflow-hidden cursor-pointer z-50'
                        style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
                        onClick={() => window.location.href = '/'}
                    >
                        <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
                            className='absolute inset-0 w-1/3 skew-x-12 pointer-events-none'
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                        />
                        <a href='/' className='relative'>🚀 Return to Home</a>
                    </motion.div>

                    {/* Suggestion links */}
                    <div className='flex items-center gap-2 flex-wrap justify-center'>
                        <span className='text-[10px] text-gray-600 tracking-widest uppercase'>or explore</span>
                        {SUGGESTIONS.map(({ label, href }, i) => (
                            <motion.div
                                key={label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 + i * 0.1 }}
                            >
                                <Link href={href}>
                                    <motion.span
                                        whileHover={{ y: -3 }}
                                        className='inline-block px-3 py-1.5 rounded-full text-xs font-medium text-indigo-300 border border-indigo-500/25 cursor-pointer hover:border-indigo-400/50 hover:text-white transition-colors duration-200'
                                        style={{ background: 'rgba(99,102,241,0.07)' }}
                                    >
                                        {label}
                                    </motion.span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Coordinates readout */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className='flex items-center gap-3 font-mono text-[10px] text-gray-700 tracking-widest'
                >
                    <span>RA: 00h 00m 00s</span>
                    <span className='w-1 h-1 rounded-full bg-gray-700' />
                    <span>DEC: +00° 00′ 00″</span>
                    <span className='w-1 h-1 rounded-full bg-gray-700' />
                    <span>DIST: ∞ ly</span>
                </motion.div>
            </motion.div>

            {/* HUD brackets — indigo */}
            {['top-5 left-5 border-t border-l', 'top-5 right-5 border-t border-r',
                'bottom-5 left-5 border-b border-l', 'bottom-5 right-5 border-b border-r'].map((cls, i) => (
                    <motion.div key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 0.25, scale: 1 }}
                        transition={{ delay: 0.2 + 0.1 * i }}
                        className={`absolute w-8 h-8 border-indigo-500 z-20 ${cls}`}
                    />
                ))}

            {/* Twinkling star extras */}
            {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                    key={i}
                    className='absolute w-0.5 h-0.5 rounded-full bg-white z-2'
                    style={{
                        top: `${10 + Math.random() * 80}%`,
                        left: `${5 + Math.random() * 90}%`,
                    }}
                    animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
                    transition={{
                        duration: 1.5 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}
        </div>
    )
}
"use client"

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const ContactThreeBackground = () => {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = mountRef.current
        if (!el) return

        const W = el.clientWidth
        const H = el.clientHeight

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100)
        camera.position.z = 7

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(W, H)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        el.appendChild(renderer.domElement)

        // ── Constellation nodes ──────────────────────────────────────────────
        const NODE_COUNT = 80
        const nodePositions: THREE.Vector3[] = []
        const nodeMeshes: THREE.Mesh[] = []

        const dotGeo = new THREE.SphereGeometry(0.04, 8, 8)

        for (let i = 0; i < NODE_COUNT; i++) {
            const pos = new THREE.Vector3(
                (Math.random() - 0.5) * 18,
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 4
            )
            nodePositions.push(pos)

            const hue = Math.random() > 0.5 ? '#7c3aed' : '#06b6d4'
            const mat = new THREE.MeshBasicMaterial({
                color: hue,
                transparent: true,
                opacity: 0.5 + Math.random() * 0.5,
            })
            const mesh = new THREE.Mesh(dotGeo, mat)
            mesh.position.copy(pos)
            mesh.userData = {
                originX: pos.x,
                originY: pos.y,
                phase: Math.random() * Math.PI * 2,
                speed: 0.2 + Math.random() * 0.4,
                amp: 0.05 + Math.random() * 0.1,
            }
            scene.add(mesh)
            nodeMeshes.push(mesh)
        }

        // ── Constellation edges ──────────────────────────────────────────────
        const MAX_DIST = 3.2
        const edgeMat = new THREE.LineBasicMaterial({
            color: '#7c3aed',
            transparent: true,
            opacity: 0.08,
        })

        const edgeLines: THREE.Line[] = []
        for (let i = 0; i < NODE_COUNT; i++) {
            for (let j = i + 1; j < NODE_COUNT; j++) {
                if (nodePositions[i].distanceTo(nodePositions[j]) < MAX_DIST) {
                    const geo = new THREE.BufferGeometry().setFromPoints([
                        nodePositions[i].clone(),
                        nodePositions[j].clone(),
                    ])
                    const line = new THREE.Line(geo, edgeMat)
                    scene.add(line)
                    edgeLines.push(line)
                }
            }
        }

        // ── Traveling signal pulses ──────────────────────────────────────────
        const PULSE_COUNT = 6
        const pulseGeo = new THREE.SphereGeometry(0.07, 8, 8)
        const pulseMat = new THREE.MeshBasicMaterial({ color: '#22d3ee', transparent: true, opacity: 0.9 })
        const pulses: { mesh: THREE.Mesh; from: THREE.Vector3; to: THREE.Vector3; t: number; speed: number }[] = []

        for (let i = 0; i < PULSE_COUNT; i++) {
            const fromIdx = Math.floor(Math.random() * NODE_COUNT)
            let toIdx = Math.floor(Math.random() * NODE_COUNT)
            while (toIdx === fromIdx) toIdx = Math.floor(Math.random() * NODE_COUNT)
            const mesh = new THREE.Mesh(pulseGeo, pulseMat.clone())
            scene.add(mesh)
            pulses.push({
                mesh,
                from: nodePositions[fromIdx].clone(),
                to: nodePositions[toIdx].clone(),
                t: Math.random(),
                speed: 0.003 + Math.random() * 0.004,
            })
        }

        // ── Mouse parallax ───────────────────────────────────────────────────
        let mx = 0, my = 0
        const onMouse = (e: MouseEvent) => {
            mx = (e.clientX / window.innerWidth - 0.5) * 1.2
            my = (e.clientY / window.innerHeight - 0.5) * 0.8
        }
        window.addEventListener('mousemove', onMouse)

        const onResize = () => {
            const nW = el.clientWidth, nH = el.clientHeight
            camera.aspect = nW / nH
            camera.updateProjectionMatrix()
            renderer.setSize(nW, nH)
        }
        window.addEventListener('resize', onResize)

        // ── Animation ────────────────────────────────────────────────────────
        let raf: number
        const tick = () => {
            raf = requestAnimationFrame(tick)
            const t = Date.now() * 0.001

            // Float nodes
            nodeMeshes.forEach((n) => {
                n.position.x = n.userData.originX + Math.sin(t * n.userData.speed + n.userData.phase) * n.userData.amp
                n.position.y = n.userData.originY + Math.cos(t * n.userData.speed * 0.7 + n.userData.phase) * n.userData.amp
            })

            // Move pulses
            pulses.forEach((p) => {
                p.t += p.speed
                if (p.t >= 1) {
                    p.t = 0
                    const fromIdx = Math.floor(Math.random() * NODE_COUNT)
                    let toIdx = Math.floor(Math.random() * NODE_COUNT)
                    while (toIdx === fromIdx) toIdx = Math.floor(Math.random() * NODE_COUNT)
                    p.from = nodePositions[fromIdx].clone()
                    p.to = nodePositions[toIdx].clone()
                }
                p.mesh.position.lerpVectors(p.from, p.to, p.t)
                    ; (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.sin(p.t * Math.PI) * 0.9
            })

            // Parallax camera
            camera.position.x += (mx - camera.position.x) * 0.03
            camera.position.y += (-my - camera.position.y) * 0.03
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
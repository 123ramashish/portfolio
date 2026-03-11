"use client"

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { HiOutlineExternalLink } from 'react-icons/hi'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const PROJECTS = [
  {
    order: 1, title: "AmeyaSuite", type: "mobile",
    description: "An enterprise software suite designed for business workflow management including document handling, employee management, and productivity tools.",
    url: "",
    images: [
      "https://ik.imagekit.io/wiijce6yz/368b2c22-30b7-4e69-aa72-3cc0e7ed9b51.jpeg?updatedAt=1773230124905",
      "https://ik.imagekit.io/wiijce6yz/6346eae3-c56c-4939-91b1-1c2e1e20b51a.jpeg?updatedAt=1773230125146",
      "https://ik.imagekit.io/wiijce6yz/6644dcdd-edf4-4468-878b-b7d815737257.jpeg?updatedAt=1773230125507",
      "https://ik.imagekit.io/wiijce6yz/f10cc614-0b8e-4467-900b-0766f028d005.jpeg?updatedAt=1773230125590",
      "https://ik.imagekit.io/wiijce6yz/1594503d-b855-4fa3-a2b6-d77eb0be9d44.jpeg?updatedAt=1773230125511",
      "https://ik.imagekit.io/wiijce6yz/c2315a44-585e-41e2-860d-781c5f790bbb.jpeg?updatedAt=1773230125653",
    ],
    tech: ["React Native", "Next.js", "Node.js", "Express.js", "MongoDB", "Redux Toolkit"],
  },
  {
    order: 1, title: "AmeyaSuite", type: "web",
    description: "An enterprise software suite designed for business workflow management including document handling, employee management, and productivity tools.",
    url: "",
    images: [
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.30.51%E2%80%AFAM.png?updatedAt=1773169294313",
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.29.11%E2%80%AFAM.png?updatedAt=1773169294177",
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.29.42%E2%80%AFAM.png?updatedAt=1773169294157",
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.30.34%E2%80%AFAM.png?updatedAt=1773169294078",
    ],
    tech: ["React Native", "Next.js", "Node.js", "Express.js", "MongoDB", "Redux Toolkit"],
  },
  {
    order: 2, title: "DocVault", type: "web",
    description: "A secure document management platform allowing users to upload, store, manage, and share files with role-based access control.",
    url: "",
    images: [
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.22.19%E2%80%AFAM.png?updatedAt=1773168844337",
      "https://ik.imagekit.io/wiijce6yz/769958e4-e48e-4e9b-99bb-c2f0d1abf6b9.jpeg?updatedAt=1773168844171",
    ],
    tech: ["Next.js", "React.js", "Redux Toolkit", "Node.js", "Express.js", "MongoDB", "JWT Authentication"],
  },
  {
    order: 3, title: "OfficePulse", type: "web",
    description: "A workplace productivity and employee management system for tracking tasks, attendance, team performance, and office workflows.",
    url: "",
    images: [
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.18.52%E2%80%AFAM.png?updatedAt=1773168636086",
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.19.16%E2%80%AFAM.png?updatedAt=1773168636032",
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.20.18%E2%80%AFAM.png?updatedAt=1773168636027",
    ],
    tech: ["Next.js", "React.js", "Node.js", "Express.js", "MongoDB", "JWT Authentication"],
  },
  {
    order: 4, title: "CashWise", type: "web",
    description: "A personal finance management application helping users track expenses, manage budgets, and visualize financial insights.",
    url: "",
    images: [
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.15.53%E2%80%AFAM.png?updatedAt=1773168496189",
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.17.53%E2%80%AFAM.png?updatedAt=1773168496237",
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.16.17%E2%80%AFAM.png?updatedAt=1773168496032",
    ],
    tech: ["Next.js", "React.js", "Node.js", "MongoDB", "Tailwind CSS", "REST APIs"],
  },
  {
    order: 5, title: "Taskify", type: "web",
    description: "A task and productivity management application to organize daily work, assign tasks to teams, and track project progress.",
    url: "",
    images: [
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.26.46%E2%80%AFAM.png?updatedAt=1773169021282",
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.24.47%E2%80%AFAM.png?updatedAt=1773169020882",
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.25.22%E2%80%AFAM.png?updatedAt=1773169021021",
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.25.01%E2%80%AFAM.png?updatedAt=1773169020965",
    ],
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "REST APIs"],
  },
  {
    order: 6, title: "FixitPhysio", type: "web",
    description: "A comprehensive physiotherapy platform offering rehabilitation services, therapy programs, and expert consultation.",
    url: "https://www.fixxitphysio.com/",
    images: ["https://ik.imagekit.io/wiijce6yz/pshy.png"],
    tech: ["Next.js", "React.js", "Tailwind CSS", "Node.js", "MongoDB"],
  },
  {
    order: 7, title: "TastyTreat", type: "web",
    description: "A modern food delivery application where users can browse restaurants, add items to cart, and securely place orders.",
    url: "https://tasty-treat-pizza.onrender.com",
    images: ["https://ik.imagekit.io/wiijce6yz/tastytreat.png"],
    tech: ["React.js", "Tailwind CSS", "Redux", "Node.js", "Express.js", "MongoDB", "JWT Authentication"],
  },
  {
    order: 8, title: "Samasya-Samadhan", type: "web",
    description: "An environmental initiative platform promoting river cleaning, plantation drives, pollution awareness, and community engagement.",
    url: "https://samasya-samadhan.onrender.com",
    images: ["https://ik.imagekit.io/wiijce6yz/cleanup.png"],
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
  },
  {
    order: 10, title: "Real-Time Location Tracker", type: "web",
    description: "A real-time GPS tracking application that visualizes user movement on an interactive map.",
    url: "https://track-me.onrender.com",
    images: ["https://ik.imagekit.io/wiijce6yz/map.png"],
    tech: ["Node.js", "Express.js", "Socket.io", "JavaScript", "Google Maps API"],
  },
  {
    order: 11, title: "MVNFMS Solar System", type: "web",
    description: "A solar energy management system providing real-time analytics and performance monitoring.",
    url: "https://mvnfms.com/",
    images: ["https://ik.imagekit.io/wiijce6yz/mvnfmsimage.png"],
    tech: ["WordPress", "PHP", "MySQL", "JavaScript"],
  },
  {
    order: 12, title: "Liorak E-Commerce", type: "web",
    description: "A powerful e-commerce management platform for product listing, order tracking, and inventory management.",
    url: "https://liorak.in/",
    images: ["https://ik.imagekit.io/wiijce6yz/liorakimage.png"],
    tech: ["WordPress", "WooCommerce", "PHP", "MySQL", "JavaScript"],
  },
  {
    order: 13, title: "Ajit Task & Ticket Manager", type: "mobile",
    description: "A mobile productivity application to manage daily tasks and handle a ticketing system. Create tasks, track tickets, assign responsibilities, and monitor progress in real time.",
    url: "",
    images: [
      "https://ik.imagekit.io/wiijce6yz/1333d356-d4f0-44b2-8744-bd94255dc58e.jpeg?updatedAt=1773230448525",
      "https://ik.imagekit.io/wiijce6yz/b626914b-182d-4fca-b280-d93759a27ec1.jpeg?updatedAt=1773230448477",
      "https://ik.imagekit.io/wiijce6yz/f3cce806-37ed-411b-bb48-5ca021585da6.jpeg?updatedAt=1773230448042",
      "https://ik.imagekit.io/wiijce6yz/762ec555-0345-4f82-a6dc-7a553d87fb0f.jpeg?updatedAt=1773230448027",
      "https://ik.imagekit.io/wiijce6yz/54425d50-02ec-4784-bae5-52a926bbfc48.jpeg?updatedAt=1773230448526",
    ],
    tech: ["React Native", "Redux Toolkit", "Node.js", "Express.js", "MongoDB", "REST APIs"],
  },
  {
    order: 14, title: "SKM Physiotherapy", type: "web",
    description: "A professional physiotherapy clinic website showcasing treatment services, therapy programs, appointment booking, and patient resources.",
    url: "",
    images: [
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.37.28%E2%80%AFAM.png?updatedAt=1773169710334",
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.38.13%E2%80%AFAM.png?updatedAt=1773169710317",
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.37.56%E2%80%AFAM.png?updatedAt=1773169710282",
    ],
    tech: ["Next.js", "React.js", "Tailwind CSS", "Node.js", "MongoDB"],
  },
  {
    order: 15, title: "MelliGlow Makhana Export", type: "web",
    description: "A business website for MelliGlow to promote and export premium makhana products globally, featuring product catalogs and export inquiry management.",
    url: "",
    images: [
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.36.04%E2%80%AFAM.png?updatedAt=1773169618086",
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.36.41%E2%80%AFAM.png?updatedAt=1773169618808",
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.36.29%E2%80%AFAM.png?updatedAt=1773169618045",
    ],
    tech: ["Next.js", "React.js", "Tailwind CSS", "Node.js", "MongoDB"],
  },
  {
    order: 16, title: "Shreywood", type: "web",
    description: "A modern business website for Shreywood showcasing products, company services, and client engagement with a clean and responsive interface.",
    url: "",
    images: [
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.34.17%E2%80%AFAM.png?updatedAt=1773169506072",
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.34.45%E2%80%AFAM.png?updatedAt=1773169506212",
      "https://ik.imagekit.io/wiijce6yz/Screenshot%202026-03-11%20at%2012.34.33%E2%80%AFAM.png?updatedAt=1773169506074",
    ],
    tech: ["Next.js", "React.js", "Tailwind CSS", "Node.js", "MongoDB"],
  },
]

const TABS = ['All', 'Web', 'Mobile'] as const
type Tab = typeof TABS[number]

/* ─────────────────────────────────────────────
   IMAGE CAROUSEL SUB-COMPONENT
───────────────────────────────────────────── */
interface CarouselProps {
  images: string[]
  title: string
  isMobile: boolean
}

const ImageCarousel = ({ images, title, isMobile }: CarouselProps) => {
  const [current, setCurrent] = useState(0)
  const validImages = images.filter(Boolean)
  const total = validImages.length

  const prev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrent(c => (c - 1 + total) % total)
  }, [total])

  const next = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrent(c => (c + 1) % total)
  }, [total])

  // Auto-advance
  useEffect(() => {
    if (total <= 1) return
    const id = setInterval(() => setCurrent(c => (c + 1) % total), 3000)
    return () => clearInterval(id)
  }, [total])

  if (total === 0) return (
    <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-xl">
      <span className="text-gray-600 text-xs font-mono">NO PREVIEW</span>
    </div>
  )

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl group/carousel bg-black/20">
      {/* Images */}
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={current}
          src={validImages[current]}
          alt={`${title} screenshot ${current + 1}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute inset-0 w-full h-full ${isMobile ? 'object-contain p-2' : 'object-cover object-top'}`}
          draggable={false}
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

      {/* Nav arrows — only if multiple images */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/50 border border-white/10 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 hover:bg-violet-600/70 hover:border-violet-500/40 backdrop-blur-sm"
          >
            <FiChevronLeft className="text-white w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/50 border border-white/10 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 hover:bg-violet-600/70 hover:border-violet-500/40 backdrop-blur-sm"
          >
            <FiChevronRight className="text-white w-4 h-4" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {total > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
          {validImages.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-4 h-1.5 bg-violet-400'
                  : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}

      {/* Image counter badge */}
      {total > 1 && (
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-[10px] text-gray-300 font-mono z-10">
          {current + 1}/{total}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   PROJECT CARD
───────────────────────────────────────────── */
interface Project {
  title: string
  type: string
  description: string
  url: string
  images: string[]
  tech: string[]
}

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const isMobile = project.type === 'mobile'
  const cardRef = useRef(null)
  const inView = useInView(cardRef, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/[0.06] hover:border-violet-500/30 transition-all duration-500"
      style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(12px)' }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />

      {/* Type badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase border backdrop-blur-sm ${
          isMobile
            ? 'bg-cyan-950/60 border-cyan-500/30 text-cyan-300'
            : 'bg-violet-950/60 border-violet-500/30 text-violet-300'
        }`}>
          {project.type}
        </span>
      </div>

      {/* Image area */}
      <div className={`relative w-full overflow-hidden ${isMobile ? 'h-56' : 'h-48'}`}
        style={{ background: 'rgba(0,0,0,0.3)' }}>
        <ImageCarousel images={project.images} title={project.title} isMobile={isMobile} />
      </div>

      {/* Divider */}
      <div className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.3), rgba(6,182,212,0.3), transparent)' }} />

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-white font-bold text-lg leading-tight tracking-tight">{project.title}</h3>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-200 mt-0.5"
            >
              <HiOutlineExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{project.description}</p>

        {/* Tech pills */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {project.tech.slice(0, 5).map((t) => (
            <span key={t}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide text-gray-400 border border-white/[0.07]"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              {t}
            </span>
          ))}
          {project.tech.length > 5 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium text-gray-600 border border-white/[0.04]"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              +{project.tech.length - 5}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────── */
const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })
  const [activeTab, setActiveTab] = useState<Tab>('All')

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], [-40, 40])
  const titleY = useTransform(scrollYProgress, [0, 0.4], [60, 0])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1])

  const filtered = PROJECTS.filter(p =>
    activeTab === 'All' ? true : p.type.toLowerCase() === activeTab.toLowerCase()
  )

  const counts = {
    All: PROJECTS.length,
    Web: PROJECTS.filter(p => p.type.toLowerCase() === 'web').length,
    Mobile: PROJECTS.filter(p => p.type.toLowerCase() === 'mobile').length,
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative w-full min-h-screen flex flex-col items-center overflow-hidden py-28 px-4"
      style={{ background: 'linear-gradient(180deg, #06060f 0%, #040412 50%, #06060f 100%)' }}
    >
      {/* Parallax blobs */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/3 left-1/5 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </motion.div>

      {/* Dot grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, #a78bfa 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center gap-14">

        {/* ── Header ── */}
        <motion.div
          ref={titleRef}
          style={{ y: titleY, opacity: titleOpacity }}
          className="flex flex-col items-center text-center gap-4"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={titleInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/25 bg-violet-950/30 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[10px] tracking-widest text-violet-300 uppercase font-semibold">
              Portfolio
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight"
          >
            Things I&apos;ve{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400">
              built
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-gray-400 text-base max-w-md leading-relaxed"
          >
            A curated showcase of web and mobile projects — from enterprise tools to consumer apps.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={titleInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="h-px w-32 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)' }}
          />
        </motion.div>

        {/* ── Filter Tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 p-1.5 rounded-2xl border border-white/[0.07] z-50"
          style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-5 py-2 rounded-xl z-50 text-sm font-semibold transition-all duration-300 flex items-center gap-2"
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(6,182,212,0.2))' }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-300 ${
                activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}>
                {tab}
              </span>
              <span className={`relative z-10 text-[10px] font-mono px-1.5 py-0.5 rounded-md transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-white/15 text-white/80'
                  : 'bg-white/5 text-gray-600'
              }`}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </motion.div>

        {/* ── Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <ProjectCard key={`${project.title}-${project.type}-${i}`} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[11px] text-gray-600 font-mono tracking-widest text-center"
        >
          {filtered.length} PROJECTS · BUILT WITH PASSION IN NOIDA, INDIA
        </motion.p>
      </div>

      {/* Corner brackets */}
      {[
        'top-6 left-6 border-t border-l',
        'top-6 right-6 border-t border-r',
        'bottom-6 left-6 border-b border-l',
        'bottom-6 right-6 border-b border-r',
      ].map((cls, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 0.25, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 * i, duration: 0.5 }}
          className={`absolute w-8 h-8 border-violet-500 ${cls} pointer-events-none z-10`}
        />
      ))}
    </section>
  )
}

export default Projects
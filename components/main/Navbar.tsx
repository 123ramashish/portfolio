'use client'
import { Socials } from '@/constants'
import Image from 'next/image'
import React from 'react'

const Navbar = () => {
    return (
        <div className='w-full h-[60px] sm:h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001417] backdrop-blur-md z-50 px-3 sm:px-6 md:px-10'>
            <div className='w-full h-full flex flex-row  px-[10px]'>
               
                {/* Responsive container: scrollable on mobile, fixed width on desktop */}
                <div className='w-full md:w-[500px] h-full flex flex-row items-center justify-center md:mr-20'>
                    <div className='flex items-center flex-wrap sm:flex-nowrap gap-2 justify-center md:justify-between w-full h-auto border border-[#7042f861] bg-[#0300145e] mr-[15px] px-3 sm:px-[20px] py-2 sm:py-[10px] rounded-full text-gray-200 overflow-x-auto sm:overflow-visible scrollbar-hide'>
                        
                        <a href='#about-me' className='cursor-pointer text-[13px] sm:text-[15px] whitespace-nowrap px-1 sm:px-0 hover:text-violet-400 transition-colors'>
                            About
                        </a>
                        <a href='#skills' className='cursor-pointer text-[13px] sm:text-[15px] whitespace-nowrap px-1 sm:px-0 hover:text-violet-400 transition-colors'>
                            Skills
                        </a>
                        <a href='#projects' className='cursor-pointer text-[13px] sm:text-[15px] whitespace-nowrap px-1 sm:px-0 hover:text-violet-400 transition-colors'>
                            Projects
                        </a>
                        <a href='#contact' className='cursor-pointer text-[13px] sm:text-[15px] whitespace-nowrap px-1 sm:px-0 hover:text-violet-400 transition-colors'>
                            Contact
                        </a>
                        
                        <button className="border text-[13px] sm:text-sm font-medium relative border-white/[0.2] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap flex-shrink-0 hover:border-violet-400/50 transition-colors">
                            <a href="/Ram_Ashish_Kumar_Resume.pdf" download={"Ram_Ashish_Kumar_Resume.pdf"}>Download CV</a>
                            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
                        </button>                    
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
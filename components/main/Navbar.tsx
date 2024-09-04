import { Socials } from '@/constants'
import Image from 'next/image'
import React from 'react'

const Navbar = () => {
    return (
        <div className='w-full h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001417] backdrop-blur-md z-50 px-10'>
            <div className='w-full h-full flex flex-row items-center  m-auto px-[10px]'>
               
                <div className='w-[500px] h-full flex flex-row items-center justify-center md:mr-20 '>
                    <div className='flex items-center flex-wrap gap-2 justify-between w-full h-auto border border-[#7042f861] bg-[#0300145e] mr-[15px] px-[20px] py-[10px] rounded-full text-gray-200'>
                        
                        <a href='#about-me' className='cursor-pointer'>
                            About
                        </a>
                        <a href='#skills' className='cursor-pointer'>
                            Skills
                        </a>
                        <a href='#projects' className='cursor-pointer'>
                            Projects
                        </a>
                        <a href='#contact' className='cursor-pointer'>
                            Contact
                        </a>
                        
                        <button className="border text-sm font-medium relative border-white/[0.2] text-white px-4 py-2 rounded-full">
                        <a href="/resume.pdf" download={"resume.pdf"}>Download CV</a>

          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
        </button>                    
        </div>
                </div>

            </div>

        </div>
    )
}

export default Navbar
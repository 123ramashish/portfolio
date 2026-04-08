import React from 'react'
import { FaDiscord, FaGithub, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa'

const Footer = () => {
    return (
        <footer className='w-full bg-transparent text-gray-200 p-4 sm:p-[15px] z-30' id='footer'>
            <div className='w-full max-w-6xl mx-auto flex flex-col items-center justify-center'>
                
                {/* Links Grid - Stack on mobile, row on md+ */}
                <div className='w-full flex flex-col sm:flex-row items-center justify-around flex-wrap gap-8 sm:gap-4 py-4'>

                    {/* Community Column */}
                    <div className='min-w-[180px] sm:min-w-[200px] h-auto flex flex-col items-center sm:items-start justify-start z-30 px-2'>
                        <div className='font-bold text-[15px] sm:text-[16px] mb-3 sm:mb-4'>
                            Community
                        </div>
                        <a href='https://github.com/123ramashish' target='_blank' rel='noopener noreferrer' 
                           className='flex flex-row items-center my-2 sm:my-[15px] cursor-pointer py-2 sm:py-0'>
                            <FaGithub className='text-lg sm:text-base' />
                            <span className='text-[14px] sm:text-[15px] ml-2 sm:ml-[6px] hover:text-violet-500 transition-colors'>Github</span>
                        </a>
                        {/* <a href='' className='flex flex-row items-center my-2 sm:my-[15px] cursor-pointer py-2 sm:py-0'>
                            <FaYoutube className='text-lg sm:text-base' />
                            <span className='text-[14px] sm:text-[15px] ml-2 sm:ml-[6px]'>Youtube</span>
                        </a> */}
                        {/* <p className='flex flex-row items-center my-2 sm:my-[15px] cursor-pointer py-2 sm:py-0'>
                            <FaDiscord className='text-lg sm:text-base' />
                            <span className='text-[14px] sm:text-[15px] ml-2 sm:ml-[6px]'>Discord</span>
                        </p> */}
                    </div>

                    {/* Social Media Column */}
                    <div className='min-w-[180px] sm:min-w-[200px] h-auto flex flex-col items-center sm:items-start justify-start z-30 px-2'>
                        <div className='font-bold text-[15px] sm:text-[16px] mb-3 sm:mb-4'>
                            Social Media
                        </div>
                        <a href='https://www.linkedin.com/in/ram-ashish-kumar-003188175' target='_blank' rel='noopener noreferrer' 
                           className='flex flex-row items-center my-2 sm:my-[15px] cursor-pointer py-2 sm:py-0'>
                            <FaLinkedin className='text-lg sm:text-base' />
                            <span className='text-[14px] sm:text-[15px] ml-2 sm:ml-[6px] hover:text-violet-500 transition-colors'>LinkedIn</span>
                        </a>
                        {/* <a href='' className='flex flex-row items-center my-2 sm:my-[15px] cursor-pointer py-2 sm:py-0'>
                            <FaInstagram className='text-lg sm:text-base' />
                            <span className='text-[14px] sm:text-[15px] ml-2 sm:ml-[6px]'>Instagram</span>
                        </a> */}
                        {/* <a href='' className='flex flex-row items-center my-2 sm:my-[15px] cursor-pointer py-2 sm:py-0'>
                            <FaTwitter className='text-lg sm:text-base' />
                            <span className='text-[14px] sm:text-[15px] ml-2 sm:ml-[6px]'>Twitter</span>
                        </a> */}
                    </div>

                    {/* Services Column */}
                    <div className='min-w-[180px] sm:min-w-[200px] h-auto flex flex-col items-center sm:items-start justify-start z-30 px-2'>
                        <div className='font-bold text-[15px] sm:text-[16px] mb-3 sm:mb-4'>
                            Services
                        </div>
                        {/* <p className='flex flex-row items-center my-2 sm:my-[15px] cursor-pointer py-2 sm:py-0'>
                            <span className='text-[14px] sm:text-[15px] ml-2 sm:ml-[6px]'>UI/UX Design</span>
                        </p> */}
                        <p className='flex flex-row items-center my-2 sm:my-[15px] cursor-pointer py-2 sm:py-0'>
                            <span className='text-[14px] sm:text-[15px] ml-2 sm:ml-[6px]'>Web Development</span>
                        </p>
                        <p className='flex flex-row items-center my-2 sm:my-[15px] cursor-pointer py-2 sm:py-0'>
                            <span className='text-[14px] sm:text-[15px] ml-2 sm:ml-[6px]'>App Development</span>
                        </p>
                        {/* <p className='flex flex-row items-center my-2 sm:my-[15px] cursor-pointer py-2 sm:py-0'>
                            <span className='text-[14px] sm:text-[15px] ml-2 sm:ml-[6px]'>DevOps</span>
                        </p>
                        <p className='flex flex-row items-center my-2 sm:my-[15px] cursor-pointer py-2 sm:py-0'>
                            <span className='text-[14px] sm:text-[15px] ml-2 sm:ml-[6px]'>SEO</span>
                        </p> */}
                    </div>
                </div>

                {/* Copyright - mobile optimized */}
                <div className='w-full flex justify-center py-4 sm:py-[20px] border-t border-white/5 mt-2'>
                    <p className='text-[13px] sm:text-[15px] text-center text-gray-400 px-4'>
                        &copy; Ram Ashish Kumar {new Date().getFullYear()} Inc. All rights reserved
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
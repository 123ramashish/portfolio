import React from 'react'
import { FaDiscord, FaGithub, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa'

const Footer = () => {
    return (
        <div className='w-full h-full bg-transparent text-gray-200 shadow-lg p-[15px] z-30' id='footer'>
            <div className='w-full flex flex-col items-center justify-center m-auto'>
                <div className='w-full h-full flex flex-row items-center justify-around flex-wrap'>

                    <div className='min-w-[200px] h-auto flex flex-col items-center justify-start z-30'>
                        <div className='font-bold text-[16px]'>
                            Community
                        </div>
                        <a href='https://github.com/123ramashish' target='_blank' className='flex flex-row items-center my-[15px] cursor-pointer'>
                            <FaGithub />
                            <span className='text-[15px] ml-[6px] hover:text-violet-500'>Github</span>
                        </a>
                        <a href='' className='flex flex-row items-center my-[15px] cursor-pointer'>
                            <FaYoutube />
                            <span className='text-[15px] ml-[6px] '>Youtube</span>
                        </a>
                       
                        <p className='flex flex-row items-center my-[15px] cursor-pointer'>
                            <FaDiscord />
                            <span className='text-[15px] ml-[6px]'>Discord</span>
                        </p>

                    </div>

                    <div className='min-w-[200px] h-auto flex flex-col items-center justify-start z-30'>
                        <div className='font-bold text-[16px]'>
                            Social Media
                        </div>
                        <a href='www.linkedin.com/in/ram-ashish-kumar-003188175' target='_blank' className='flex flex-row items-center my-[15px] cursor-pointer'>
                            <FaLinkedin />
                            <span className='text-[15px] ml-[6px] hover:text-violet-500'>LinkedIn</span>
                        </a>
                        <a  href='' className='flex flex-row items-center my-[15px] cursor-pointer'>
                            <FaInstagram />
                            <span className='text-[15px] ml-[6px]'>Instagram</span>
                        </a>
                        <a href='' className='flex flex-row items-center my-[15px] cursor-pointer'>
                            <FaTwitter />
                            <span className='text-[15px] ml-[6px]'>Twitter</span>
                        </a>
                        
                        


                    </div>

                    <div className='min-w-[200px] h-auto flex flex-col items-center justify-start z-30'>
                        <div className='font-bold text-[16px]'>
                            Services
                        </div>
                        <p className='flex flex-row items-center my-[15px] cursor-pointer'>

                            <span className='text-[15px] ml-[6px]'>UI/UX Design</span>
                        </p>
                        <p className='flex flex-row items-center my-[15px] cursor-pointer'>

                            <span className='text-[15px] ml-[6px]'>Web Development </span>
                        </p>
                        <p className='flex flex-row items-center my-[15px] cursor-pointer'>

                            <span className='text-[15px] ml-[6px]'>App Development </span>
                        </p>
                        {/* <p className='flex flex-row items-center my-[15px] cursor-pointer'>

                            <span className='text-[15px] ml-[6px]'>DevOps </span>
                        </p>
                        <p className='flex flex-row items-center my-[15px] cursor-pointer'>

                            <span className='text-[15px] ml-[6px]'>SEO </span>
                        </p> */}
                        
                    </div>
                </div>

                <div className='mb-[20px] text-[15px] text-center'>
                    &copy; Ram Ashish Kumar 2024 Inc. All rights reserved
                </div>
            </div>

        </div>
    )
}

export default Footer
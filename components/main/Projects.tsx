'use client';
import React, { useState } from 'react';
import FrontendProject from '../sub/FrontendProject';
import BackendProject from '../sub/BackendProject';

type Tab = 'all' | 'frontend' | 'fullstack';

const Projects: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('all');

    return (
        <>
            <div className='flex flex-col items-center justify-center pt-20' id='projects'>
                <h1 className='text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-4'>
                    My Projects
                </h1>
                
                <div className='border-2 border-dotted mb-12 z-30'>
                    <button
                        className={`p-2 text-xl font-semibold border-r-2 border-dotted text-white ${activeTab === 'all' ? 'bg-violet-500' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All
                    </button>
                    <button
                        className={`p-2 text-xl font-semibold border-r-2 border-dotted text-white ${activeTab === 'frontend' ? 'bg-violet-500' : ''}`}
                        onClick={() => setActiveTab('frontend')}
                    >
                        Frontend
                    </button>
                    <button
                        className={`p-2 text-xl font-semibold text-white ${activeTab === 'fullstack' ? 'bg-violet-500' : ''}`}
                        onClick={() => setActiveTab('fullstack')}
                    >
                        Full Stack
                    </button>
                </div>
<div>
                {activeTab === 'frontend' && <FrontendProject />}
                {activeTab === 'fullstack' && <BackendProject />}
                {activeTab === 'all' && (
                    <div className='flex flex-wrap '>
                        <FrontendProject />
                        <BackendProject />
                    </div>
                )}
            </div>
            </div>
        </>
    );
}

export default Projects;

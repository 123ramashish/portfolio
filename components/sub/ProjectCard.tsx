import Image from 'next/image';
import React from 'react';
import { HiOutlineExternalLink } from "react-icons/hi";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";

interface Props {
    src: string;
    title: string;
    description: string;
    link: string;
}

const ProjectCard = ({ src, title, description, link }: Props) => {
    return (
        <CardContainer className="inter-var z-30">

        <div className="group relative overflow-hidden rounded-lg shadow-lg border border-[#2A0E61] max-w-96 cursor-pointer"
> 
            <div className="relative p-4 transform transition duration-500 group-hover:rotate-y-6 group-hover:rotate-x-6 group-hover:translate-z-4">
                <Image
                    src={src}
                    alt={title}
                    width={300}
                    height={500}
                    className="w-full object-contain"
                />
                <div className="relative p-4">
                    <div className="flex gap-4 items-center z-30">
                        <h1 className="text-2xl font-semibold text-white">{title}</h1>
                        <a
                            className="text-violet-500 text-2xl justify-end font-bold z-30"
                            href={link}
                            target="_blank" 
                        >
                            <HiOutlineExternalLink />
                        </a>
                    </div>
                    <p className="mt-2 text-gray-300">{description}</p>
                </div>
            </div>
        </div>
        </CardContainer>
    );
}

export default ProjectCard;






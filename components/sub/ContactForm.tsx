'use client';
import { FaArrowRightLong } from "react-icons/fa6";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useSpring, useScroll } from "framer-motion";
import styles from "./MyButton.module.css";

interface Contact {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const ContactForm = () => {
    const [contact, setContact] = useState<Contact>({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setContact((prevContact) => ({
            ...prevContact,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(contact),
            });

            if (response.ok) {
                alert("Message sent successfully!");
                setContact({ name: "", email: "", message: "", subject: "" });
            } else {
                alert("Failed to send the message.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="text-center md:w-1/3 sm:w-4/5 z-30">
            <p className="text-xl text-center text-white ">Get In Touch</p>
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center ">
                <input
                    type="text"
                    id="name"
                    placeholder="Name"
                    required
                    className="p-2 w-full font-serif text-xl text-white my-4 rounded-lg shadow-xl bg-black border-2 border-gray-600 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300"
                    value={contact.name}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    required
                    className="p-2 w-full font-serif text-xl text-white my-4 rounded-lg shadow-xl bg-black border-2 border-gray-600 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300"
                    value={contact.email}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    id="subject"
                    placeholder="Subject"
                    required
                    className="p-2 w-full font-serif text-xl text-white my-4 rounded-lg shadow-xl bg-black border-2 border-gray-600 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300"
                    value={contact.subject}
                    onChange={handleChange}
                />
                <textarea
                    id="message"
                    rows={5}
                    placeholder="Description"
                    required
                    className="p-2 mb-8 w-full font-serif text-xl text-white my-4 rounded-lg shadow-xl bg-black border-2 border-gray-600 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300"
                    value={contact.message}
                    onChange={handleChange}
                ></textarea>

                
                <button
                    type="submit"
                    className={styles.button}
                >
                    <span className="flex items-center gap-2 text-xl">
                        Send <FaArrowRightLong className="text-violet-500 text-3xl font-bold"/>
                    </span>
                </button>
               
            </form>
        </div>
    );
};

export default ContactForm;


















// "use client";
// import React from "react";
// import { Label } from "../ui/label";


// export function SignupFormDemo() {
//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log("Form submitted");
//   };
//   return (
//     <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
//       <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
//         Welcome to Aceternity
//       </h2>
//       <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
//         Login to aceternity if you can because we don&apos;t have a login flow
//         yet
//       </p>

//       <form className="my-8" onSubmit={handleSubmit}>
//         <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
//           <LabelInputContainer>
//             <Label htmlFor="firstname">First name</Label>
//             <Input id="firstname" placeholder="Tyler" type="text" />
//           </LabelInputContainer>
//           <LabelInputContainer>
//             <Label htmlFor="lastname">Last name</Label>
//             <Input id="lastname" placeholder="Durden" type="text" />
//           </LabelInputContainer>
//         </div>
//         <LabelInputContainer className="mb-4">
//           <Label htmlFor="email">Email Address</Label>
//           <Input id="email" placeholder="projectmayhem@fc.com" type="email" />
//         </LabelInputContainer>
//         <LabelInputContainer className="mb-4">
//           <Label htmlFor="password">Password</Label>
//           <Input id="password" placeholder="••••••••" type="password" />
//         </LabelInputContainer>
//         <LabelInputContainer className="mb-8">
//           <Label htmlFor="twitterpassword">Your twitter password</Label>
//           <Input
//             id="twitterpassword"
//             placeholder="••••••••"
//             type="twitterpassword"
//           />
//         </LabelInputContainer>

//         <button
//           className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
//           type="submit"
//         >
//           Sign up &rarr;
//           <BottomGradient />
//         </button>

//         <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

//         <div className="flex flex-col space-y-4">
//           <button
//             className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
//             type="submit"
//           >
//             <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
//             <span className="text-neutral-700 dark:text-neutral-300 text-sm">
//               GitHub
//             </span>
//             <BottomGradient />
//           </button>
//           <button
//             className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
//             type="submit"
//           >
//             <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
//             <span className="text-neutral-700 dark:text-neutral-300 text-sm">
//               Google
//             </span>
//             <BottomGradient />
//           </button>
//           <button
//             className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
//             type="submit"
//           >
//             <IconBrandOnlyfans className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
//             <span className="text-neutral-700 dark:text-neutral-300 text-sm">
//               OnlyFans
//             </span>
//             <BottomGradient />
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// const BottomGradient = () => {
//   return (
//     <>
//       <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
//       <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
//     </>
//   );
// };

// const LabelInputContainer = ({
//   children,
//   className,
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => {
//   return (
//     <div className={cn("flex flex-col space-y-2 w-full", className)}>
//       {children}
//     </div>
//   );
// };

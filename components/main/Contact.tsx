"use client";
import { useEffect } from "react";
import ContactAddress from "../sub/ContactAddress";
import ContactForm from "../sub/ContactForm";

const Contact: React.FC = () => {
 
  return (
    <div className="container" id="contact">
        <div className="mb-12">
          <h1 className="text-3xl text-center text-white ">Wow 😀<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
                
                it's working
              </span></h1>
          <div className="flex flex-wrap gap-12 justify-center">
            <ContactAddress />
            <ContactForm />
          </div>
        </div>
    </div>
  );
};

export default Contact;

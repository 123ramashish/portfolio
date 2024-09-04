import Contact from "@/components/main/Contact";
import Encryption from "@/components/main/Encryption";
import { GoogleGeminiEffectDemo } from "@/components/main/Gemini";
import Hero from "@/components/main/Hero";
import Projects from "@/components/main/Projects";
import Skills from "@/components/main/Skills";
export default function Home() {
  return (

    <main className="h-full w-full">
      <div className="flex flex-col gap-20">
        <Hero />
        <Skills />
        <Encryption />
        <Projects />
        <GoogleGeminiEffectDemo/>
        <Contact/>
      </div>
    </main>
   

  )
}



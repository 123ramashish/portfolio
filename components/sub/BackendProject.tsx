import ProjectCard from './ProjectCard';

const BackendProject = () => {
  return (
    <>
      <div className="flex flex-wrap gap-8 m-auto justify-center z-30 px-12">
        <ProjectCard
          src="/mvnfmsimage.png"
          title="MVNFMS Solar System"
          description="An advanced solar management system built with WordPress, offering real-time energy analytics, performance monitoring, and custom reporting for efficient and sustainable energy optimization."
          link="https://mvnfms.com/"
        />
        <ProjectCard
          src="/liorakimage.png"
          title="E-Commerce Managment"
          description="An advanced e-commerce management system enabling seamless product management, order tracking, inventory control, and real-time analytics for enhanced user experience and operational efficiency."
          link="https://liorak.in/"
        />
         <ProjectCard
        src="/cleanup.png"
        title="Samasya-Samadhan"
        description="Samasya-Samadhan is an environmental startup project aimed at promoting clean and green initiatives. It addresses pollution and environmental issues through community-driven solutions."
        link="https://samasya-samadhan.onrender.com"
      />
        <ProjectCard
          src="/blogapp.png"
          title="Technology Blog App"
          description="A dynamic blog platform built with React.js 14, Tailwind CSS, and Node.js, utilizing Firebase and Mongoose for backend, with JWT for authentication and RESTful APIs for data handling."
          link="https://technology-blog-yal1.onrender.com"
        />
        <ProjectCard
          src="/map.png"
          title="Real-Time Location Tracker"
          description="A real-time location tracking application developed to monitor and visualize user movements on a map, enhancing user interaction and data accuracy."
          link="https://track-me.onrender.com"
        />
        
      </div>
    </>
  );
};

export default BackendProject;

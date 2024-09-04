import ProjectCard from './ProjectCard';

const BackendProject = () => {
  return (
    <>
      <div className="flex flex-wrap gap-8 m-auto justify-center z-30">
        <ProjectCard
          src="/alipublicschool.png"
          title="Ali Public School"
          description="A comprehensive school management system designed using WordPress, featuring essential tools for efficiently managing academic and administrative tasks, including real-time analytics and custom reporting features."
          link="https://alipublicschool.online/"
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

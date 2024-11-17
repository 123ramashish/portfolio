import ProjectCard from './ProjectCard';

const FrontendProject = () => {
  return (
    <div className="flex flex-wrap gap-8 m-auto justify-center z-30">
      <ProjectCard
  src="/pshy.png"
  title="FixitPhysio"
  description="FixitPhysio is a comprehensive physiotherapy website offering a full range of services and resources for physical rehabilitation, tailored exercises, and expert consultations."
  link="https://www.fixxitphysio.com/"
/>

     
      <ProjectCard
        src="/tastytreat.png"
        title="TastyTreat"
        description="TastyTreat is a modern food delivery app developed with React.js, Tailwind CSS, React-Redux, MongoDB, Mongoose, and JWT Auth. It offers a user-friendly interface for ordering meals from a wide variety of restaurants."
        link="https://tasty-treat-pizza.onrender.com"
      />
    </div>
  );
};

export default FrontendProject;

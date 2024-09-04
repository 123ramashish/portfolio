import { FaPhone ,FaLocationDot} from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const ContactAddress=()=>{

return(

    <>
    <div className="text-white flex flex-col justify-center md:w-1/3 sm:1/2 z-30">
        <div className="flex items-center gap-4 text-xl m-8"><span className="text-violet-500"><FaPhone/> </span> +91-7542918414</div>
        <div className="flex items-center gap-4 text-xl m-8"><span className="text-violet-500"><MdEmail/></span> ramashish62127@gmail.com</div>
        <div className="flex items-center gap-4 text-xl m-8"><span className="text-violet-500"><FaLocationDot/></span> Noida <br /> Uttar Pradesh (201310)</div>
    </div>
    </>
)

}

export default ContactAddress;
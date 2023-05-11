import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom"

export function SimpleBackButton({optionalFn}:{optionalFn?: () => void}) {
   const navigate = useNavigate();
   return (
      <button onClick={() => {
         if (optionalFn) {
            optionalFn();
         } else {
            navigate(-1);
         }
         
      }} className="backButton">
          <BsArrowLeft fontSize={20} color="white"/>
      </button>

   )
}
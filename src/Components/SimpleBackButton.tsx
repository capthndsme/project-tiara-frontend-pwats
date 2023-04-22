import { useNavigate } from "react-router-dom"

export function SimpleBackButton() {
   const navigate = useNavigate();
   return (
      <button onClick={() => {navigate(-1)}} className="backButton">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="none" d="M0 0h24v24H0z" />
            <path fill="white" d="M20 11H7.828l5.657-5.657-1.414-1.414L3.515 12l7.071 7.071 1.414-1.414L7.828 13H20v-2z" />
         </svg>
      </button>

   )
}
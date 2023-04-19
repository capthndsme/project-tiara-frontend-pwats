import { useEffect, useState } from "react";

// just a test for now. if this works, create a custom use* hooks with types
export const useChanged = (any: any) => {
   const [localAny, setAny] = useState([]);
   
   useEffect(() => {
     console.log('effect triggered')
   }, [any]);
 
   return {
      localAny
   }
};
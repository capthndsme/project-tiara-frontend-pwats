export function CheckDefaultPFP(val: string | undefined) {
   if (val && val === "DEFAULT_IMG") {
      const pfpSelector = Math.floor(Math.random() * 4) ;
      const defaultPfps = [
         "/default_pfp/1.jpg",
         "/default_pfp/2.jpg",
         "/default_pfp/3.jpg",
         "/default_pfp/4.jpg",
      ];
      // Yes, this is client-sided.
      // Who wants to "hack" a profile picture anyways.
      const defaultPfp = defaultPfps[pfpSelector];
      console.log(`Using default profile picture: ${defaultPfp}`)
      return defaultPfp;
   } else {
      return val;
   }
}
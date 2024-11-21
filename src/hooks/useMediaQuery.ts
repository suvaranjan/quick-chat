// "use client";

// import { useState, useEffect } from "react";

// export function useMediaQuery(query: string): boolean {
//   const [matches, setMatches] = useState(false);

//   useEffect(() => {
//     const media = window.matchMedia(query);
//     const updateMatches = () => setMatches(media.matches);

//     // Set the initial value
//     updateMatches();

//     // Add the event listener
//     media.addEventListener("change", updateMatches);

//     // Clean up the event listener on component unmount
//     return () => {
//       media.removeEventListener("change", updateMatches);
//     };
//   }, [query]);

//   return matches;
// }

"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatches = () => setMatches(media.matches);

    // Set the initial value
    updateMatches();

    // Add the event listener
    media.addEventListener("change", updateMatches);

    // Clean up the event listener on component unmount
    return () => {
      media.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
}

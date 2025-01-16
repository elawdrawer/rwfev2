import { useState, useEffect } from "react";

const useIsOwner = (businessPageOwner: string[]) => {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkIsOwner = () => {
      try {
        // Retrieve the current user ID from localStorage
        const uib = localStorage.getItem("uib");
        if (uib) {
          const user = JSON.parse(uib);
          const currentUserId = user._id;

          // Check if the current user ID exists in the businessPageOwner array
          if (businessPageOwner.includes(currentUserId)) {
            setIsOwner(true);
          } else {
            setIsOwner(false);
          }
        } else {
          console.error("No user data found in localStorage.");
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    };

    checkIsOwner();
  }, [businessPageOwner]);

  return isOwner;
};

export default useIsOwner;

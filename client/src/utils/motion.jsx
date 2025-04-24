export const slideInFromLeft = (delay = 0) => ({
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { delay, duration: 0.5, ease: "easeOut" },
    },
  });
  
  export const slideInFromRight = (delay = 0) => ({
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { delay, duration: 0.5, ease: "easeOut" },
    },
  });
  
  export const slideInFromTop = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };
  
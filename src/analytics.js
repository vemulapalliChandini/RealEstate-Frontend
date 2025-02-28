//  Google analytics


import ReactGA from "react-ga4";

export const initializeAnalytics = () => {
  ReactGA.initialize("G-1MRBDBQW5G"); 
};

export const logPageView = (page) => {
  ReactGA.send({ hitType: "pageview", page });
};



export const logEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};














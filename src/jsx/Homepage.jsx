import React from "react";
import SupportTicketSystem from "./SupportTicketSystem";
import ServiceSelectionPage from "./ServiceSelectionPage";


export const Home = () => {
  return (
    <>
      <h1>Welcome to the Home Page</h1>
      <SupportTicketSystem /> {/* Intégrez ici le composant de menu des tickets */}
      <ServiceSelectionPage/>
    </>
  );
};


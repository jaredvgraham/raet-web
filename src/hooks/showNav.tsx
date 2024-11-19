//show nav context
"use client";
import { createContext, ReactNode, useContext, useState } from "react";

interface ShowNavContextType {
  showNav: boolean;
  setShowNav: (showNav: boolean) => void;
  hideNav: boolean;
  setHideNav: (hideNav: boolean) => void;
}

const ShowNavContext = createContext<ShowNavContextType | undefined>(undefined);

export const ShowNavProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [showNav, setShowNav] = useState(false);
  const [hideNav, setHideNav] = useState(false);

  return (
    <ShowNavContext.Provider
      value={{ showNav, setShowNav, hideNav, setHideNav }}
    >
      {children}
    </ShowNavContext.Provider>
  );
};

export const useShowNav = () => {
  const context = useContext(ShowNavContext);
  if (context === undefined) {
    throw new Error("useShowNav must be used within a ShowNavProvider");
  }
  return context;
};

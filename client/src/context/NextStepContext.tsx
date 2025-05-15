import React, { createContext, useContext, useState } from "react";

type NextStepContextType = {
  next: boolean;
  setNext: (val: boolean) => void;
};

const NextStepContext = createContext<NextStepContextType | undefined>(undefined);

export const useNextStep = () => {
  const ctx = useContext(NextStepContext);
  if (!ctx) throw new Error("useNextStep must be used within NextStepProvider");
  return ctx;
};

export const NextStepProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [next, setNext] = useState(false);
  return (
    <NextStepContext.Provider value={{ next, setNext }}>
      {children}
    </NextStepContext.Provider>
  );
};
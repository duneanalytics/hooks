import React, { createContext, useContext } from "react";

interface DuneContextType {
  duneApiKey: string;
}

const DuneContext = createContext<DuneContextType>({duneApiKey: ""})

export const useDuneContext = () => {
  const context = useContext(DuneContext);
  if (!context) {
    throw new Error("useDuneContext must be used within a DuneProvider");
  }
  return context;
};

export const useGetApiKey = () => {
  const context = useDuneContext();
  return context.duneApiKey;
};

interface DuneProviderProps {
  duneApiKey: string;
  children: React.ReactNode;
}

export const DuneProvider= ({
  duneApiKey,
  children,
}: DuneProviderProps) => {
  return (
    <DuneContext.Provider value={{ duneApiKey }}>
      {children}
    </DuneContext.Provider>
  );
};

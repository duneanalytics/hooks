import React, { createContext, useContext } from "react";

interface DuneContextType {
  duneApiKey: string;
  baseUrl?: string;
}

const DuneContext = createContext<DuneContextType>({
  duneApiKey: "",
  baseUrl: "",
});

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

export const useGetBaseUrl = () => {
  const context = useDuneContext();
  if (!context.baseUrl) {
    return "https://api.dune.com";
  }
  return context.baseUrl;
};

interface DuneProviderProps {
  duneApiKey: string;
  baseUrl?: string;
  children: React.ReactNode;
}

export const DuneProvider = ({
  duneApiKey,
  baseUrl,
  children,
}: DuneProviderProps) => {
  return (
    <DuneContext.Provider value={{ duneApiKey, baseUrl }}>
      {children}
    </DuneContext.Provider>
  );
};

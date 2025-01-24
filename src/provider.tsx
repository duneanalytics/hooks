import React, { createContext, useContext } from "react";

interface DuneContextType {
  duneApiKey?: string;
  proxyUrl?: string;
}

const DuneContext = createContext<DuneContextType>({
  duneApiKey: "",
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

export const useGetProxyUrl = () => {
  const context = useDuneContext();
  return context.proxyUrl;
};

type DuneProviderProps =
  | { duneApiKey: string; proxyUrl?: never; children: React.ReactNode }
  | { duneApiKey?: never; proxyUrl: string; children: React.ReactNode };

export const DuneProvider = (props: DuneProviderProps) => {
  const duneApiKey = "duneApiKey" in props ? props.duneApiKey : undefined;
  const proxyUrl = "proxyUrl" in props ? props.proxyUrl : undefined;

  return (
    <DuneContext.Provider value={{ duneApiKey, proxyUrl }}>
      {props.children}
    </DuneContext.Provider>
  );
};

import React, { createContext, useContext } from "react";

interface SimContextType {
  simApiKey?: string;
  proxyUrl?: string;
}

const SimContext = createContext<SimContextType>({
  simApiKey: "",
});

export const useSimContext = () => {
  const context = useContext(SimContext);
  if (!context) {
    throw new Error("useSimContext must be used within a SimProvider");
  }
  return context;
};

export const useGetApiKey = () => {
  const context = useSimContext();
  return context.simApiKey;
};

export const useGetProxyUrl = () => {
  const context = useSimContext();
  return context.proxyUrl;
};

type SimProviderProps =
  | { simApiKey: string; proxyUrl?: never; children: React.ReactNode }
  | { simApiKey?: never; proxyUrl: string; children: React.ReactNode };

export const SimProvider = (props: SimProviderProps) => {
  const simApiKey = "simApiKey" in props ? props.simApiKey : undefined;
  const proxyUrl = "proxyUrl" in props ? props.proxyUrl : undefined;

  return (
    <SimContext.Provider value={{ simApiKey, proxyUrl }}>
      {props.children}
    </SimContext.Provider>
  );
};

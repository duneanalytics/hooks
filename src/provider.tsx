import { createContext, PropsWithChildren, useContext, useRef } from "react";
import { HttpClient } from "./http";

interface DuneContextType {
  client: HttpClient;
}

const DuneContext = createContext<DuneContextType | undefined>(undefined);

export function useDuneContext() {
  const context = useContext(DuneContext);

  if (!context) {
    throw new Error("useDuneContext must be used within a DuneProvider");
  }

  return context;
}

export function useDuneClient() {
  const context = useDuneContext();
  return context.client;
}

type DuneProviderProps = PropsWithChildren<{
  apiKey: string;
  baseUrl?: string;
}>;

export const DuneProvider = ({
  apiKey,
  baseUrl = "https://api.dune.com/api/echo/v1",
  children,
}: DuneProviderProps) => {
  const clientRef = useRef<HttpClient>();

  if (
    clientRef.current === undefined ||
    clientRef.current.apiKey !== apiKey ||
    clientRef.current.baseUrl !== baseUrl
  ) {
    clientRef.current = new HttpClient(baseUrl, apiKey);
  }

  return (
    <DuneContext.Provider value={{ client: clientRef.current }}>
      {children}
    </DuneContext.Provider>
  );
};

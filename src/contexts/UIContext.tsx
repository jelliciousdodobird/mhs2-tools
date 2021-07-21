import { useTheme } from "@emotion/react";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useMediaQuery } from "react-responsive";

type State = {
  isMobile: boolean;
  sidebarState: boolean;
  setSidebarState: Dispatch<SetStateAction<boolean>>;
  toggleSidebar: () => void;
};

type UIProviderProps = {
  children: React.ReactNode;
};

const UIStateContext = createContext<State | undefined>(undefined);

const UIStateProvider = ({ children }: UIProviderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery({
    query: `(max-width: ${theme.breakpoints.m}px)`,
  });
  const [sidebarState, setSidebarState] = useState<boolean>(true);
  const toggleSidebar = () => setSidebarState((val) => !val);

  return (
    <UIStateContext.Provider
      value={{ isMobile, sidebarState, setSidebarState, toggleSidebar }}
    >
      {children}
    </UIStateContext.Provider>
  );
};

const useUIState = () => {
  const context = useContext(UIStateContext);
  if (context === undefined)
    throw new Error("useUIState must be used within a UIStateProvider");
  return context;
};

export { UIStateProvider, useUIState };

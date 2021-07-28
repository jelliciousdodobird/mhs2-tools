import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const PagePortal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState<Boolean>(false);
  const safeElement = document.getElementById("root") as Element;
  const pageElement = useRef<Element>(safeElement);

  useEffect(() => {
    setMounted(true);
    pageElement.current = document.getElementById("page-container") as Element;
  }, []);

  return mounted
    ? createPortal(
        children,
        pageElement.current ? pageElement.current : safeElement
      )
    : null;
};

export default PagePortal;

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type PagePortalProps = {
  children: React.ReactNode;
  portalId: string;
};

const PagePortal = ({ children, portalId }: PagePortalProps) => {
  const [mounted, setMounted] = useState<Boolean>(false);
  const safeElement = document.getElementById("root") as Element;
  const pageElement = useRef<Element>(safeElement);

  useEffect(() => {
    setMounted(true);
    pageElement.current = document.getElementById(portalId) as Element;
  }, []);

  return mounted
    ? createPortal(
        children,
        pageElement.current ? pageElement.current : safeElement
      )
    : null;
};

export default PagePortal;

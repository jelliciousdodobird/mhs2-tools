import { useState } from "react";

export type DropProps = {
  type: string;
  position: { x: number; y: number };
  data: any;
};

const useDrop = () => {
  const [drop, setDrop] = useState<DropProps>({
    type: "",
    position: { x: 0, y: 0 },
    data: "",
  });

  return { drop, setDrop };
};

export default useDrop;

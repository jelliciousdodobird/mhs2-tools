// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import {
  motion,
  PanInfo,
  useDragControls,
  useMotionValue,
} from "framer-motion";

import {
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

import { useLongPress } from "use-long-press";

import { MonstieGene } from "../utils/ProjectTypes";
import Gene from "./Gene";

const DraggableContainer = styled(motion.div)<{
  bringToFront: boolean;
  size: number | undefined;
}>`
  z-index: ${({ bringToFront }) => (bringToFront ? 99 : 1)};
  position: relative;
  cursor: move;

  /* user-select: none; */
  touch-action: none; // very important line or else long press to drag will not work on mobile

  width: ${({ size }) => (size ? `${size}px` : "100%")};
  height: ${({ size }) => (size ? `${size}px` : "100%")};
  max-width: ${({ size }) => (size ? `${size}px` : "100%")};
  max-height: ${({ size }) => (size ? `${size}px` : "100%")};
  min-width: ${({ size }) => (size ? `${size}px` : "100%")};
  min-height: ${({ size }) => (size ? `${size}px` : "100%")};

  display: flex;
  justify-content: center;
  align-items: center;
`;

const transformString = (
  str: string,
  scrollRef: MutableRefObject<HTMLElement | undefined>
) => {
  const a = str.split("translate3d(");

  if (a.length > 1) {
    const st = scrollRef.current?.scrollTop || 0;

    const b = a[1].indexOf(")"); // 5
    const c = a[1].slice(0, b); // "255px, 443px, 0"
    const d = c.replaceAll("px,", "").split(" "); // ["255", "443", "0"]
    const e = d.map((num) => parseInt(num)); // [255, 443, 0]

    const ogTranslateString = `translate3d(${c})`;

    // const y = e[1] > 0 ? e[1] - st : e[1] + st;
    const y = e[1] - st;

    const newTranslateString = `translate3d(${e[0]}px, ${y}px, ${e[2]}px)`;

    // console.log(ogTranslateString, newTranslateString);

    return str.replace(ogTranslateString, newTranslateString);
  } else return str;
};

type DraggableGeneProps = {
  gene: MonstieGene;
  onDragStart: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => void;
  onDragEnd: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => void;
  bringToFront?: boolean;
  opacity?: number;
  longPressToDrag?: boolean;
  longPressThreshold?: number;
  size?: number;
  layoutIdOn?: boolean;
};

const DraggableGene = ({
  gene,
  onDragStart,
  onDragEnd,
  bringToFront = false,
  opacity = 1,
  longPressToDrag = false,
  longPressThreshold = 200,
  size,
  layoutIdOn = true,
}: DraggableGeneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const scrollRef = useRef<HTMLElement>();

  const [held, setHeld] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // const isDragging = useRef(false);
  // const setIsDragging = (value: boolean) => (isDragging.current = value);

  const shake = held && longPressToDrag;

  const sm = 5; // shake magnitude
  const rs = 0.9; // resize scale

  const animationProps = {
    variants: {
      shake: {
        // backgroundColor: "blue",
        rotate: [0, sm, -sm, sm, -sm, 0],
        scale: [rs, rs, rs, rs, rs, rs],
        transition: {
          // repeatType: "mirror",

          repeat: Infinity,
          repeatType: "mirror" as "mirror",
        },
      },
      noshake: {
        rotate: 0,
        scale: 1,
        borderRadius: 0, // borderRadius is to stop framer motion from distorting this element's border
      },
    },
    initial: "noshake",
    animate: shake ? "shake" : "noshake",
  };

  // const timeRef = useRef<NodeJS.Timeout>(setTimeout(() => {}, 0));

  // const [start, setStart] = useState(0);
  // const [end, setEnd] = useState(0);

  // useEffect(() => {
  //   const elapse = end - start;
  //   console.log("elapsed", elapse);
  //   if (elapse + 1 > longPressThreshold) setHeld(true);
  // }, [end, start]);

  const setDraggable = () => setHeld(true);

  const bind = useLongPress(longPressToDrag ? setDraggable : null, {
    threshold: longPressThreshold,
    cancelOnMovement: true,
  });

  const handleDragStart = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    event.preventDefault();

    setIsDragging(true);
    onDragStart(event, info);
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    event.preventDefault();

    const newInfo = info;
    newInfo.point.y = info.point.y - (scrollRef.current?.scrollTop || 0);

    setHeld(false);
    setIsDragging(false);

    onDragEnd(event, newInfo);

    // if (longPressToDrag) setHeld(false);
  };

  useEffect(() => {
    const scrollElement = document.getElementsByTagName("html")[0];
    scrollRef.current = scrollElement;
  }, []);

  useEffect(() => {
    if (held) containerRef.current?.click();
  }, [held]);

  // useEffect(() => {
  //   return () => {
  //     clearTimeout(timeRef.current);
  //   };
  // }, []);

  return (
    <DraggableContainer
      size={size}
      ref={containerRef}
      onClick={(e) => {
        // console.log("clicked");
        if (held) {
          // console.log("------------moved with drag controls");
          dragControls.start(e, { snapToCursor: true });
        }
      }}
      onContextMenu={(e) => e.preventDefault()}
      {...bind}
      // onTouchStart={(e) => {
      //   console.log("---------touchStart");
      //   setStart(Date.now());

      //   timeRef.current = setTimeout(() => {
      //     setEnd(Date.now());
      //   }, HELD_THRESHOLD);
      // }}
      // onTouchEnd={(e) => {
      //   console.log("----------touchEnd");
      //   clearTimeout(timeRef.current);
      // }}
      // onMouseDown={() => {
      //   console.log("down");
      //   setStart(Date.now());

      //   timeRef.current = setTimeout(() => {
      //     setEnd(Date.now());
      //   }, HELD_THRESHOLD);
      // }}
      // onMouseUp={() => {
      //   console.log("up");
      //   clearTimeout(timeRef.current);
      // }}
      {...animationProps}
      key={gene.geneName}
      layoutId={gene.geneName}
      drag={held || !longPressToDrag}
      dragMomentum={false}
      dragElastic={1}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      bringToFront={bringToFront}
      dragControls={held || !longPressToDrag ? dragControls : undefined}
      style={{ opacity }}
      transformTemplate={(data, str) => {
        // if (isDragging.current === true) {
        if (isDragging) return transformString(str, scrollRef);
        else return str;
      }}
    >
      <Gene gene={gene} size={size} />
    </DraggableContainer>
  );
};

export default DraggableGene;

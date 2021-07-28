// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { motion, PanInfo, useDragControls } from "framer-motion";

import { useEffect, useRef, useState } from "react";

import { useLongPress } from "use-long-press";

import Gene, { MonstieGene } from "./Gene";

const DraggableContainer = styled(motion.div)<{
  bringToFront: boolean;
}>`
  z-index: ${({ bringToFront }) => (bringToFront ? 99 : 1)};
  position: relative;
  cursor: move;
  touch-action: none; // very important line or else long press to drag will not work on mobile

  display: flex;
  justify-content: center;
  align-items: center;
`;

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
}: DraggableGeneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const [held, setHeld] = useState(false);

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
      noshake: { rotate: 0, scale: 1 },
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
    onDragStart(event, info);
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    onDragEnd(event, info);

    setHeld(false);
    // if (longPressToDrag) setHeld(false);
  };

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
      // held={held}
      dragMomentum={false}
      dragElastic={1}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      bringToFront={bringToFront}
      dragControls={dragControls}
      style={{ opacity }}
      // onLayoutAnimationComplete={() => console.log("yo", gene.geneName)}
    >
      <Gene gene={gene} disableSkillPreview={true} size={size} />
    </DraggableContainer>
  );
};

export default DraggableGene;

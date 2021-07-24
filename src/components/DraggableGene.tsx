// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

import { useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import Gene, { MonstieGene } from "./Gene";

const Container = styled(motion.div)`
  cursor: move;
`;

type DraggableGeneProps = {
  gene: MonstieGene;
  draggableType: "gene" | "gene-move";
};

const DraggableGene = ({ gene, draggableType }: DraggableGeneProps) => {
  const [{ isDragging, didDrop }, dragRef, preview] = useDrag(() => ({
    type: draggableType,
    item: gene,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      didDrop: monitor.didDrop(),
    }),
  }));

  const hideGene = draggableType === "gene-move" && isDragging;

  useEffect(() => {
    // must be set or else the both the CustomDragLayer and the default drag preview will be shown
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <Container
      layoutId={gene.geneName}
      ref={dragRef}
      style={{ opacity: hideGene ? 0 : 1, zIndex: 1 }}
      initial={false}
    >
      <Gene gene={gene} />
    </Container>
  );
};

export default DraggableGene;

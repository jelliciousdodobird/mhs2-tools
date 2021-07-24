// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { useEffect, useRef } from "react";

// custom hooks:
import useEfficientDragLayer from "../hooks/useEfficientDragLayer";

// custom components:
import Gene from "./Gene";

const DragLayerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  pointer-events: none;
  z-index: 999;
`;

const Preview = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
`;

const CustomDragLayer = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  const { itemType, isDragging, item, position } = useEfficientDragLayer(
    (monitor) => {
      return {
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        position: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
      };
    }
  );

  const renderItem = () => {
    // console.log("drag layer gene", item);
    switch (itemType) {
      case "gene":
        return <Gene gene={item} />;
      case "gene-move":
        return <Gene gene={item} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (previewRef.current) {
      const { x, y } = position || { x: 0, y: 0 };
      const str = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
      previewRef.current.style.transform = str;
    }
  }, [position]);

  // if not dragging, we do not want to show the drag preview layer:
  if (!isDragging) return null;

  return (
    <DragLayerContainer>
      <Preview ref={previewRef}>{renderItem()}</Preview>
      {/* <Follow position={currentOffset}>{renderItem()}</Follow> */}
    </DragLayerContainer>
  );
};

export default CustomDragLayer;

// export const CustomDragLayer: FC<CustomDragLayerProps> = (props) => {
//   const movableRef = useRef<HTMLDivElement>(null);
//   const { itemType, isDragging, item, initialOffset, currentOffset } =
//     useDragLayer((monitor) => {
//       // console.log("drag layer", monitor.getSourceClientOffset());
//       return {
//         item: monitor.getItem(),
//         itemType: monitor.getItemType(),
//         initialOffset: monitor.getInitialSourceClientOffset(),
//         currentOffset: monitor.getSourceClientOffset(),
//         isDragging: monitor.isDragging(),
//       };
//     });

//   function renderItem() {
//     // console.log(item);

//     switch (itemType) {
//       case "gene":
//         return <BoxDragPreview />;
//       default:
//         return null;
//     }
//   }

//   useEffect(() => {
//     if (movableRef.current)
//       movableRef.current.style.transform = `translate(${currentOffset?.x}px, ${currentOffset?.y}px)`;
//   }, [currentOffset]);

//   if (!isDragging) {
//     return null;
//   }
//   return (
//     <DragLayerContainer>
//       {/* <div style={getItemStyles(initialOffset, currentOffset)}> */}
//       <FollowContainer ref={movableRef}>{renderItem()}</FollowContainer>
//       {/* <Follow position={currentOffset}>{renderItem()}</Follow> */}

//       {/* </div> */}
//     </DragLayerContainer>
//   );
// };

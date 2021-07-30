// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";

// library:
import { useEffect, useRef, useLayoutEffect, RefObject, useState } from "react";
import useResizeObserver from "use-resize-observer/polyfilled";
import { useLongPress } from "use-long-press";

// types:
import {
  AttackType,
  MonstieGene,
  Skill,
  SkillType,
} from "../utils/ProjectTypes";
// import { ElementType } from "./MonstieCard";

// hooks:
import { useUIState } from "../contexts/UIContext";
import { DropProps } from "../hooks/useDrop";

// custom components:
import DraggableGene from "./DraggableGene";
import Gene from "./Gene";
import SearchBar from "./SearchBar";
import TableSearchBar from "./TableSearchBar";

// data:
import DATA from "../utils/output.json";
import { DROP_TYPES } from "../utils/DropTypes";
import { clamp, EMPTY_GENE } from "../utils/utils";
import { AnimatePresence, motion } from "framer-motion";
import Debug from "./Debug";
import usePagination from "../hooks/usePagination";

// icons:
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { GiRoundStar } from "react-icons/gi";
import { ImHeart } from "react-icons/im";
import FlashTooltip from "./FlashTooltip";
import { ElementType } from "../utils/ProjectTypes";

const verticalPadding = 14;

const Container = styled.div<{ height: number; dragging: boolean }>`
  z-index: 500;
  position: absolute;
  bottom: 0;
  left: 0;

  background-color: ${({ theme }) => theme.colors.background.dark};

  /* background-color: red; */

  ${({ dragging }) =>
    dragging
      ? css`
          overflow: hidden;
        `
      : null}

  width: 100%;
  height: ${({ height }) => height}px;
  max-height: ${({ height }) => height}px;

  display: flex;
  flex-direction: column;
`;

const Results = styled(motion.div)`
  /* background-color: blue; */

  position: absolute;
  z-index: 9999;

  top: 3rem;
  left: 0;

  padding: 1rem 0;

  width: 100%;

  flex-wrap: wrap;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GeneContainer = styled.div`
  position: relative;
  padding: 5px;

  /* background-color: red; */
`;

const MeasurementOnlyContainter = styled(GeneContainer)`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
`;

const ShadowItem = styled(GeneContainer)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  opacity: 0.5;
`;

const Controls = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  z-index: 999;

  height: 3rem;
  /* width: 100px; */
  /* background-color: red; */

  display: flex;
  justify-content: center;
  align-items: center;

  p {
    height: 100%;
    padding: 0 1rem;
    /* padding-left: 1rem; */

    /* margin: 0 5px; */
    /* background-color: ${({ theme }) => theme.colors.onSurface.main}; */
    color: ${({ theme }) => theme.colors.error.darker};
    font-weight: 600;

    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const LB = styled.button<{ size?: number }>`
  width: 3rem;
  height: 3rem;

  border-radius: 0;

  background-color: ${({ theme }) => theme.colors.onSurface.dark};

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.main};
    svg {
      path {
        fill: ${({ theme }) => theme.colors.onPrimary.main};
      }
    }
  }

  svg {
    width: ${({ size }) => (size ? `${size}px` : "1.5rem")};
    height: ${({ size }) => (size ? `${size}px` : "1.5rem")};

    path {
      fill: ${({ theme }) => theme.colors.surface.main};
    }
  }
`;

const pageVariants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 500 : -500,
      opacity: 1,
    };
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    };
  },
};

const pageAnimation = {
  variants: pageVariants,
  initial: "enter",
  animate: "center",
  exit: "exit",
  transition: {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
  },
};

const sanitizeGenes = (dirtyGenes: any) => {
  const cleanGenes: MonstieGene[] = [];

  dirtyGenes.forEach((gene: any) => {
    const cleanedGene: MonstieGene = {
      geneName: gene.gene_name,
      geneNumber: gene.gene_number,
      attackType: gene.attack_type ? (gene.attack_type as AttackType) : "",
      elementType: gene.element_type as ElementType,
      requiredLvl: gene.required_lvl,
      geneSize: gene.gene_size,
      skill: {
        skillName: gene.skill.name,
        skillType: gene.skill.type as SkillType,
        desc: gene.skill.desc,
      } as Skill,
      possessedBy: {
        native: gene.possessed_by.native,
        random: gene.possessed_by.random,
      },
    };

    cleanGenes.push(cleanedGene);
  });

  return cleanGenes;
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

type GeneSearchProps = {
  setDrop: React.Dispatch<React.SetStateAction<DropProps>>;
  setDropSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  dropSuccess: boolean;
  rows?: number;
};

const GeneSearch = ({
  setDrop,
  setDropSuccess,
  dropSuccess,
  rows = 2,
}: GeneSearchProps) => {
  const [genes, setGenes] = useState<MonstieGene[]>([]);
  const [searchResults, setSearchResults] = useState<MonstieGene[]>([]);

  const [draggingGene, setDraggingGene] = useState<MonstieGene | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { isMobile } = useUIState();

  // browseMode refers to whether the user is browsing the results by swiping or clicking through the pages
  // browseMode should be set to false when they start dragging a gene else where
  // an overflow: hidden is applied to the Container element depending on the browseMode
  const [browseMode, setBrowseMode] = useState(true);

  // search result pagination:
  const [resultBoxWidth, setResultBoxWidth] = useState(0);
  const [resultItemSize, setResultItemSize] = useState({ w: 100, h: 100 });
  // const [rows, setRows] = useState(3);

  const [resultsPerPage, setResultsPerPage] = useState(20);
  const { pageResult, totalPages, page, nextPage, prevPage } = usePagination(
    searchResults,
    resultsPerPage
  );

  // for measuring:
  const resultContainerRef = useRef<HTMLDivElement>(null);
  const resultItemRef = useRef<HTMLDivElement>(null);
  const {} = useResizeObserver({
    ref: resultContainerRef,
    onResize: (val) => {
      console.log("resize");
      setResultBoxWidth(val.width || 0);
    },
  });

  // DERIVED ATTRIBUTES:
  const searchBarHeight = 3 * 14;
  const componentHeight =
    rows * resultItemSize.h + searchBarHeight + verticalPadding * 2;

  const next = () => {
    setBrowseMode(true);
    nextPage();
  };

  const prev = () => {
    setBrowseMode(true);
    prevPage();
  };

  const isDraggingGene = (gene: MonstieGene) =>
    gene.geneName === draggingGene?.geneName;

  useEffect(() => {
    const dataFromApiCall = DATA.genes;
    const cleanGenes = sanitizeGenes(dataFromApiCall);
    setGenes(cleanGenes);
    setSearchResults(cleanGenes.slice(0, 20));
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (resultItemRef.current) {
      const { width, height } = resultItemRef.current?.getBoundingClientRect();
      setResultItemSize({ w: width, h: height });
    }
  }, []);

  // recalculate pagination parameters:
  useEffect(() => {
    const { w, h } = resultItemSize;
    if (resultContainerRef.current) {
      const { width } = resultContainerRef.current?.getBoundingClientRect();

      const itemsPerPage = Math.floor(width / w) * rows;

      setResultsPerPage(itemsPerPage);
    }
  }, [resultBoxWidth, resultItemSize, rows]);

  /////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (searchTerm === "") setSearchResults(genes);
    else {
      const search = searchTerm.toLowerCase().trim();

      const newResults = genes.filter((val) =>
        val.geneName.toLowerCase().includes(search)
      );
      setSearchResults(newResults);
    }
  }, [searchTerm, genes]);

  const GeneItem = (
    gene: MonstieGene,
    ref: RefObject<HTMLDivElement> | null,
    Container = GeneContainer
  ) => (
    <Container key={gene.geneName} ref={ref}>
      <DraggableGene
        size={90}
        gene={gene}
        onDragStart={() => {
          setDraggingGene(gene);
          setDropSuccess(false);
          setBrowseMode(false);
        }}
        onDragEnd={(_, drag) => {
          setDrop({
            type: DROP_TYPES.GENE_PLACE,
            position: drag.point,
            data: gene,
          });
        }}
        opacity={isDraggingGene(gene) && dropSuccess ? 0 : 1}
        // opacity={isDraggingGene(gene) ? 1 : 0}
        bringToFront={isDraggingGene(gene)}
        // dragOff={browseMode}
        longPressToDrag
      />
      {isDraggingGene(gene) && (
        <ShadowItem>
          <Gene gene={gene} />
        </ShadowItem>
      )}
    </Container>
  );

  const MeasurementGene = GeneItem(
    EMPTY_GENE,
    resultItemRef,
    MeasurementOnlyContainter
  );

  return (
    <Container
      height={componentHeight}
      dragging={browseMode}
      ref={resultContainerRef}
    >
      <TableSearchBar
        value={searchTerm}
        onChange={(e: any) => setSearchTerm(e.target.value)}
        placeholderText="Search for a gene to place.."
        // results={searchResults.length}
      />

      <FlashTooltip text={`Page: ${page.number + 1} of ${totalPages}`} />

      <AnimatePresence initial={false} custom={page.direction}>
        <Results
          key={page.number}
          drag={isMobile ? "x" : false}
          dragElastic={1}
          dragConstraints={{ left: 0, right: 0 }}
          custom={page.direction}
          onDragStart={() => {
            setBrowseMode(true);
          }}
          onDragEnd={(e, info) => {
            const { offset, velocity } = info;
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) next();
            else if (swipe > swipeConfidenceThreshold) prev();
          }}
          {...pageAnimation}
        >
          {MeasurementGene}
          {pageResult
            // .slice(range.start, numberOfResultsShown)
            .map((gene, i) => GeneItem(gene, null))}
        </Results>
      </AnimatePresence>

      <Controls>
        {/* <p>
          {page.number + 1}/{totalPages}
        </p>
        <p>
          {" " + pageResult.length}/{resultsPerPage + " "}
        </p>
        <p>Results: {searchResults.length}</p> */}
        <LB onClick={prev}>
          <MdKeyboardArrowLeft />
        </LB>
        <LB onClick={next}>
          <MdKeyboardArrowRight />
        </LB>
        <LB onClick={next} size={16}>
          <ImHeart />
        </LB>
      </Controls>
    </Container>
  );
};

export default GeneSearch;

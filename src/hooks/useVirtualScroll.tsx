import { useEffect, useState } from "react";
import useResizeObserver from "use-resize-observer/polyfilled";

const DEFAULT_ITEM_PROPS = {
  itemPadding: 0,
  itemsPerRow: 1,
  overscan: 2,
};

interface Options<T> {
  list: T[];
  listContainerRef: React.RefObject<HTMLElement>;
  itemHeight: number;

  itemPadding?: number;
  itemsPerRow?: number;
  overscan?: number;
}

const useVirtualScroll = <T,>(options: Options<T>) => {
  const {
    list,
    listContainerRef,
    itemHeight,
    itemPadding,
    itemsPerRow,
    overscan,
  } = {
    ...DEFAULT_ITEM_PROPS,
    ...options,
  };

  const [scrollPosition, setScrollPosition] = useState(0);
  const { width = 0, height = 0 } = useResizeObserver({
    ref: window.document.documentElement,
  });

  const listY = listContainerRef.current?.getBoundingClientRect().top || 0;

  // position of the list container relative to scroll container (NOT the viewport container)
  // when you add these two values you get the height of ALL the content ABOVE the list container
  // without having to reference any dom elements, most of which we wont have access to
  const extraContentHeight = window.document.documentElement.scrollTop + listY;

  // DERVIDED STATE:
  const totalItemHeight = itemHeight + itemPadding;
  const numberOfRows = Math.ceil(list.length / itemsPerRow);
  const listHeight = totalItemHeight * numberOfRows - itemPadding;
  const rowStart = Math.max(
    0, // ensures that we get an index of atleast 0
    Math.floor((scrollPosition - extraContentHeight) / totalItemHeight)
  );

  const rowEnd = Math.max(
    0, //  ensures that we get atleast an index of 0 in the case that:
    // scrollTop + height < extraContentHeight
    Math.min(
      list.length, // don't render past the end of the list
      Math.floor(
        (scrollPosition + window.innerHeight - extraContentHeight) /
          totalItemHeight
      ) + overscan
    )
  );

  const renderList = list.slice(rowStart * itemsPerRow, rowEnd * itemsPerRow);
  const blankHeight = rowStart * totalItemHeight;

  useEffect(() => {
    const setScrollTop = () => {
      setScrollPosition(window.document.documentElement.scrollTop);
    };

    window.addEventListener("scroll", setScrollTop);

    return () => {
      window.removeEventListener("scroll", setScrollTop);
    };
  }, []);

  return {
    listHeight,
    renderList,
    blankHeight,
  };
};

export default useVirtualScroll;

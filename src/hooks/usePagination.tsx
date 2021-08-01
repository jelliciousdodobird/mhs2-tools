import { useEffect } from "react";
import { useState } from "react";

export type PaginationProps<T> = {
  data: Array<T>;
  resultsPerPage: number;
};

const INITIAL_PAGE = { number: 0, direction: 0 };

function usePagination<T>(data: Array<T>, resultsPerPage: number) {
  const totalPages = Math.ceil(data.length / resultsPerPage);

  const [page, setPage] = useState(INITIAL_PAGE);

  const start = page.number * resultsPerPage;
  const end = start + resultsPerPage;
  const pageResult = data.slice(start, end);

  const nextPage = () =>
    setPage((p) => ({
      number: Math.min(p.number + 1, totalPages - 1),
      direction: 1,
    }));
  const prevPage = () =>
    setPage((p) => ({ number: Math.max(p.number - 1, 0), direction: -1 }));
  // const nextPage = () => setPage((p) => (p + 1 < numberOfPages ? p + 1 : p));
  // const prevPage = () => setPage((p) => (p - 1 >= 0 ? p - 1 : p));
  const resetPage = () => setPage(INITIAL_PAGE);

  useEffect(() => {
    resetPage();
  }, [data, resultsPerPage]);

  return { page, totalPages, pageResult, nextPage, prevPage };
}

export default usePagination;

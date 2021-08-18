import { useCallback, useEffect, useMemo, useState } from "react";
import ThemeToggle from "../components/ThemeToggle";

export type OrderType = "ascend" | "descend" | "none";

export interface SortType {
  key: string;
  orderType: OrderType;
}

export interface Column {
  key: string;
  label: string;
  width: number;
  format: ((value: any) => any) | null;
  sorted: OrderType;
  desc: string;
}

export type ColumnProps = Partial<Column> & Pick<Column, "key">;

export interface InputData<Type> {
  [key: string]: Type;
}

export interface TableProps<T> {
  data: T[];
  column: ColumnProps[];
  defaultColumnWidth?: number;
}

const sortFn = (sortType: SortType) => {
  const { key, orderType } = sortType;
  let order = 1;

  if (orderType === "ascend") order = -1;

  return (a: any, b: any) => {
    const x: any = a[key];
    const y: any = b[key];

    if (x > y) return order;
    else if (x < y) return -order;
    else return 0;
  };
};

const useTable = <T,>(
  data: T[],
  column: ColumnProps[],
  defaultColumnWidth = 150
) => {
  const addDefaultValues = useCallback(
    (objs: ColumnProps[]): Column[] => {
      const columns: Column[] = objs.map(
        ({ key, label, width, format, desc }) => ({
          key,
          label: label ? label : key,
          width: width ? width : defaultColumnWidth,
          format: format ? format : null,
          sorted: "none",
          desc: desc ? desc : "",
        })
      ) as Column[];

      return columns;
    },
    [defaultColumnWidth]
  );

  // transformations to be done on original data:
  const [filter, setFilter] = useState("");
  const [sorts, setSorts] = useState<SortType[] | []>([]);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [shiftHeld, setShiftHeld] = useState(false);

  // normalized data (known as original data):
  // represents the data with 0 transformations applied:
  // never change ogColumnAttrs in a function; meant to be a copy of the original for referencing
  // the only time it should change is if the prop 'column' has changed
  const [normalizedColumn, setNormalizedColumn] = useState(
    addDefaultValues(column)
  );
  const [normalizedData, setNormalizedData] = useState(data);

  // represents the data that the user will get back (transformed data):
  const [columnAttrs, setColumnAttrs] = useState(normalizedColumn);
  const [tableData, setTableData] = useState(normalizedData);

  const formatTableData = (data: any[], columnAttrs: Column[]) => {
    return data.map((row) => {
      const newRow = { ...row };
      // const formattedRow = { ...row };
      columnAttrs.forEach(({ key, format }) => {
        if (format) newRow[key] = format(newRow[key]);
      });

      return newRow;
    });
  };

  const advanceSortType = (orderType: OrderType | undefined) => {
    if (orderType === "ascend") return "none";
    else if (orderType === "descend") return "ascend";
    else return "descend";
  };

  /**
   * Reorders the columns based on some inputs.
   * @param targetKey represents the key of the column that will move to the new position.
   * @param newPosition represents the the new position that the column will end up in.
   */
  const changeColumnOrder = (targetKey: string, newPosition: number) => {
    const targetIndex = columnAttrs.findIndex(({ key }) => key === targetKey);

    if (targetIndex === -1) return;

    const targetColumn = columnAttrs[targetIndex];

    const arrayWithDeletedTarget = [
      ...columnAttrs.slice(0, targetIndex),
      ...columnAttrs.slice(targetIndex + 1, columnAttrs.length),
    ];

    setColumnAttrs([
      ...arrayWithDeletedTarget.slice(0, newPosition),
      targetColumn,
      ...arrayWithDeletedTarget.slice(
        newPosition,
        arrayWithDeletedTarget.length
      ),
    ]);
  };

  const showColumn = (key: string) => {
    setHiddenColumns((keys) => [...new Set([...keys, key])]);
  };

  const hideColumn = (key: string) => {
    setHiddenColumns((keys) => keys.filter((k) => k !== key));
  };

  const toggleColumn = (key: string) => {
    setHiddenColumns((val) =>
      val.includes(key)
        ? val.filter((hiddenKey) => hiddenKey !== key)
        : [...val, key]
    );
  };

  /**
   * Applies sorts based on multiple 'columns' or keys. The sorts get
   * applied such that the key that calls this function first has the
   * most "effect" or precedence.
   * @param key represents the key of the 'column' to sort.
   * @param reverse you can reverse the precedence of the sorts.
   */
  const toggleMultiSort = useCallback((key: string, reverse = false) => {
    setSorts((currSorts) => {
      const index = currSorts.findIndex((sortType) => sortType.key === key);

      if (index !== -1) {
        const orderType = advanceSortType(currSorts[index].orderType);
        return orderType === "none"
          ? [
              ...currSorts.slice(0, index),
              ...currSorts.slice(index + 1, currSorts.length),
            ]
          : (currSorts.map((sort: SortType) =>
              sort.key === key ? { key, orderType } : sort
            ) as SortType[]);
      } else return [{ key, orderType: "descend" }, ...currSorts];
    });
    // setColumnAttrs((currCols) => {
    //   return currCols.map((col) =>
    //     col.key === key
    //       ? { ...col, sorted: advanceSortType(col.sorted) }
    //       : { ...col, sorted: "none" }
    //   );
    // });
  }, []);

  /**
   * Applies a sort based on only one column or key at a time.
   * @param key represents the key of the 'column' to sort.
   */
  const toggleSort = useCallback((key: string) => {
    setSorts((currSorts) => {
      const index = currSorts.findIndex((sortType) => sortType.key === key);

      if (index !== -1) {
        const orderType = advanceSortType(currSorts[index].orderType);
        return orderType === "none" ? [] : [{ key, orderType }];
      } else return [{ key, orderType: "descend" }];
    });

    // setColumnAttrs((currCols) => {
    //   return currCols.map((col) =>
    //     col.key === key
    //       ? { ...col, sorted: advanceSortType(col.sorted) }
    //       : { ...col, sorted: "none" }
    //   );
    // });
  }, []);

  /**
   *
   * @param key represents the key of the 'column' to sort
   */
  const toggleShiftSort = useCallback(
    (key: string) => {
      if (shiftHeld) toggleMultiSort(key);
      else toggleSort(key);
    },
    [shiftHeld, toggleMultiSort, toggleSort]
  );

  const filterData = (value: string) => {
    setFilter(value);
  };

  const applySorts = (sorts: SortType[], data: T[]) => {
    sorts.forEach((sortType) => {
      const sortFunction = sortFn(sortType);
      data.sort(sortFunction);
    });
  };

  const applyFilter = (keyword: string, data: T[]) => {
    keyword = keyword.toLowerCase();
    return data.filter((values) => {
      if (keyword === "") return true;

      const stuffs = Object.values(values);
      let has = false;

      stuffs.forEach((v: any) => {
        if (v.toString().toLowerCase().includes(keyword)) {
          has = true;
          return true;
        }
      });

      return has;
    });
  };

  const applyHiddenColumns = (hiddenColumns: string[], columnAttrs: Column[]) =>
    columnAttrs.filter((col) => !hiddenColumns.includes(col.key));

  const applySortInfoOnColumns = (
    columnAttrs: Column[],
    sorts: SortType[]
  ): Column[] => {
    const sortMap = new Map(
      sorts.map(({ key, orderType }) => [key, orderType])
    );

    return columnAttrs.map((col) =>
      sortMap.has(col.key)
        ? { ...col, sorted: sortMap.get(col.key) as OrderType }
        : col
    );
  };

  useEffect(() => {
    const setShiftHeldValue = (e: KeyboardEvent, value: boolean) => {
      if (e.key === "Shift") setShiftHeld(value);
    };

    const on = (e: KeyboardEvent): void => setShiftHeldValue(e, true);
    const off = (e: KeyboardEvent): void => setShiftHeldValue(e, false);

    window.addEventListener("keydown", on);
    window.addEventListener("keyup", off);

    return () => {
      window.removeEventListener("keydown", on);
      window.removeEventListener("keyup", off);
    };
  }, []);

  useEffect(() => {
    // console.log("data, ogColumnAttrs");
    setNormalizedData(formatTableData(data, normalizedColumn));
  }, [data, normalizedColumn]);

  useEffect(() => {
    // console.log("column, addDefaultValues");
    setNormalizedColumn(addDefaultValues(column));
  }, [column, addDefaultValues]);

  useEffect(() => {
    // console.log("ogColumnAttrs, hiddenColumns, sorts");
    const hiddenColumnAttrs = applyHiddenColumns(
      hiddenColumns,
      normalizedColumn
    );
    const hiddenPlusSortedColumnAttrs = applySortInfoOnColumns(
      hiddenColumnAttrs,
      sorts
    );

    setColumnAttrs(hiddenPlusSortedColumnAttrs);
  }, [normalizedColumn, hiddenColumns, sorts]);

  useEffect(() => {
    // console.log("sorts, filter, ogTableData");
    const filteredData = applyFilter(filter, normalizedData);
    applySorts(sorts, filteredData); // sorts in place
    setTableData(filteredData);
  }, [sorts, filter, normalizedData]);

  return {
    columnAttrs,
    setColumnAttrs,
    tableData,
    setTableData,
    sorts,
    hiddenColumns,
    setSorts,
    changeColumnOrder,
    toggleMultiSort,
    toggleSort,
    toggleShiftSort,
    shiftHeld,
    filterData,
    showColumn,
    hideColumn,
    toggleColumn,
  };
};

export default useTable;

import React, { useEffect, useMemo, useState } from "react";
import { IColumn } from "../entities/Column/IColumn";
import store from "../utils/store";

const ColumnsContext = React.createContext<
  [IColumn[], React.Dispatch<React.SetStateAction<IColumn[]>>] | []
>([]);

export const useColumns = () => {
  const context = React.useContext(ColumnsContext);
  if (context === undefined) {
    throw new Error("useColumns must be used within a ColumnsProvider");
  }
  return context;
};

export const ColumnsProvider = (props: any) => {
  const [columns, setColumns] = useState<IColumn[]>([]);

  useEffect(() => {
    setColumns(store.getColumns());
  }, []);

  const value = useMemo(() => [columns, setColumns], [columns]);
  return <ColumnsContext.Provider value={value} {...props} />;
};
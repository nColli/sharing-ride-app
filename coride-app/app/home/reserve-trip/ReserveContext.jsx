import { createContext, useContext, useState } from "react";

const ReserveContext = createContext();

export default function ReserveProvider({ children }) {
  const [reserve, setReserve] = useState(null);

  return (
    <ReserveContext.Provider value={{ reserve, setReserve }}>
      {children}
    </ReserveContext.Provider>
  );
}

export function useReserve() {
  return useContext(ReserveContext);
}

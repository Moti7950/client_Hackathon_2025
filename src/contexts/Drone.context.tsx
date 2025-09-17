import React, { createContext, useContext, useState } from "react";

export type Coordinate = [number, number];

type DroneCtx = {
  dronePosition: Coordinate;
  setDronePosition: (pos: Coordinate) => void;
};

const DroneContext = createContext<DroneCtx | undefined>(undefined);

export const DroneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dronePosition, setDronePosition] = useState<Coordinate>([31.328623, 34.327602]);
  return (
    <DroneContext.Provider value={{ dronePosition, setDronePosition }}>
      {children}
    </DroneContext.Provider>
  );
};

export const useDrone = () => {
  const ctx = useContext(DroneContext);
  if (!ctx) throw new Error("useDrone must be used within DroneProvider");
  return ctx;
};

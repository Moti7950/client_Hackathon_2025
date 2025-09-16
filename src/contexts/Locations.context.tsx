import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import type { location } from "../types/location";

type LocationsContextType = {
  locations: location[];
  setLocations: Dispatch<SetStateAction<location[]>>;
};

export const LocationsContext = createContext<LocationsContextType | null>(
  null
);

function LocationsProvider({ children }: PropsWithChildren) {
  const [locations, setLocations] = useState<location[]>([]);
  return (
    <LocationsContext.Provider
      value={{ locations: locations, setLocations: setLocations }}
    >
      {children}
    </LocationsContext.Provider>
  );
}

export function useLocations() {
  const context = useContext(LocationsContext);
  if (!context) {
    throw new Error("useLocations must be used within a LocationsProvider");
  }
  return context;
}

export default LocationsProvider;

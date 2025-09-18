import {
  createContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

export const RoleContext = createContext<RoleContextType | null>(null);

type RoleContextType = {
  role: string;
  setRole: Dispatch<SetStateAction<string>>;
};

function RoleProvider({ children }: PropsWithChildren) {
  const [role, setRole] = useState<string>("chaim");
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}
export default RoleProvider;

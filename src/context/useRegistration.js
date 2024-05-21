
import { createContext, useContext} from "react";


export const RegistrationContext = createContext();

export const useRegistration = () => useContext(RegistrationContext);
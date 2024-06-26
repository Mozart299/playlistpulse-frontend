import { createContext, useContext, useReducer, ReactNode } from "react"

export const StateContext = createContext<any>(null);

export const StateProvider = ({children, initialState, reducer}: {children: ReactNode, initialState: any, reducer: any}) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
);

export const useStateProvider = () => useContext(StateContext);


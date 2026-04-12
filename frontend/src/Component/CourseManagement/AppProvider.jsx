import { createContext, useContext, useState, useEffect } from "react";


const AppContext = createContext(null);

export const AppProvider = ({children})=>{

    const [user, setUser] = useState(null)
    useEffect(()=>{
        const storeduser= localStorage.getItem("user");
        if(storeduser){
            setUser(JSON.parse(storeduser));
        }

    }, []);

    return (
        <AppContext.Provider value={{user, setUser}}>
            {children}

        </AppContext.Provider>
    )

};

export const useAppContext = ()=>{
    return useContext(AppContext);
}
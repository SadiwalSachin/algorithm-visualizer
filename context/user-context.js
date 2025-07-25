"use client"

import { createContext, useContext, useEffect, useState } from "react";

const userAuthContext = createContext({});

export const UserAuthContextProvider = ({children}) => {

    const [isLoggedIn,setIsLoggedIn] = useState(false)

    useEffect(()=>{
        const token = localStorage.getItem("token")
        if(token) setIsLoggedIn(true)
    },[])

  return <userAuthContext.Provider value={{isLoggedIn,setIsLoggedIn}}>
    {children}
  </userAuthContext.Provider>;
};

export const useAuth =()=> useContext(userAuthContext)

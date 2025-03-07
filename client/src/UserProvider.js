import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({children}) =>
{
    const [user, setUser] = useState({
        profile: null,
        quizResponse: null,
    });

    return (
        <UserContext.Provider value={{ user, setUser}}>
            {children};
        </UserContext.Provider>
    )
}
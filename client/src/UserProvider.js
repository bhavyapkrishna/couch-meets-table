import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({children}) =>
{
    const [user, setUser] = useState({
        profile: {},
        quizResponse: [],
    });

    return (
        <UserContext.Provider value={{ user, setUser}}>
            {children};
        </UserContext.Provider>
    )
}
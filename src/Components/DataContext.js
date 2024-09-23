// DataContext.js

import React, { createContext, useState, useContext } from "react";

const DataContext = createContext();

// Custom hook to access the context
export const useData = () => {
    return useContext(DataContext);
}

export const DataProvider = ({ children }) => {
    const [fightData, setFightData] = useState({
        fighterA: "",
        fighterB: "",
        roundScores: [],
        outcome: "",
        fighterATotalScore: 0,
        fighterBTotalScore: 0
    });

    // Log changes whenever setFightData is called
    const logSetFightData = (newFightData) => {
        console.log("Updating fightData:", newFightData); // Log the update
        setFightData(newFightData); // Call the original setFightData
    };


    return (
        <DataContext.Provider value={{ fightData, setFightData, logSetFightData }}>
            {children}
        </DataContext.Provider>
    );
}
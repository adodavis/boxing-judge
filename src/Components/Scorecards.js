// Scorecards.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "./DataContext";
import { ReactComponent as SearchIcon } from "./search-icon.svg"
import { ReactComponent as ImportExportIcon } from "./import-export-icon.svg"
import ChampionshipIcon from "./championship-icon.png"
import "../App.css";

const ResultDisplay = ({ totalScoreA, totalScoreB, outcome, roundScores, rounds }) => {
    // Check if all rounds have been scored
    const allRoundsScored = roundScores.length === parseInt(rounds, 10) && 
        roundScores.every(round => round.fighterA !== 0 && round.fighterB !== 0);

    
    if (["KO", "TKO", "RTD", "TD", "DQ", "NC"].includes(outcome)) {
            return (
                <div>
                    <p>Result: {outcome}</p>
                </div>
            );
    }
    else if (allRoundsScored) {
            return (
                <div>
                    <p>Result: {`${totalScoreA}-${totalScoreB}`}</p>
                </div>
            );
    }
}

const ChampionshipDisplay = ({ isChampionship }) => {
    if (isChampionship === "true")
    {
        return (
            <span>
                <img src={ChampionshipIcon} alt="Championship" className="championship-icon" />
            </span>
        );
    }
    return null;
}

const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day  = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
} 

function Scorecards() {
    const { fightData, setFightData } = useData(); // Use setFightData to set the selected fight data
    const [scorecards, setScorecards] = useState([]);
    const [fighterA, setFighterA] = useState('');
    const [fighterB, setFighterB] = useState('');
    const [rounds, setRounds] = useState('');
    const [date, setDate] = useState(getCurrentDate());
    const [showAddFightPopup, setShowAddFightPopup] = useState(false);
    const [showSearchBar, setshowSearchBar] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [championship, setChampionship] = useState('');
    const [showLoadSavePopup, setShowLoadSavePopup] = useState(false);
    const navigate = useNavigate();

    // Load scorecards from localStorage when the component mounts
    useEffect(() => {
        const savedScorecards = localStorage.getItem('scorecards');
        
        if (savedScorecards) {
            setScorecards(JSON.parse(savedScorecards));
        }
        else {
            setScorecards([]);
        }
    }, []);

    // Save scorecards to localStorage whenever the list changes
    useEffect(() => {
        if (scorecards.length > 0) {
            localStorage.setItem('scorecards', JSON.stringify(scorecards));
        }
    }, [scorecards]);

    useEffect(() => {
        if (fightData && fightData.id) {
            setScorecards(prevScorecards => {
                if (!prevScorecards.some(fight => fight.id === fightData.id)) {
                    return [...prevScorecards, fightData];
                }
                return prevScorecards;
            });
        }
    }, [fightData]);

    useEffect(() => {
        // Check if the fightData has a valid ID and if it exists in the scorecards
        if (fightData.id) {
            setScorecards((prevScorecards) => {
                const index = prevScorecards.findIndex((card) => card.id === fightData.id);

                if (index !== -1) {
                    // Update the existing scorecard in the array
                    const updatedScorecards = [...prevScorecards];
                    updatedScorecards[index] = {
                        ...prevScorecards[index],
                        fighterATotalScore: fightData.fighterATotalScore,
                        fighterBTotalScore: fightData.fighterBTotalScore,
                        roundScores: fightData.roundScores,
                        outcome: fightData.outcome
                    };
                    return updatedScorecards;
                }
                else {
                    // No matching fightData found, return the existing scorecards without changes
                    return prevScorecards;
                }
            });
        }
    }, [fightData]);    // Run whenever fightData changes

    const handleFightData = () => {
        setShowLoadSavePopup(true);
    }

    const handleExport = () => {
        const data = JSON.stringify(scorecards, null , 2);  // Convert scorecards to JSON with indentation
        const blob = new Blob([data], {type: 'application/json'});  // Create a Blob object from the dat
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a'); // Create a hidden <a> element
        link.href = url;
        link.download = 'scorcards.json';   // File name for download
        link.click(); // Trigger download

        window.URL.revokeObjectURL(url); // Clean up URL object
    };

    const handleImport = (event) => {
        const file = event.target.files[0]; //Get the selected file

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result); // Parse the JSON data
                    // Validate or process the imported data
                    setScorecards((prevScorecards) => [...prevScorecards, ...(Array.isArray(importedData) ? importedData: [importedData])]); // Update scorecards state with the appended data
                    console.log('Imported scorecards:', importedData);
                }
                catch (error) {
                    console.error('Error parsing the imported file:', error);
                }
            };

            reader.readAsText(file); // Read the file as text
        }
    };

    const triggerFileInput = () => {
        document.getElementById('file-input').click(); // Trigger a click on the hidden file input
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!fighterA || !fighterB || !rounds || !date) {
            alert('Please enter all fields');
            return;
        }

        setShowAddFightPopup(false);

        const id = Date.now().toString(); // Generate a unique ID using the current timestamp
        const initialRoundScores = Array.from({ length: rounds }, () => ({ fighterA: 0, fighterB: 0 }));

        setFightData(prevFightData => ({
            ...prevFightData,   // Ensure to not overwrite other fields in fightData
            id,
            fighterA,
            fighterB,
            rounds,
            date,
            championship,
            outcome: '',    // Initialize outcome for empty now
            roundScores: initialRoundScores, // Prepare for future score integration
            fighterATotalScore: 0,
            fighterBTotalScore: 0,
        }));

        // Clear input fields
        setFighterA('');
        setFighterB('');
        setRounds('');
        setDate('');
        setChampionship('');
    }

    const scorecardView = (card) => {
        setFightData(card); // Set the current fight data before navigating
        navigate('/scorecard');
    }

    const deleteScorecard = (id) => {
        const updatedScorecards = scorecards.filter(card => card.id !== id);
        setScorecards(updatedScorecards);
        localStorage.setItem('scorecards', JSON.stringify(updatedScorecards));  // Convert local storage to string for web server
        localStorage.removeItem(`fight-${id}`); // Remove associated fight data
    }

    // Filter the scorecards based on the search term
    const filteredScorecards = scorecards.filter(card =>
        card.fighterA.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.fighterB.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="scorecards-list">
            <div className="app-title-container">
                <h1>Sweet Science Judge</h1>
            </div>

            {/* Export button */}
            <button onClick={handleFightData} className="import-export-btn">
                <ImportExportIcon  />
            </button>

            {/* Load or save scorecaards */}
            { showLoadSavePopup && (
                <div className="load-save-fight-popup">
                    <h2>Import/Export Scorecards</h2>
                    <button className="import-btn" onClick={triggerFileInput}>Import Scorecards</button>
                    <input
                        id="file-input"
                        type="file"
                        accept=".json"
                        style= { {display: "none"} } // Hide the file input
                        onChange={handleImport}
                    />
                    <button className="export-btn" onClick={handleExport}>Export Scorecards</button>
                    <button 
                        className="load-save-close-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowLoadSavePopup(false);
                        }}
                    >
                        X
                    </button>
                </div>
            )}

             {/*Search section */}
             <div className="search-container">
                    {/* Search button */}
                    <button 
                    onClick={() => setshowSearchBar(!showSearchBar)} 
                    className="search-btn"
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.7)}
                    >
                        <SearchIcon style={{ width: '24px', height: '24px', fill: 'currentColor'}} />
                    </button>

                    {/* Conditionally render the search bar */}
                    {showSearchBar && (
                        <input
                            type="text"
                            placeholder="Search by fighter name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    )}
                </div>

            {filteredScorecards.length > 0 ? (
                filteredScorecards.map((card, index) => (
                    <div key={index} className="scorecard-item">
                        <div onClick={() => scorecardView(card)} className="scorecard-box-container">
                            <div className="fighters-container">
                                <p>{card.fighterA} vs. {card.fighterB}</p>
                                <ChampionshipDisplay isChampionship={card.championship} />
                            </div>
                            <div className="rounds-container">
                                <p>{card.rounds} Rounds</p>
                            </div>
                            <div className="date-container">
                                <p>{card.date}</p>
                            </div>
                            {/*Display result if available */}
                            <div className="result-container">
                                <ResultDisplay 
                                    totalScoreA={card.fighterATotalScore}
                                    totalScoreB={card.fighterBTotalScore}
                                    outcome={card.outcome}
                                    roundScores={card.roundScores}
                                    rounds={card.rounds}
                                />
                            </div>
                            <button onClick={(event) => {
                                event.stopPropagation(); // Prevents the click from bubbling up
                                deleteScorecard(card.id);
                            }} 
                                className="delete-scorecard-container"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p style={{ color: 'white'}}>No scorecards available.</p>
            )}
            <div className="add-fight-btn">
                <button onClick={() => setShowAddFightPopup(true)}>+</button>
            </div>

            {showAddFightPopup && (
                <div className="add-fight-form">
                    <form onSubmit={handleSubmit}>
                        <h2>Add New Fight</h2>
                        <button  
                            className="add-fight-form-close-btn" 
                            onClick={(e) =>  {
                                e.preventDefault();
                                setShowAddFightPopup(false)
                            }}
                        >
                            X
                        </button>
                        <input value={fighterA} onChange={(e) => setFighterA(e.target.value)} placeholder="Fighter A" />
                        <br />
                        <input value={fighterB} onChange={(e) => setFighterB(e.target.value)} placeholder="Fighter B" />
                        <br />
                        <div className="add-fight-form-champ-container">
                            <select value={championship} onChange={(e) => setChampionship(e.target.value)} >
                                <option value="">Championship Fight?</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                        <div className="add-fight-form-rds-container">
                            <select value={rounds} onChange={(e) => setRounds(e.target.value)} >
                            <option value="">Number of rounds</option>
                            <option value="4">4</option>
                            <option value="6">6</option>
                            <option value="8">8</option>
                            <option value="10">10</option>
                            <option value="12">12</option>
                            <option value="15">15</option>
                            </select>
                        </div>
                        <div className="add-fight-form-date-container">
                            <input value={date} onChange={(e) => setDate(e.target.value)} type="date" />
                        </div>
                        <div className="add-fight-form-submit-btn">
                            <button type="submit">Add Fight</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Scorecards;

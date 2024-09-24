// Scorecard.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "./DataContext";
import { ReactComponent as NoteIcon }  from './note-icon.svg'
import "../App.css";

const ScoreInput = ({ fighterName, score, onScoreChange, roundIndex }) => (
    <label>
        <select value={score} onChange={(e) => onScoreChange(roundIndex, fighterName, Number(e.target.value))}>
            <option value="">-</option>
            <option value="10">10</option>
            <option value="9">9</option>
            <option value="8">8</option>
            <option value="7">7</option>
            <option value="6">6</option>
        </select>
    </label>
);

const NoteButton = ({ onOpenNoteForm }) => (
    <button 
        className="note-button"
        onClick={onOpenNoteForm}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.5)}
        >
            <NoteIcon style={{ width: '24px', height: '24px', fill: 'currentColor' }} />
    </button>
);

const CloseRoundButton = ({ isClose, onToggleClose, roundIndex }) => (
    <button
        className="close-round-button"
        onClick={() => onToggleClose(roundIndex)}
        style={{ backgroundColor: isClose ? 'red': 'gray', color: 'white',
                 opacity: isClose ? 0.8 : 0.1
        }}
    > 
        {isClose ? 'Close': '-'}
    </button>
);

function Scorecard() {
   const { fightData, setFightData } = useData();
   const fighterA = fightData.fighterA;
   const fighterB = fightData.fighterB;
   const roundScores = fightData.roundScores;
   const fighterATotalScore = fightData.fighterATotalScore;
   const fighterBTotalScore = fightData.fighterBTotalScore;
   const outcome = fightData.outcome;
   const [roundNotes, setRoundNotes] = useState([]);
   const [roundClose, setRoundClose] = useState([]);
   const [showNotePopup, setShowNotePopup] = useState(false);
   const [currentRoundIndex, setCurrentRoundIndex] = useState(null);
   const [noteInputValue, setNoteInputValue] = useState("");
   const [showOutcomePopup, setShowOutcomePopup] = useState(false);
   const [showWinnerPopup, setShowWinnerPopup] = useState(false);
   const [selectedWinner, setSelectedWinner] = useState('');
   const [winnerDisplay, setWinnerDisplay] = useState('');
   const navigate = useNavigate();

   useEffect(() => {
       if (fightData.id && fightData.rounds) {
           const savedScores = localStorage.getItem(`fight-${fightData.id}-scores`);
           const savedNotes = localStorage.getItem(`fight-${fightData.id}-notes`);
           const savedCloseRounds = localStorage.getItem(`fight-${fightData.id}-close`);
           const savedWinner = localStorage.getItem(`fight-${fightData.id}-winner`);
           const savedWinnerDisplay = localStorage.getItem(`fight-${fightData.id}-winnerDisplay`);
           const savedOutcome = localStorage.getItem(`fight-${fightData.id}-outcome`);
           
           if (savedScores && JSON.parse(savedScores).length > 0) {
               setFightData(prev => ({
                    ...prev,
                    roundScores: JSON.parse(savedScores)
               }));
           } else {
               setFightData(prev => ({
                    ...prev,
                    roundScores: Array.from({ length: parseInt(fightData.rounds, 10) }, () => ({ fighterA: 0, fighterB: 0 }))
               }));
           }

           if (savedNotes && JSON.parse(savedNotes).length > 0) {
               setRoundNotes(JSON.parse(savedNotes));
           } else {
               setRoundNotes(Array.from({ length: parseInt(fightData.rounds, 10) }, () => ''));
           }

           if (savedCloseRounds && JSON.parse(savedCloseRounds).length > 0) {
               setRoundClose(JSON.parse(savedCloseRounds));
           } else {
               setRoundClose(Array.from({ length: parseInt(fightData.rounds, 10) }, () => false));
           }

        // On component mount, load winner and winnerDisplay from localStorage
        if (savedWinner) {
            setSelectedWinner(JSON.parse(savedWinner));
        }
        
        if (savedWinnerDisplay) {
            setWinnerDisplay(JSON.parse(savedWinnerDisplay));
        }

        if (savedOutcome) {
            setFightData(prev => ({
                ...prev,
                outcome: savedOutcome
            }));
        }
       }
   }, [fightData.id, fightData.rounds, setFightData]);

   useEffect(() => {
       if (fightData && fightData.id && roundScores.length > 0 && roundNotes.length > 0 && roundClose.length > 0) {
           localStorage.setItem(`fight-${fightData.id}-scores`, JSON.stringify(roundScores));
           localStorage.setItem(`fight-${fightData.id}-notes`, JSON.stringify(roundNotes));
           localStorage.setItem(`fight-${fightData.id}-close`, JSON.stringify(roundClose));
           localStorage.setItem(`fight-${fightData.id}-winner`, JSON.stringify(selectedWinner));
           localStorage.setItem(`fight-${fightData.id}-winnerDisplay`, JSON.stringify(winnerDisplay));
       }
   }, [roundScores, roundNotes, roundClose, selectedWinner, winnerDisplay, fightData]);

   useEffect(() => {
       if (roundScores.length > 0) {
        const totalScoreA = roundScores.reduce((acc, round) => acc + round.fighterA, 0);
        const totalScoreB = roundScores.reduce((acc, round) => acc + round.fighterB, 0);

        // Update fightData with the latest total scores
            setFightData(prev => ({
            ...prev,
            fighterATotalScore: totalScoreA,
            fighterBTotalScore: totalScoreB
            }));
       }        
   }, [roundScores, setFightData]);     // Ensure this runs whenever roundScores change

   const handleScoreChange = (roundIndex, fighter, score) => {
        const updatedScores = [...roundScores];

        // Update the existing key for the specific fighter
        if (fighter === fighterA) {
            updatedScores[roundIndex] = {...updatedScores[roundIndex], fighterA: score};
        }
        else if (fighter === fighterB) {
            updatedScores[roundIndex] = {...updatedScores[roundIndex], fighterB: score};
        }

        // Update fightData with new roundScores, clears outcome and winnerDisplay
        setFightData(prev => ({
            ...prev,
            roundScores: updatedScores,
            outcome: ""
        }));
        setWinnerDisplay("");
   };


   const handleToggleClose = (roundIndex) => {
        const updatedCloseRounds = [...roundClose];
        updatedCloseRounds[roundIndex] = !updatedCloseRounds[roundIndex];
        setRoundClose(updatedCloseRounds);
   }

   const handleOpenNoteForm = (roundIndex) => {
        setCurrentRoundIndex(roundIndex);
        setNoteInputValue(roundNotes[roundIndex]);
        setShowNotePopup(true);
   }

   const handleNoteChange = (e) => {
        setNoteInputValue(e.target.value);
   }

   const handleSaveNote = () => {
        const updatedNotes = [...roundNotes];
        updatedNotes[currentRoundIndex] = noteInputValue;
        setRoundNotes(updatedNotes);
        setShowNotePopup(false);
   }

   const handleCloseNotePopup = () => {
        setShowNotePopup(false);
   }

   const handleOutcomeChange = (newOutcome) => {
        setFightData(prev => ({
            ...prev,
            outcome: newOutcome
        }));

        // If a winner is already selected, update the winnerDisplay with the new outcome
        if ((newOutcome !== outcome) && outcome !== "") {
            const winnerText = selectedWinner === fighterA
                ? `${fighterA} ${newOutcome} ${fighterB}`
                : `${fighterB} ${newOutcome} ${fighterA}`;
            
            setWinnerDisplay(winnerText);
        }

        // Show the winner if it's a fight-ending outcome
        if (["KO", "TKO", "RTD", "TD", "DQ"].includes(newOutcome)) {
            setShowWinnerPopup(true);
        }
        else {
            setShowWinnerPopup(false);
        }
   };

   const handleWinnerChange = (winner) => {
        if (selectedWinner !== winner || winnerDisplay  === "") {
            setSelectedWinner(winner);
            const winnerText = winner === fighterA
            ? `${fighterA} ${outcome} ${fighterB}`
            : `${fighterB} ${outcome} ${fighterA}`;
        
            setWinnerDisplay(winnerText);
        }

        setShowOutcomePopup(false);
        setShowWinnerPopup(false);
   }

   const isPreviousRoundScored = (roundIndex) => {
    if (roundIndex === 0) {
        return true;
    }
        return roundScores[roundIndex - 1].fighterA > 0 && roundScores[roundIndex - 1].fighterB > 0;
    };

   const returnToScorecards = () => {
        setFightData(fightData) // set the current fight data before navigating back to scorecard list
        navigate(-1);
   };

   if (!fightData || roundScores.length !== parseInt(fightData.rounds, 10)) {
    return <p>Loading fight data...</p>;
   }
    
    return (
        <div className="scorecard-page-container">
            <div className="fighters-info-container" style={{ color: "white"}}>
                <h2>{fighterA} vs. {fighterB}</h2>
            </div>

            {roundScores.map((score, index) => (
                    <div key={index}>
                        {isPreviousRoundScored(index) && (
                            <div className="score-input-container">
                                <div className="score-row">
                                    <ScoreInput
                                        fighterName={fighterA}
                                        score={score.fighterA}
                                        onScoreChange={handleScoreChange}
                                        roundIndex={index}
                                        className="score-input"
                                    />
                                    <label className="round-label" style={{ fontWeight: "bold", margin: "0 10px" }}>Round {index + 1}</label>
                                    <ScoreInput
                                        fighterName={fighterB}
                                        score={score.fighterB}
                                        onScoreChange={handleScoreChange}
                                        roundIndex={index}
                                        className="score-input"
                                    />
                                </div>
                                <div className="button-container">
                                    <NoteButton
                                        onOpenNoteForm={() => handleOpenNoteForm(index)}
                                    />
                                    <CloseRoundButton
                                        isClose={roundClose[index]}
                                        onToggleClose={handleToggleClose}
                                        roundIndex={index}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                { winnerDisplay && (
                    <div className="winner-container">
                        {winnerDisplay}
                    </div>
                )}

                { (fighterATotalScore > 0 || fighterBTotalScore > 0) && (
                    <div className="total-score-container">
                        <label style={{ fontWeight: "bold", color: "white" }}>{fighterATotalScore}-{fighterBTotalScore}</label>
                    </div>
                )

                }
                <div className="back-btn">
                    <button onClick={returnToScorecards}>&lt; Back</button>
                </div>
                <div className="end-fight-btn">
                    <button onClick={() => setShowOutcomePopup(true)}>End Fight</button>
                </div>

            { showNotePopup && (
                <div className="notes-popup">
                    <h2>Round {currentRoundIndex + 1} Notes</h2>
                    <textarea
                        value={noteInputValue}
                        onChange={handleNoteChange}
                        placeholder="Enter your notes here."
                    />
                    <br />
                    <button onClick={handleSaveNote}>Save</button>
                    <button onClick={handleCloseNotePopup}>Close</button>
                </div>
            )}

            {showOutcomePopup && (
                <div className="outcome-popup">
                    <h2>Select Fight Outcome</h2>
                    <select onChange={(e) => handleOutcomeChange(e.target.value)}>
                        <option value="">How did the fight end?</option>
                        <option value="KO">KO</option>
                        <option value="TKO">TKO</option>
                        <option value="RTD">Referee Technical Decision</option>
                        <option value="TD">Technical Decision</option>
                        <option value="DQ">Disqualification</option>
                        <option value="NC">No Contest</option>
                    </select>
                    <button onClick={() => setShowOutcomePopup(false)}>Close</button>
                </div>
            )}

            {showWinnerPopup && (
                <div className="winner-popup">
                    <h2>Who Won?</h2>
                    <select onChange={(e) => handleWinnerChange(e.target.value)}>
                        <option value="">Select a winner</option>
                        <option value={fighterA}>{fighterA}</option>
                        <option value={fighterB}>{fighterB}</option>
                    </select>
                    <button onClick={() => setShowWinnerPopup(false)}>Close</button>
                </div>
            )}
        </div>
    );
}

export default Scorecard;

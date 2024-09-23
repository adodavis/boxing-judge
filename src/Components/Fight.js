// Fight.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "./DataContext";

import "../App.css";

function Fight() {
    const { setFightData } = useData();
    const [fighterA, setFighterA] = useState('');
    const [fighterB, setFighterB] = useState('');
    const [rounds, setRounds] = useState('');
    const [date, setDate] = useState('');
    const [winner, setWinner] = useState('');
    const[outcome, setOutcome] = useState('');
    const [winnerDisplay, setWinnerDisplay] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!fighterA || !fighterB || !rounds || !date) {
            alert('Please fill in all fields');
            return;
        }
        
        const id = Date.now().toString(); // Generate a unique ID using the current timestamp

        setFightData({ id, fighterA, fighterB, rounds, date, winner, outcome, winnerDisplay });
        
        setFighterA('');
        setFighterB('');
        setRounds('');
        setDate('');
        setWinner('');
        setOutcome('');
        setWinnerDisplay('');
        navigate('/');
    }

    return (
        <div className="add-fight-form">
            <form onSubmit={handleSubmit}>
                <input value={fighterA}  onChange={(e) => setFighterA(e.target.value)} placeholder="Fighter A" />
                <br />
                <input value={fighterB} onChange={(e) => setFighterB(e.target.value)} placeholder="Fighter B" />
                <br />
                <select value={rounds} onChange={(e) => setRounds(e.target.value)}>
                    <option value="">Number of rounds</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                    <option value="8">8</option>
                    <option value="10">10</option>
                    <option value="12">12</option>
                    <option value="15">15</option>
                </select>
                <br />
                <input value={date} onChange={(e) => setDate(e.target.value)} type="date" />
                <br />
                <button type="submit">Add Fight</button>
            </form>
        </div>
    );
}

export default Fight;
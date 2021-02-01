import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "https://eyesdowneyesup.herokuapp.com";

let socket;

export default function ClientComponent(props) {
    const [players, setPlayers] = useState([]);
    const [isVotingEnabled, setIsVotingEnabled] = useState(true);
    const [isResultReceived, setIsResultReceived] = useState(false);
    const [match, setMatch] = useState(undefined);

    useEffect(() => {
        socket = socketIOClient(ENDPOINT)
        socket.on("connect", () => {
            console.log("Connected");
            socket.emit("name", props.name);
            setPlayers([]);
            setIsVotingEnabled(true);
            setIsResultReceived(false);
            setMatch(undefined);
        })

        socket.on("player", player => {
            console.log("Received " + player);
            setPlayers(prevState => [...prevState, player]);
        })

        socket.on("players", players => {
            console.log("Received " + players);
            setPlayers(players);
        })

        socket.on("match", match => {
            setMatch(match);
            setIsResultReceived(true);
        })

        socket.on("retire", playerId => {
            console.log("removing " + playerId);
            setPlayers(prevState => prevState.splice(prevState.findIndex(p => p.id === playerId), 1));
        })

        return () => socket.disconnect();
    }, [props.name]);

    const handleVote = (playerId) => {
        setIsVotingEnabled(false);
        socket.emit("vote", playerId);
    }

    const handleTryAgain = () => {
        setIsResultReceived(false);
        setIsVotingEnabled(true);
    }

    return (
        <>
            { isResultReceived ?
                <>
                    {match ? <div>You matched with {match}!</div> : <div>No match for you :(</div>}
                    {<input type="button" value="Try again" onClick={() => handleTryAgain()}/>}
                </> :
                <>
                    {players.length ?
                        <>
                            {isVotingEnabled ?
                                players.map(n => <input key={n.id} type="button" value={n.name} onClick={() => handleVote(n.id)}/>) :
                                "Waiting for others to vote"
                            }
                        </> :
                        "Waiting for others to join"}
                </>
            }
        </>
    );
}
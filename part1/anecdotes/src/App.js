import React, { useState } from "react";

const Highest = ({ votearray, anecdotes }) => {
  let max = 0;
  let pos = 0;
  for (let i = 0; i < 6; i++) {
    if (max < votearray[i]) {
      max = votearray[i];
      pos = i;
    }
  }
  return (
    <div>
      <h1>Anecdote with highest votes</h1>
      <p>{anecdotes[pos]}</p>
      <p>has {max} votes</p>
    </div>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
  ];
  const [selected, setSelected] = useState(0);
  const [votearray, setVote] = useState([0, 0, 0, 0, 0, 0]);

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };
  const increment = () => {
    const copyArray = { ...votearray };
    copyArray[selected] += 1;
    setVote(copyArray);
  };
  return (
    <div>
      <p>{anecdotes[selected]}</p>
      <p>Has {votearray[selected]} votes</p>
      <button onClick={increment}>Vote</button>
      <button onClick={() => setSelected(getRandomInt(6))}>
        next anecdote
      </button>
      <Highest votearray={votearray} anecdotes={anecdotes} />
    </div>
  );
};

export default App;

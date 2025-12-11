import { useState } from 'react'
const History = ({ selected, votes }) => {
  if (votes[selected] === 0) {
    return (
      <div>
        has 0 votes
      </div>
    )
  }

  return (
    <div>
      has {votes[selected]} votes
    </div>
  )
}

const Top = ({votes, anecdotes}) => {
  const maxIndex = votes.indexOf(Math.max(...votes))
  return (
    <div>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[maxIndex]}</p>
      <p>has votes {votes[maxIndex]}</p>
    </div>
  )
}

const Button = ({ onClick, text}) => <button onClick={onClick}>{text}</button>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  
  const setRandom = () => {
    setSelected(Math.floor(Math.random() * 8))
  }
  const setCopy = () => {
    const copy = [...votes]
      copy[selected] += 1
      setVotes(copy)    
  }
    
  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <Button onClick={setCopy} text = 'vote'/>
      <Button onClick={setRandom} text = 'next anecdote'/>
      <History selected={selected} votes={votes}/>
      <Top votes={votes} anecdotes={anecdotes} />
    </div>
  )
}

export default App

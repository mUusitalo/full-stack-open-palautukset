import React, { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))

  const winnerIndex = points.indexOf(Math.max(...points))

  const setRandomAnecdote = () => setSelected(Math.floor(Math.random() * anecdotes.length))
  const vote = () => {
    const newPoints = [...points]
    newPoints[selected] += 1
    setPoints(newPoints)
  }

  return (
    <div>
      <AnecdoteBox title="Anecdote of the day" text={anecdotes[selected]} points={points[selected]}/>
      <Button handleClick={setRandomAnecdote} text="Random anecdote"/>
      <Button handleClick={vote} text="vote"/>
      <AnecdoteBox title="Anecdote with most votes" text={anecdotes[winnerIndex]} points={points[winnerIndex]}/> 
    </div>
  )
}

const Header = ({text}) => <h1>{text}</h1>
const AnecdoteBox = ({title, text, points}) => (
  <>
    <Header text={title}/>
    <p>{text}</p>
    <p>Has {points} points</p>
  </>
)

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

export default App
import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
const Statistics = ({good, neutral, bad, all, score}) => {
  if (all === 0) {
    return (
      <div>
        <h1>Statistics</h1>
        <p>no feedback given</p>
      </div>
    )
  }
  return (
    <div>
      <h1>Statistics</h1>
        <table>
          <tbody>
            <tr>
              <td>good</td>
              <td>{good}</td>
            </tr>
            <tr>
              <td>Neutral</td>
              <td>{neutral}</td>
            </tr>
            <tr>
              <td>Bad</td>
              <td>{bad}</td>
            </tr>
            <tr>
              <td>all</td>
              <td>{all}</td>
            </tr>
            <tr>
              <td>average</td>
              <td>{(score/all).toFixed(1)}</td>
            </tr>
            <tr>
              <td>positive</td>
              <td>{((good/all)* 100).toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [score, setScore] = useState(0)
  
  const handleGoodClick = () => {
    setGood(good + 1)
    setAll(all + 1)
    setScore(score + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    setAll(all + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
    setAll(all + 1)
    setScore(score - 1)
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />
      <Statistics 
      good = {good}
      neutral = {neutral}
      bad = {bad}
      all = {all}
      score = {score}/>
    </div>
  )
}

export default App

import React, { useState } from 'react'

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const data = {
    good: {
      text: "Hyvää duunia!",
      value: good
    },
    neutral: {
      text: "Ihan OK.",
      value: neutral
    },
    bad: {
      text: "Höh, olisi voinut mennä paremminkin :(",
      value: bad
    }
  }

  return (
    <div>
      <Heading text="Anna palautetta"/>
      <Button handleClick={() => setGood(good + 1)} text={data.good.text}/>
      <Button handleClick={() => setNeutral(neutral + 1)} text={data.neutral.text}/>
      <Button handleClick={() => setBad(bad + 1)} text={data.bad.text}/>
      <Statistics {...data}/>
    </div>
  )
}

const Heading = ({text}) => {
  return (
    <h1>
      {text}
    </h1>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const total = good.value + neutral.value + bad.value
  const average = total === 0 ? 0 : ((good.value - bad.value) / total)
  const positive = total === 0 ? 0 : (good.value / total)
  return total ? (
    <>
      <Heading text="Tilastot"/>
      <table>
        <tbody>
          <StatisticsLine {...good}/>
          <StatisticsLine {...neutral}/>
          <StatisticsLine {...bad}/>
          <StatisticsLine text="Yhteensä" value={total}/>
          <StatisticsLine text="Keskiarvo" value=<LabelMeter label={Math.round(average * 100) / 100} value={average} min="-1" max="1"/>/>
          <StatisticsLine text={good.text} value={`${Math.round(positive * 1000) / 10}%`}/>
        </tbody>
      </table>
    </>
  ) : <></>
}

const LabelMeter = ({label, value, min, max}) =>  <label>{label}<meter min={min} max={max} value={value}></meter></label>

const StatisticsLine = ({text, value}) => <tr><td>{text}</td><td>{value}</td></tr>

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

export default App
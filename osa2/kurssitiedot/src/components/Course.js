import React from 'react'

const Course = ({name, parts}) => (
    <>
      <Header name={name}/>
      <Content parts={parts}/>
    </>
  )
  
  const Header = (props) => (
    <h2>
      {props.name}
    </h2>
  )
  
  const Content = ({parts}) => (
    <>
      {parts.map(part => <Part key={part.id}{...part}/>)}
      <TotalCounter parts={parts}/>
    </>
  )
  
  const Part = ({name, exercises}) => (
    <p>
      {name} {exercises}
    </p>
  )
  
  const TotalCounter = ({parts}) => {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0)

    return (
      <b>
        Number of exercises {total}
      </b>
    )
  }
  
export default Course
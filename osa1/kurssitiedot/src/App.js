import React from 'react'

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <>
      <Header name={course.name}/>
      <Content {...course}/>
      <Total {...course}/>
    </>
  )
}

const Header = (props) => (
  <h1>
    {props.name}
  </h1>
)

const Content = (props) => (
  <>
      <Part {...props.parts[0]}/>
      <Part {...props.parts[1]}/>
      <Part {...props.parts[2]}/>
  </>
)

const Part = (props) => (
  <p>
    {props.name} {props.exercises}
  </p>
)

const Total = (props) => {
  console.log(props.parts)
  const reducer = (sum, part) => sum + part.exercises
  return (
    <p>
      Number of exercises {props.parts.reduce(reducer, 0)}
    </p>
  )
}

export default App 
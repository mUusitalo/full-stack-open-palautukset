import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')

  useEffect(() =>
    axios
    .get('http://localhost:3001/persons')
    .then(response => setPersons(response.data))
  , [])

  const addNewEntry = (e) => {
    e.preventDefault()
    
    const entry = {
      name: newName,
      number: newNumber
    }

    if (persons.some((element) => element.name === newName)) {
      alert(`${newName} has already been added to the phonebook!`)
    } else {
      console.log("Add name: ", newName)
      setPersons(persons.concat(entry)) 
    }
  }

  const createHandler = (setter) => (
    (e) => setter(e.target.value)
  )
  
  const formProps = {
    submitHandler: addNewEntry,
    name: newName,
    nameHandler: createHandler(setNewName),
    number: newNumber,
    numberHandler: createHandler(setNewNumber)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <NewEntry {...formProps}/>
      <h2>Numbers</h2>
      <FilterBox filterString={newFilter} handler={createHandler(setNewFilter)}/>
      <Persons persons={persons} filterString={newFilter}/>
    </div>
  )
}

const FilterBox = ({filterString, handler}) => (
  <>
    Filter names: <input value={filterString} onChange={handler}/>
  </>
)

const NewEntry = ({submitHandler, name, nameHandler, number, numberHandler}) => (
  <>
    Add new entry:
    <form onSubmit={submitHandler}>
      <div>name: <input value={name} onChange={nameHandler}/></div>
      <div>Phone number: <input value={number} onChange={numberHandler}/></div>
      <div><button type="submit">add</button></div>
    </form>
  </>
)

const Persons = ({persons, filterString}) => {

  const filterFunction = person => person.name.toLowerCase().includes(filterString.toLowerCase()) 
  const sortFunction = (a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
  const filteredPersons = persons
                          .filter(filterFunction)
                          .sort(sortFunction)

  return(
    <ul>
      {filteredPersons.map(person => <li key={person.name}>{person.name} {person.number}</li>)}
    </ul>
  )
}

export default App
import React, { useState, useEffect } from 'react'

import personService from './services/persons.js'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ name, setName ] = useState('')
  const [ number, setNumber ] = useState('')
  const [ filter, setFilter ] = useState('')

  useEffect(() =>
    personService.getAll().then(setPersons)
  , [])

  const addNewPerson = async (e) => {
    e.preventDefault()
    
    const person = {name, number}

    const existingPerson = persons.find((person) => person.name === name)
    if (existingPerson) {

      if (existingPerson.number) {
        console.log("Person already exists in array, prompting update", existingPerson)
        if (!window.confirm(`Update ${name}'s number from ${existingPerson.number} to ${number || "blank"}?`)) return
      }

      const updatedPerson = await personService.update({...existingPerson, number})
      setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person))

    } else {

      const newPerson = await personService.addNew(person)
      console.log("Person added to database: ", newPerson)
      setPersons(persons.concat(newPerson)) 

    }
  }

  const handleDelete = async (personToBeDeleted) => {
    const isConfirmed = window.confirm(`Confirm deletion of ${personToBeDeleted.name}?`)
    if (!isConfirmed) return
    try {
      await personService.deletePerson(personToBeDeleted)
      console.log("Removed person from database", personToBeDeleted)
      setPersons(persons.filter(person => person.id !== personToBeDeleted.id))  
    } catch (e) {
      console.log("Tried to delete following person, but they didn't exist in the database", personToBeDeleted)
      alert("Something went wrong. Refreshing data from database.")
      personService.getAll().then(setPersons)
    }
  }

  const createHandler = (setter) => (
    (e) => setter(e.target.value)
  )
  
  const formProps = {
    submitHandler: addNewPerson,
    name: name,
    nameHandler: createHandler(setName),
    number: number,
    numberHandler: createHandler(setNumber)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <NewPerson {...formProps}/>
      <h2>Numbers</h2>
      <FilterBox filterString={filter} handler={createHandler(setFilter)}/>
      <Persons persons={persons} filterString={filter} handleDelete={handleDelete}/>
    </div>
  )
}

const FilterBox = ({filterString, handler}) => (
  <>
    Filter names: <input value={filterString} onChange={handler}/>
  </>
)

const NewPerson = ({submitHandler, name, nameHandler, number, numberHandler}) => (
  <>
    Add new person:
    <form onSubmit={submitHandler}>
      <div>name: <input value={name} onChange={nameHandler}/></div>
      <div>Phone number: <input value={number} onChange={numberHandler}/></div>
      <div><button type="submit">add</button></div>
    </form>
  </>
)

const Persons = ({persons, filterString, handleDelete}) => {

  const filterFunction = person => (
    person
      .name
    .toLowerCase()
    .includes(filterString.toLowerCase())
  )

  const sortFunction = (a, b) => (
    a.name.toLowerCase() > b.name.toLowerCase() ?
    1 :
    -1
  )
  
  const filteredPersons = persons
                          .filter(filterFunction)
                          .sort(sortFunction)

  return(
    <ul>
      {filteredPersons.map(person => <PhonebookItem key={person.id} person={person} handleDelete={handleDelete}/>)}
    </ul>
  )
}

const PhonebookItem = ({person, handleDelete}) => {
  return (
    <li>{person.name} {person.number} <DeleteButton person={person} handleDelete={() => handleDelete(person)}/></li>
  )
}

const DeleteButton = ({handleDelete}) => {
  return <button onClick={handleDelete}>Delete</button>
}

export default App
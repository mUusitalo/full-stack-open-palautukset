import React, { useState, useEffect } from 'react'

import personService from './services/persons.js'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ name, setName ] = useState('')
  const [ number, setNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ notification, setNotification ] = useState({text: null, color: 'snow'})

  useEffect(() =>
    personService.getAll().then(setPersons)
  , [])

  function showNotification(text, color) {
    setNotification({text, color})
    setTimeout(() => setNotification({...notification, text: null}), 3000)
  }

  async function updatePerson(existingPerson) {
    if (existingPerson.number) {
      console.log("Person already exists in array, prompting update", existingPerson)
      if (!window.confirm(`Update ${name}'s number from ${existingPerson.number} to ${number || "blank"}?`)) return
    }
    try {
      const updatedPerson = await personService.update({...existingPerson, number})
      setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person))
      showNotification(`Updated ${updatedPerson.name}'s number to ${number}`, 'green')  
    } catch (e) {
      console.log(e)
      showNotification(`Oops, ${existingPerson.name} doesn't exist in the database. Refetching data.`, 'red')
      personService.getAll().then(setPersons)
    }
  }

  const addNewPerson = async (e) => {
    e.preventDefault()
    
    const person = {name, number}

    const existingPerson = persons.find((person) => person.name === name)
    if (existingPerson) {

      updatePerson(existingPerson)

    } else {

      const newPerson = await personService.addNew(person)
      showNotification(`Added ${newPerson.name}`, 'green')
      setPersons(persons.concat(newPerson)) 

    }
  }

  const handleDelete = async (personToBeDeleted) => {
    const isConfirmed = window.confirm(`Confirm deletion of ${personToBeDeleted.name}?`)
    if (!isConfirmed) return
    try {
      await personService.deletePerson(personToBeDeleted)
      showNotification(`Deleted ${personToBeDeleted.name}`, 'green')
      setPersons(persons.filter(person => person.id !== personToBeDeleted.id))  
    } catch (e) {
      console.log("Tried to delete following person, but they didn't exist in the database", personToBeDeleted)
      personService.getAll().then(setPersons)
      showNotification(`Oops, ${personToBeDeleted.name} doesn't exist in the database. Refetching data.`, 'red')
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
      <Notification {...notification}/>
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

const Notification = ({text, color}) => {
  if (!text) return null

  const style = {
    fontSize: 30,
    color: color,
    backgroundColor: 'snow',
    border: 5,
    borderStyle: 'solid',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    textAlign: 'center'
  }

  return <div style={style}>{text}</div>
}

export default App
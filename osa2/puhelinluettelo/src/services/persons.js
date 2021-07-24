import axios from 'axios'

const BASE_URL = 'http://localhost:3001/persons'

async function getAll() {
    return (await axios.get(BASE_URL)).data
}

async function addNew(newPerson) {
    return (await axios.post(BASE_URL, newPerson)).data
}

async function update(person) {
    return (await axios.put(`${BASE_URL}/${person.id}`, person)).data
}

async function deletePerson(person) {
    return (await axios.delete(`${BASE_URL}/${person.id}`)).data
}

const personService = {getAll, addNew, update, deletePerson}
export default personService
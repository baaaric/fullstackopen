import { useState, useEffect } from 'react'
const baseUrl = 'http://localhost:3001/persons'
import personService from './services/persons'

const Filter =({ filter, handleFilterChange }) => (
  <div>
    filter shown with <input value={filter} onChange={handleFilterChange} />
  </div>
)

const PersonForm =({ handleSubmit, newName, handleNameChange, newNumber, handleNumberChange }) => (
  <form onSubmit={handleSubmit}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ personsToShow, handleDelete }) => (
  <ul>
    {personsToShow.map(person =>
      <li key={person.id}>{person.name} {person.number}
        <button onClick={() => handleDelete(person.id, person.name)}>
          delete
        </button>
      </li>
    )}
  </ul>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const handleDelete = (id, name) => {
    const fine = window.confirm(`Delete ${name}?`)
    if (!fine) return
    
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
      .catch(error => {
        alert(`Information of ${name} has already been removed from server`)
        setPersons(persons.filter(p => p.id !== id))
      })
  }
  
  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  console.log('render', persons.length, 'persons')

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      const fine = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
      if (!fine) return

      const changedPerson = { ...existingPerson, number: newNumber }

      personService
        .update(existingPerson.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          alert(`Information of ${newName} has already been removed from server`)
          setPersons(persons.filter(p => p.id !== existingPerson.id))
        })

      return
    }

    const personObject = { name: newName, number: newNumber }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }


  const personsToShow = 
  filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())
      ) 

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

   return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm handleSubmit={handleSubmit} 
        newName={newName}
        handleNameChange={handleNameChange} 
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}/>

      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App
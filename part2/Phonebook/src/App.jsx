import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import './index.css'

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
      <li key={person.id}>
        {person.name} {person.number}
        <button onClick={() => handleDelete(person.id, person.name)}>
          delete
        </button>
      </li>
    )}
  </ul>
)


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const notify = (message, type) => {
    setNotificationMessage(message)
    setNotificationType(type)
    setTimeout(() => {
      setNotificationMessage(null)
      setNotificationType(null)
    }, 5000)
  }

  const handleDelete = (id, name) => {
    const fine = window.confirm(`Delete ${name}?`)
    if (!fine) return

    personService
      .remove(id)
      .then(() => {
        setPersons(prev => prev.filter(p => p.id !== id))
        notify(`Deleted ${name}`, 'message')
      })
      .catch(() => {
        notify(`Information of ${name} has already been removed from server`, 'error')
        setPersons(prev => prev.filter(p => p.id !== id))
      })
  }


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
          setPersons(prev => prev.map(p => (p.id !== existingPerson.id ? p : returnedPerson)))
          setNewName('')
          setNewNumber('')
          notify(`Updated ${returnedPerson.name}`, 'message')
        })
        .catch(() => {
          notify(`Information of ${existingPerson.name} has already been removed from server`, 'error')
          setPersons(prev => prev.filter(p => p.id !== existingPerson.id))
        })

      return
    }

    const personObject = { name: newName, number: newNumber }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(prev => prev.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        notify(`Added ${returnedPerson.name}`, 'message')
      })
  }

  const personsToShow =
    filter === ''
      ? persons
      : persons.filter(person =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        )

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notificationMessage} type={notificationType} />

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App

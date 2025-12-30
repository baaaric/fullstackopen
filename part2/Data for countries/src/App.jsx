import { useEffect, useMemo, useState } from 'react'
import countriesService from './services/countries'

const CountryDetails = ({ country }) => {
  const languages = country.languages ? Object.values(country.languages) : []

  return (
    <div>
      <h2>{country.name.common}</h2>

      <div>Capital {country.capital?.[0] ?? '—'}</div>
      <div>Area {country.area}</div>

      <h3>Languages</h3>
      <ul>
        {languages.map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img
        src={country.flags?.png}
        alt={country.flags?.alt ?? `Flag of ${country.name.common}`}
        width="160"
      />
    </div>
  )
}

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countriesService.getAll().then(setCountries)
  }, [])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return countries.filter(c =>
      c.name.common.toLowerCase().includes(q)
    )
  }, [query, countries])
  
  let content = null

  if (selectedCountry) {
    content = <CountryDetails country={selectedCountry} />
  } else if (matches.length > 10) {
    content = <div>Too many matches, specify another filter</div>
  } else if (matches.length > 1) {
    content = (
      <ul>
        {matches.map(c => (
          <li key={c.cca3}>
            {c.name.common}
            <button onClick={() => setSelectedCountry(c)}>show</button>
          </li>
        ))}
      </ul>
    )
  } else if (matches.length === 1) {
    content = <CountryDetails country={matches[0]} />
  }

  return (
    <div>
      <div>
        find countries{' '}
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedCountry(null)
          }}
        />
      </div>

      {query.trim() === '' ? null : matches.length > 10 ? (
        <div>Too many matches, specify another filter</div>
      ) : matches.length > 1 ? (
        <ul>
          {matches.map(c => (
            <li key={c.cca3}>
              {c.name.common}
              <button onClick={() => setSelectedCountry(c)}>show</button>
            </li>
          ))}
        </ul>
      ) : matches.length === 1 ? (
        <CountryDetails country={matches[0]} />
      ) : (
        <div>No matches</div>
      )}
    </div>
  )
}

export default App

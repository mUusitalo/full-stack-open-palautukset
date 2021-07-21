import React, {useState, useEffect} from 'react'
import axios from 'axios'


const App = () => {

  const API_URL = 'https://restcountries.eu/rest/v2/all'
  const [data, setData] = useState([])
  const [newSearch, setNewSearch] = useState('')

  useEffect(() => {
    axios
      .get(API_URL)
      .then(response => console.log("Dataset loaded") || setData(response.data))
  }, [])

  return (
    <div>
      <Search value={newSearch} onChange={(e) => setNewSearch(e.target.value)}/>
      <Content data={data} search={newSearch} onClick={name => setNewSearch(name)}/>
    </div>
  )
}

const Content = ({data, search='', onClick}) => {

  if (data.length === 0) return <p>Hang on, we're loading data from the database. This can take while.</p>

  const filteredCountries = data.filter(country => country.name.toLowerCase().includes(search.toLowerCase()))
  const listLength = filteredCountries.length

  switch(true) {
    // Every country is shown on purpose when no search term has been entered
    case search && (listLength > 10):
      return <p>Too many matches, narrow your search</p>

    case listLength === 1:
      return <Country {...filteredCountries[0]}/>

    case listLength === 0:
      return <p>No countries found with search {search}</p>

    default:
      return filteredCountries.map(country => <SearchResult key={country.name} name={country.name} onClick={onClick}/>)
  }
}

const SearchResult = ({name, onClick}) => (
  <div>
    {name}<button type="button" onClick={() => onClick(name)}>show</button>
  </div>
)

const Country = ({name, capital, population, languages, flag}) => {
  return (
    <>
      <h1>{name}</h1>
      <CountryInfo capital={capital} population={population}/>
      <Languages languages={languages}/>
      <img src={flag} width="15%" alt={`Flag of ${name}`}/>
      <Weather cityName={capital}/>
    </>
  )
}

const CountryInfo = ({capital, population}) => (
  <>
    Capital {capital}
    <br/>
    Population {population}
  </>
)

const Languages = ({languages}) => {
  console.log(languages)
  return (
    <div>
      <h2>Languages</h2>
      <ul>
        {languages.map(language => <li key={language.name}>{language.name}</li>)}
      </ul>
    </div>
  )
}

const Weather = ({cityName}) => {

  const [data, setData] = useState({})

  useEffect(() => {
    const API_KEY = process.env?.REACT_APP_API_KEY
    
    if (!API_KEY) {
      alert(`Error: REACT_APP_API_KEY environment variable is not defined. Get a new API key at https://openweathermap.org/price`)
    }

    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`

    axios
      .get(API_URL)
      .then(response => console.log("Weather loaded", response.data) || setData(response.data))
  }, [cityName])

  return Object.keys(data).length ? 
  (
    <div>
      <h2>Weather in {cityName}</h2>
      <p>Temperature {Math.round((data?.main?.temp - 273.15) * 10) / 10 ?? '--'} °C</p>
      <p>Humidity {data?.main?.humidity ?? '--'} %</p>
      <p>Wind speed {data?.wind?.speed ?? '--'} m/s</p>
      <p>{data?.weather?.[0]?.description ?? ''}</p>
    </div>
  )
  :
  (
    <div>
      <h2>Weather in {cityName}</h2>
      <p>Sorry, no weather found :(</p>
    </div>
  )
}

const Search = ({value, onChange}) => {
  return (
    <div>
      Search for a country
      <input type='text' value={value} onChange={onChange}/>
    </div>
  )
}
export default App;

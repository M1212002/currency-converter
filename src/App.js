import { useState, useEffect } from 'react';
import Axios from 'axios';
import { HiSwitchHorizontal } from 'react-icons/hi';
import "react-dropdown/style.css";
import './App.css';
import Dropdown from "react-dropdown";

function App() {
  const [input, setinput] = useState("");
  const [output, setoutput] = useState(0);
  const [info, setinfo] = useState({});
  const [options, setoptions] = useState([]);
  const [from, setfrom] = useState("USD");
  const [to, setto] = useState("INR");
  const [inputValue, setInputValue] = useState(0);

  useEffect(() => {
    Axios.get(`https://v6.exchangerate-api.com/v6/1f21ae40293561d54147af41/codes`)
      .then((res) => {
        setoptions(res.data.supported_codes.map(code => code[0]));
      })
      .catch((err) => {
        console.error("Error fetching currency codes: ", err);
      });
  }, []);

  useEffect(() => {
    Axios.get(`https://v6.exchangerate-api.com/v6/1f21ae40293561d54147af41/latest/${from}`)
      .then((res) => {
        setinfo(res.data.conversion_rates);
      })
      .catch((err) => {
        console.error("Error fetching currency rates: ", err);
      });
  }, [from]);

  const handleInputChange = (e) => {
    setinput(e.target.value);
    const numericValue = parseFloat(e.target.value);
    setInputValue(isNaN(numericValue) ? 0 : numericValue); 
  };

  function convert() {
    if (inputValue > 0) {
      const rate = info[to]; 
      if (rate) {
        setoutput(inputValue * rate);  
      } else {
        console.error("Rate not found for currency: ", to);
      }
    } else {
      setoutput(0); 
    }
  }

  function flip() {
    const temp = from;
    setfrom(to);
    setto(temp);
  }

  return (
    <div className="App">
      <div className='heading'>
        <h1>Currency Converter</h1>
      </div>
      <div className='container'>
        <div className='left'>
          <h3>Amount</h3>
          <input type="text" placeholder='Enter the amount' value={input} onChange={handleInputChange} />
        </div>
        <div className='middle'>
          <h3>From</h3>
          <Dropdown options={options} onChange={(e) => setfrom(e.value)} value={from} placeholder="From" />
        </div>
        <div className='switch'>
          <HiSwitchHorizontal size="30px" onClick={flip} />
        </div>
        <div className='right'>
          <h3>To</h3>
          <Dropdown options={options} onChange={(e) => setto(e.value)} value={to} placeholder="To" />
        </div>
      </div>
      <div className='result'>
        <button onClick={convert}>Convert</button>
        <h2>Converted Amount : </h2>
        <p>{inputValue + " " + from + " = " + output.toFixed(2) + " " + to}</p>
      </div>
    </div>
  );
}

export default App;


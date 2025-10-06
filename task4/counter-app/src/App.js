import React, { useState } from 'react';

const CounterApp = () => {
  // State for counter
  const [count, setCount] = useState(0);

  // States for name inputs
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');

  // Functions to handle counter actions
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);
  const incrementFive = () => setCount(prev => prev + 5);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>WELCOME TO CHARUSAT!!!</h1>

      {/* Counter Section */}
      <h2>Counter: {count}</h2>
      <button onClick={increment}>Increment</button>{' '}
      <button onClick={decrement}>Decrement</button>{' '}
      <button onClick={incrementFive}>Increment Five</button>{' '}
      <button onClick={reset}>Reset</button>

      <hr />

      {/* Name Input Section */}
      <div>
        <label>
          First Name: 
          <input
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Surname: 
          <input
            type="text"
            value={surname}
            onChange={e => setSurname(e.target.value)}
          />
        </label>
      </div>

      <h3>Hello, {firstName} {surname}</h3>
    </div>
  );
};

export default CounterApp;

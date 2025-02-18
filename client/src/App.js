import React, { useEffect, useState } from 'react'

function App() {

  const [backend, setBackend] = useState([{}]);

  useEffect(() => {
    fetch("/").then(
      response => response.json()
    ).then(
      data => {
        setBackend(data);
      }
    )

  }, [])
  return (
    <div>

      {(typeof backend.text === 'undefined') ? (
        <p>Loading...</p>
      ) : 
      (backend.text.map((word, i) => (
        <p key={i}>{word}</p>

      )))}
    </div>
  )
}

export default App
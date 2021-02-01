import React, {useState} from "react";
import ClientComponent from "./ClientComponent";

function App() {
  const [inputName, setInputName] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    setName(inputName);
    event.preventDefault();
  }

  return (
    <>
      {name ?
      <ClientComponent name={name}/> :
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputName}
          placeholder="What is your name?"
          onChange={(event) => setInputName(event.target.value)}
        />
        <input
          type="submit"
          value="Submit"
        />
      </form>}
    </>
  );
}

export default App;

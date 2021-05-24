import React, { useEffect } from 'react';
import './App.css';
import { GetIndexex } from './components/GetIndex/GetIndexes';
import 'antd/dist/antd.css';
import ReactGa from "react-ga"
function App() {
  useEffect(() => {
    ReactGa.initialize(process.env.REACT_APP_ANALYTICS_TOKEN as string)
    ReactGa.pageview(window.location.pathname+window.location.search)
  }, [])
  return (
    <div className="App">
      <GetIndexex />
    </div>
  );
}

export default App;

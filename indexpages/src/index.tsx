import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
const rootElement = document.getElementById("root") as any;

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrate( <React.StrictMode>
    <App />
  </React.StrictMode>, rootElement);
} else {
  ReactDOM.render( <React.StrictMode>
    <App />
  </React.StrictMode>, rootElement);
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

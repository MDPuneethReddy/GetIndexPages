import React, { useEffect } from 'react';
import './App.css';
import { GetIndexex } from './components/GetIndex/GetIndexes';
import 'antd/dist/antd.css';
import ReactGa from "react-ga"
// declare global {
//   interface Window {
//       adsbygoogle: any;
//   }
// }
function App() {
  // For analytics
  // console.log(process.env.REACT_APP_ADSENSE_TOKEN)
  useEffect(() => {
//     (window.adsbygoogle = window.adsbygoogle || []).push({
//       google_ad_client: process.env.REACT_APP_ADSENSE_TOKEN as string,
//       enable_page_level_ads: true
//  });
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

import React,{useEffect, useState} from 'react';
import './App.css';


// this is to define columns
const columns = [
    {
      key:'roomDetails',
      displayName:'Room Details',
      render: ({label, ward}) => (<div>{`${label} ${ward}`}</div>)
  },{
      key:'timestamp',
      displayName:'Date Time',
    },{
      key:'vitals',
      displayName:'Vitals',
      render: ({hr, br, location, movement}) => (<div>{`hr is ${hr}, br is ${br} , location is ${location} ${movement ? `, movement is ${movement}`:''}`}</div>)
    }
  ]
const App = () => {
    const refreshInterval = 5000;
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        let isMounted = true
        const url = 'http://localhost:3010/api/v1/heartbeat'
        const intervalId = setInterval(() => {  //assign interval to a variaable to clear it
         fetch(url)
           .then(data => data.json())
           .then(obj => {
             if(!isMounted) return  // This will cancel the setState when unmounted
             setMessages(obj)
          })
          .catch(function(error) {
             console.log(error)
          })
        }, refreshInterval)
     
        return () => {
            clearInterval(intervalId); //This is important
            isMounted = false // Let's us know the component is no longer mounted.
        }
     
     }, [])

    return (
        <div>
            <h2>App</h2>
            {
              messages.length > 0 &&
            <div className='table'>
        <div className='table__header'>
          {
            columns.map(column=> <div key={column.key} className='column'>{column.displayName}</div>)
          }
        </div>
        <div className='table__rows'>
          {
            messages.map((row)=>(<div className='row' key={row['timestamp']}>
              {
                columns.map(column=>(
                  <div className='column'>
                    {column.render ? column.render(row[column.key]) : <span>{row[column.key]}</span>}
                  </div>
                ))
              }
            </div>))
          }
        </div>
      </div>
}
        </div>
    );
};

export default App;

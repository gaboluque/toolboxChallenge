import React, { useCallback, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import NavBar from './components/NavBar'
import './styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import FileTable from './components/FileTable'
import { FormControl, InputGroup, Spinner } from 'react-bootstrap'


// Implement simple Debounce function
// REF: https://levelup.gitconnected.com/debounce-in-javascript-improve-your-applications-performance-5b01855e086
const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const App = () => {
  const [fileName, setFileName] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = useCallback(debounce((fn) => {
    setLoading(true);
    axios.get('http://localhost:3001/files/data', { params: { fileName: fn } }).then((res) => {
      if (res.status === 200) setData(res.data.data);
      setLoading(false);
    });
  }, 200), []);

  useEffect(() => {
    fetchFiles(fileName);
  }, [fileName]);

  const handleInput = (e) => setFileName(e.target.value);

  return (
    <div>
      <NavBar/>
      <div className="input-container m-4">
        <InputGroup className="w-1">
          <FormControl value={fileName} onChange={handleInput} placeholder="File name" aria-label="File name"/>
        </InputGroup>
      </div>
      <FileTable files={loading ? [] : data} />
      {loading ? <Spinner  animation="border" /> : null}
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'))

import React from 'react'
import { Table } from 'react-bootstrap'

const FileTable = ({ files }) => {
  return (
    <div className='table-container'>
      <Table hover>
        <thead>
          <th>File Name</th>
          <th>Text</th>
          <th>Number</th>
          <th>Hex</th>
        </thead>
        <tbody>
          {files.map(({ name, text, number, hex }) => (
            <tr key={`${name}-${text}-${hex}`}>
              <td>{name}</td>
              <td>{text}</td>
              <td>{number}</td>
              <td>{hex}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default FileTable

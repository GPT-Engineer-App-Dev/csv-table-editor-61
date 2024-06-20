import React, { useState } from 'react';
import Papa from 'papaparse';
import { CSVLink } from 'react-csv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const CSVUploader = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setHeaders(Object.keys(results.data[0]));
        setData(results.data);
      },
    });
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => ({ ...acc, [header]: '' }), {});
    setData([...data, newRow]);
  };

  const handleRemoveRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleCellChange = (index, header, value) => {
    const newData = data.map((row, i) => (i === index ? { ...row, [header]: value } : row));
    setData(newData);
  };

  return (
    <div className="p-4">
      <Input type="file" accept=".csv" onChange={handleFileUpload} />
      {data.length > 0 && (
        <>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header) => (
                    <TableCell key={header}>
                      <Input
                        value={row[header]}
                        onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="outline" onClick={() => handleRemoveRow(rowIndex)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button className="mt-4" onClick={handleAddRow}>
            Add Row
          </Button>
          <CSVLink data={data} headers={headers} filename="edited_data.csv">
            <Button className="mt-4">Download CSV</Button>
          </CSVLink>
        </>
      )}
    </div>
  );
};

export default CSVUploader;
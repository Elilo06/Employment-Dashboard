import { useEffect, useState } from 'react'
import Papa from 'papaparse'

export function useCsvData(url) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Papa.parse(url, {
      download: true,        // fetch the file from the URL
      header: true,          // first row becomes object keys
      dynamicTyping: true,   // "123" becomes 123
      skipEmptyLines: true,
      complete: (results) => {
        setRows(results.data)
        setLoading(false)
      },
      error: (err) => {
        setError(err)
        setLoading(false)
      },
    })
  }, [url])

  return { rows, loading, error }
}
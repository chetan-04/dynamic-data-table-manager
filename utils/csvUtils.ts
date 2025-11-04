import Papa from 'papaparse'
import { saveAs } from 'file-saver'
import { TableRow, Column } from '@/lib/slices/tableDataSlice'

export function exportToCSV(data: TableRow[], visibleColumns: Column[]) {
  // only export visible columns
  const headers = visibleColumns.map((col) => col.label)
  const rows = data.map((row) =>
    visibleColumns.map((col) => {
      const value = row[col.id] ?? ''
      // handle values with commas by wrapping in quotes
      return String(value).includes(',') ? `"${value}"` : value
    })
  )

  const csvContent = [headers, ...rows]
    .map((row) => row.join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, `table-export-${new Date().toISOString().split('T')[0]}.csv`)
}

export function importFromCSV(
  file: File,
  existingColumns: Column[]
): Promise<{ importedData: TableRow[]; newColumns: Column[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const csvHeaders = results.meta.fields || []
          const newColumns: Column[] = []
          const existingColumnIds = existingColumns.map((col) => col.id)

          // find new columns from CSV headers
          csvHeaders.forEach((header) => {
            const normalizedKey = header.toLowerCase().trim().replace(/\s+/g, '_')
            if (
              !existingColumnIds.includes(normalizedKey) &&
              !['id', 'name', 'email', 'age', 'role'].includes(normalizedKey)
            ) {
              newColumns.push({
                id: normalizedKey,
                label: header.trim(),
                visible: true,
              })
            }
          })

          const importedData: TableRow[] = (results.data as any[]).map(
            (row, index) => {
              const newRow: TableRow = {
                id: `imported-${Date.now()}-${index}`,
                name: row.name || row.Name || '',
                email: row.email || row.Email || '',
                age: parseInt(row.age || row.Age || '0') || 0,
                role: row.role || row.Role || '',
              }

              // add all column values
              Object.keys(row).forEach((key) => {
                const normalizedKey = key.toLowerCase().trim().replace(/\s+/g, '_')
                if (!['id', 'name', 'email', 'age', 'role'].includes(normalizedKey)) {
                  newRow[normalizedKey] = row[key] || ''
                }
              })

              return newRow
            }
          )
          resolve({ importedData, newColumns })
        } catch (error) {
          reject(error)
        }
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}


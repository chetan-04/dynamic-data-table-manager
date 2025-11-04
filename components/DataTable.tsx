'use client'

import { useState, useMemo } from 'react'
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Stack,
} from '@mui/material'
import {
  VisibilityOff,
  Visibility,
  Add,
  FileUpload,
  FileDownload,
  Settings,
} from '@mui/icons-material'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import {
  setSearchTerm,
  setSortColumn,
  setCurrentPage,
  toggleColumnVisibility,
  addColumn,
  updateData,
  TableRow as TableRowType,
} from '@/lib/slices/tableDataSlice'
import { exportToCSV, importFromCSV } from '@/utils/csvUtils'

export default function DataTable() {
  const dispatch = useAppDispatch()
  const { data, columns, searchTerm, sortColumn, sortDirection, currentPage, rowsPerPage } =
    useAppSelector((state) => state.tableData)

  const [columnDialogOpen, setColumnDialogOpen] = useState(false)
  const [newColumnName, setNewColumnName] = useState('')

  // filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((row) => {
      const searchLower = searchTerm.toLowerCase()
      return columns.some((col) => {
        if (!col.visible) return false
        const value = String(row[col.id] || '').toLowerCase()
        return value.includes(searchLower)
      })
    })

    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortColumn] ?? ''
        const bVal = b[sortColumn] ?? ''
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
        }
        
        const aStr = String(aVal).toLowerCase()
        const bStr = String(bVal).toLowerCase()
        
        if (sortDirection === 'asc') {
          return aStr.localeCompare(bStr)
        } else {
          return bStr.localeCompare(aStr)
        }
      })
    }

    return filtered
  }, [data, columns, searchTerm, sortColumn, sortDirection])

  // pagination
  const paginatedData = useMemo(() => {
    const start = currentPage * rowsPerPage
    return filteredAndSortedData.slice(start, start + rowsPerPage)
  }, [filteredAndSortedData, currentPage, rowsPerPage])

  const visibleColumns = columns.filter((col) => col.visible)

  const handleSort = (columnId: string) => {
    dispatch(setSortColumn(columnId))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value))
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    dispatch(setCurrentPage(newPage))
  }

  const handleToggleColumn = (columnId: string) => {
    dispatch(toggleColumnVisibility(columnId))
  }

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const columnId = newColumnName.toLowerCase().replace(/\s+/g, '_')
      dispatch(addColumn({ id: columnId, label: newColumnName.trim() }))
      setNewColumnName('')
      setColumnDialogOpen(false)
    }
  }

  const handleExportCSV = () => {
    exportToCSV(filteredAndSortedData, visibleColumns)
  }

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const { importedData, newColumns } = await importFromCSV(file, columns)
        
        // add any new columns that were found in CSV
        newColumns.forEach((col) => {
          dispatch(addColumn({ id: col.id, label: col.label }))
        })
        
        dispatch(updateData(importedData))
      } catch (error) {
        console.error('Error importing CSV:', error)
        alert('Failed to import CSV file')
      }
    }
    // reset input
    if (e.target) {
      e.target.value = ''
    }
  }

  return (
    <Box>
      {/* Toolbar */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap" gap={2}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ flexGrow: 1, minWidth: 200 }}
        />
        
        <Button
          variant="outlined"
          startIcon={<Settings />}
          onClick={() => setColumnDialogOpen(true)}
        >
          Manage Columns
        </Button>

        <Button
          variant="outlined"
          startIcon={<FileUpload />}
          component="label"
        >
          Import CSV
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={handleImportCSV}
          />
        </Button>

        <Button
          variant="contained"
          startIcon={<FileDownload />}
          onClick={handleExportCSV}
        >
          Export CSV
        </Button>
      </Stack>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableCell key={column.id}>
                  <TableSortLabel
                    active={sortColumn === column.id}
                    direction={sortColumn === column.id ? sortDirection : 'asc'}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row.id} hover>
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id}>
                      {row[column.id] ?? '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredAndSortedData.length}
        page={currentPage}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />

      {/* Column Management Dialog */}
      <Dialog open={columnDialogOpen} onClose={() => setColumnDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Manage Columns</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="New Column Name"
              variant="outlined"
              size="small"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              sx={{ mb: 2 }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddColumn()
                }
              }}
            />
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleAddColumn}
              disabled={!newColumnName.trim()}
              fullWidth
            >
              Add Column
            </Button>
          </Box>

          <Box>
            {columns.map((column) => (
              <FormControlLabel
                key={column.id}
                control={
                  <Checkbox
                    checked={column.visible}
                    onChange={() => handleToggleColumn(column.id)}
                    icon={<VisibilityOff />}
                    checkedIcon={<Visibility />}
                  />
                }
                label={column.label}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setColumnDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}


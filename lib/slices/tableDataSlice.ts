import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface TableRow {
  id: string
  name: string
  email: string
  age: number
  role: string
  [key: string]: string | number // for dynamic columns
}

export interface Column {
  id: string
  label: string
  visible: boolean
}

interface TableState {
  data: TableRow[]
  columns: Column[]
  searchTerm: string
  sortColumn: string | null
  sortDirection: 'asc' | 'desc'
  currentPage: number
  rowsPerPage: number
}

const initialColumns: Column[] = [
  { id: 'name', label: 'Name', visible: true },
  { id: 'email', label: 'Email', visible: true },
  { id: 'age', label: 'Age', visible: true },
  { id: 'role', label: 'Role', visible: true },
]

const initialData: TableRow[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', age: 28, role: 'Developer' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 32, role: 'Designer' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', age: 25, role: 'Manager' },
  { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', age: 29, role: 'Developer' },
  { id: '5', name: 'Tom Brown', email: 'tom@example.com', age: 35, role: 'Designer' },
  { id: '6', name: 'Emily Davis', email: 'emily@example.com', age: 27, role: 'Developer' },
  { id: '7', name: 'Chris Wilson', email: 'chris@example.com', age: 31, role: 'Manager' },
  { id: '8', name: 'Lisa Anderson', email: 'lisa@example.com', age: 26, role: 'Developer' },
  { id: '9', name: 'David Martinez', email: 'david@example.com', age: 33, role: 'Designer' },
  { id: '10', name: 'Amy Taylor', email: 'amy@example.com', age: 24, role: 'Developer' },
  { id: '11', name: 'Robert Lee', email: 'robert@example.com', age: 30, role: 'Manager' },
  { id: '12', name: 'Maria Garcia', email: 'maria@example.com', age: 28, role: 'Developer' },
]

const initialState: TableState = {
  data: initialData,
  columns: initialColumns,
  searchTerm: '',
  sortColumn: null,
  sortDirection: 'asc',
  currentPage: 0,
  rowsPerPage: 10,
}

const tableDataSlice = createSlice({
  name: 'tableData',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
      state.currentPage = 0 // reset to first page on search
    },
    setSortColumn: (state, action: PayloadAction<string | null>) => {
      if (state.sortColumn === action.payload) {
        // toggle direction if same column
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        state.sortColumn = action.payload
        state.sortDirection = 'asc'
      }
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    toggleColumnVisibility: (state, action: PayloadAction<string>) => {
      const column = state.columns.find((col) => col.id === action.payload)
      if (column) {
        column.visible = !column.visible
      }
    },
    addColumn: (state, action: PayloadAction<{ id: string; label: string }>) => {
      const newColumn: Column = {
        id: action.payload.id.toLowerCase(),
        label: action.payload.label,
        visible: true,
      }
      // add default value to all rows for new column
      state.data.forEach((row) => {
        row[newColumn.id] = ''
      })
      state.columns.push(newColumn)
    },
    updateData: (state, action: PayloadAction<TableRow[]>) => {
      state.data = action.payload
      state.currentPage = 0
    },
    addRow: (state, action: PayloadAction<TableRow>) => {
      state.data.push(action.payload)
    },
    updateRow: (state, action: PayloadAction<{ id: string; updates: Partial<TableRow> }>) => {
      const index = state.data.findIndex((row) => row.id === action.payload.id)
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...action.payload.updates }
      }
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((row) => row.id !== action.payload)
    },
  },
})

export const {
  setSearchTerm,
  setSortColumn,
  setCurrentPage,
  toggleColumnVisibility,
  addColumn,
  updateData,
  addRow,
  updateRow,
  deleteRow,
} = tableDataSlice.actions

export default tableDataSlice.reducer


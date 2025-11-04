# Dynamic Data Table Manager

A modern data table management application built with Next.js, Redux Toolkit, TypeScript, and Material UI.

## Features

- **Sorting**: Click on column headers to sort data in ascending/descending order
- **Search**: Real-time search across all visible columns
- **Pagination**: 10 rows per page with easy navigation
- **Column Management**: Show/hide columns and add new custom columns (like Department, Location, etc.)
- **Data Persistence**: All preferences saved to localStorage via Redux Persist
- **CSV Import/Export**: Import data from CSV files and export only visible columns to CSV

## Tech Stack

- **Next.js 14** (App Router)
- **Redux Toolkit** - State management
- **Redux Persist** - Local storage persistence
- **TypeScript** - Type safety
- **Material UI** - UI components
- **PapaParse** - CSV parsing
- **FileSaver.js** - File downloads

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/chetan-04/dynamic-data-table-manager.git
```

2. Navigate to project directory:
```bash
cd dynamic-data-table-manager
```

3. Install dependencies:
```bash
npm install
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
dynamic-data-table-manager/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx          # Main page
│   └── globals.css       # Global styles
├── components/
│   ├── DataTable.tsx     # Main table component
│   └── Providers.tsx     # Redux & MUI providers
├── lib/
│   ├── store.ts          # Redux store configuration
│   ├── hooks.ts          # Typed Redux hooks
│   └── slices/
│       └── tableDataSlice.ts  # Redux slice for table state
└── utils/
    └── csvUtils.ts       # CSV import/export utilities
```

## Usage

### Sorting
- Click on any column header to sort by that column
- Click again to toggle between ascending and descending order

### Search
- Type in the search box to filter rows across all visible columns
- Search is case-insensitive and works in real-time

### Column Management
- Click "Manage Columns" button to open column settings
- Toggle visibility of columns using checkboxes
- Add new columns by entering column name and clicking "Add Column"

### CSV Import/Export
- **Export**: Click "Export CSV" to download current visible data as CSV file
- **Import**: Click "Import CSV" and select a CSV file to import data
- Imported CSV files will automatically add new columns if they don't exist

## Build for Production

```bash
npm run build
npm start
```

## License

This project is open source and available for educational purposes.

## Author

Chetan-04


'use client'

import { Container, Typography, Box } from '@mui/material'
import DataTable from '@/components/DataTable'

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dynamic Data Table Manager
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your data with sorting, search, pagination, and column customization
        </Typography>
      </Box>
      <DataTable />
    </Container>
  )
}


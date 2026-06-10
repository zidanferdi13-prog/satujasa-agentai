import { useState } from 'react'
import { PageHeader } from '../../../components/shared/PageHeader'
import { DataTable } from '../../../components/shared/DataTable'
import { Card, CardContent } from '../../../components/ui'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { Button, Input } from '../../../components/ui'

interface Owner {
  id: string
  name: string
  email: string
  tier: string
  status: string
}

export function OwnersPage() {
  const [search, setSearch] = useState('')
  const [owners] = useState<Owner[]>([])

  const columns = [
    { key: 'name' as const, label: 'Name' },
    { key: 'email' as const, label: 'Email' },
    { key: 'tier' as const, label: 'Subscription Tier' },
    { key: 'status' as const, label: 'Status' },
  ]

  return (
    <DashboardLayout>
      <PageHeader 
        title="Kelola Owner" 
        description="Lihat dan kelola semua owner"
        action={<Button>Tambah Owner</Button>}
      />

      <Card className="mb-6">
        <CardContent className="pt-6">
          <Input 
            placeholder="Cari owner..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={owners}
            keyExtractor={(row) => row.id}
            isEmpty={owners.length === 0}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

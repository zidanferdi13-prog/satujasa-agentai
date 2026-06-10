import { useParams } from 'react-router-dom'
import { PageHeader } from '../../../components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from '../../../components/ui'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'

export function OwnerDetailPage() {
  const { id } = useParams()

  return (
    <DashboardLayout>
      <PageHeader 
        title="Detail Owner" 
        description={`Owner ID: ${id}`}
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Owner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Nama</p>
                <p className="font-medium">—</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="font-medium">—</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Status</p>
                <Badge className="mt-1">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Tier</p>
                <p className="font-semibold">—</p>
              </div>
              <Button className="w-full">Upgrade Tier</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

import DivisionPageTemplate from '@/components/admin/DivisionPageTemplate'

export default function ServicesDivisionPage() {
  return (
    <DivisionPageTemplate
      division="services"
      extraTabs={[
        { id: 'clients', label: 'Active Clients' },
        { id: 'tickets', label: 'Tickets' },
        { id: 'monitoring', label: 'Monitoring' },
      ]}
    />
  )
}

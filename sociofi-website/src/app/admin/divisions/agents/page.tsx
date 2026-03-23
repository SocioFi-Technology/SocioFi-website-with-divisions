import DivisionPageTemplate from '@/components/admin/DivisionPageTemplate'

export default function AgentsDivisionPage() {
  return (
    <DivisionPageTemplate
      division="agents"
      extraTabs={[
        { id: 'deployments', label: 'Active Deployments' },
        { id: 'catalog', label: 'Agent Catalog' },
        { id: 'monitoring', label: 'Monitoring' },
      ]}
    />
  )
}

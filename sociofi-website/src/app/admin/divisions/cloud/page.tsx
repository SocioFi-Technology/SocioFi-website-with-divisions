import DivisionPageTemplate from '@/components/admin/DivisionPageTemplate'

export default function CloudDivisionPage() {
  return (
    <DivisionPageTemplate
      division="cloud"
      extraTabs={[
        { id: 'infrastructure', label: 'Infrastructure' },
        { id: 'incidents', label: 'Incidents' },
      ]}
    />
  )
}

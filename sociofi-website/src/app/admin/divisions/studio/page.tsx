import DivisionPageTemplate from '@/components/admin/DivisionPageTemplate'

export default function StudioDivisionPage() {
  return (
    <DivisionPageTemplate
      division="studio"
      extraTabs={[
        { id: 'projects', label: 'Active Projects' },
        { id: 'proposals', label: 'Proposals' },
        { id: 'portfolio', label: 'Portfolio' },
      ]}
    />
  )
}

import DivisionPageTemplate from '@/components/admin/DivisionPageTemplate'

export default function VenturesDivisionPage() {
  return (
    <DivisionPageTemplate
      division="ventures"
      extraTabs={[
        { id: 'applications', label: 'Applications' },
        { id: 'portfolio', label: 'Portfolio' },
      ]}
    />
  )
}

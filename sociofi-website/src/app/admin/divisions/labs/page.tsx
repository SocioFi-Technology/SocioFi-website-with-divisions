import DivisionPageTemplate from '@/components/admin/DivisionPageTemplate'

export default function LabsDivisionPage() {
  return (
    <DivisionPageTemplate
      division="labs"
      extraTabs={[
        { id: 'blog', label: 'Blog' },
        { id: 'experiments', label: 'Experiments' },
      ]}
    />
  )
}

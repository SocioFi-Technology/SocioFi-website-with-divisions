import DivisionPageTemplate from '@/components/admin/DivisionPageTemplate'

export default function ProductsDivisionPage() {
  return (
    <DivisionPageTemplate
      division="products"
      extraTabs={[
        { id: 'monitoring', label: 'Monitoring' },
      ]}
    />
  )
}

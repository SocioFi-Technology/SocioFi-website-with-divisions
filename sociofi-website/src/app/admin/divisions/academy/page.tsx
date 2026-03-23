import DivisionPageTemplate from '@/components/admin/DivisionPageTemplate'

export default function AcademyDivisionPage() {
  return (
    <DivisionPageTemplate
      division="academy"
      extraTabs={[
        { id: 'enrollments', label: 'Enrollments' },
        { id: 'courses', label: 'Courses' },
        { id: 'workshops', label: 'Workshops' },
      ]}
    />
  )
}

export default function AcademyPage({ params }: { params: { slug: string[] } }) {
  return <main><h1>Academy: {params.slug?.join('/')}</h1></main>;
}

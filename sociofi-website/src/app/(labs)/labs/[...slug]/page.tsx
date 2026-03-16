export default function LabsPage({ params }: { params: { slug: string[] } }) {
  return <main><h1>Labs: {params.slug?.join('/')}</h1></main>;
}

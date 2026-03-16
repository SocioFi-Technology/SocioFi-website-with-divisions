export default function ServicesPage({ params }: { params: { slug: string[] } }) {
  return <main><h1>Services: {params.slug?.join('/')}</h1></main>;
}

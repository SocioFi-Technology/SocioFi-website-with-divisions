export default function VenturesPage({ params }: { params: { slug: string[] } }) {
  return <main><h1>Ventures: {params.slug?.join('/')}</h1></main>;
}

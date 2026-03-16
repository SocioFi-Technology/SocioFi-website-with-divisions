export default function CloudPage({ params }: { params: { slug: string[] } }) {
  return <main><h1>Cloud: {params.slug?.join('/')}</h1></main>;
}

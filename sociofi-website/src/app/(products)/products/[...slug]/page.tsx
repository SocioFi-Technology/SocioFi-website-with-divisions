export default function ProductsPage({ params }: { params: { slug: string[] } }) {
  return <main><h1>Products: {params.slug?.join('/')}</h1></main>;
}

export default async function Home() {
  return (
    <main>
      <div>Hello world - {process.env.NEXT_PUBLIC_BASE_HOST}</div>
    </main>
  );
}

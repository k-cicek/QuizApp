import Container from "@/components/Container";

export default async function Home() {
  let data = await fetch("https://jsonplaceholder.typicode.com/posts")
  let questions = await data.json() as ApiResponse;

  return (
    <Container questions={questions} />
  );
}

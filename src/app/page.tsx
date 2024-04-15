import { reset } from "@server/db/reset"

export default async function HomePage() {
  await reset()

  return <main></main>
}

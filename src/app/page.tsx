import { Button } from "@shad"

import { reset } from "@server/db/reset"

export default async function HomePage() {
  await reset()

  return (
    <main>
      <h1>Hello</h1>
      <Button>Test</Button>
    </main>
  )
}

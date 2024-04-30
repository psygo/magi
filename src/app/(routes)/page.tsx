import { redirect } from "next/navigation"

export default function HomePage() {
  redirect("/canvases/open-canvas")
}

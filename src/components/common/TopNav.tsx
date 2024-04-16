import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"

import { Button } from "@shad"

export function TopNav() {
  return (
    <nav className="absolute top-0 w-screen p-3 flex justify-between">
      <div></div>

      <div className="flex gap-2 items-center">
        <Button>Regen Data</Button>

        <div className="flex items-center">
          <SignedOut>
            <Button>
              <SignInButton />
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}

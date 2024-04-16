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
      <LeftTopnav />
      <RightTopnav />
    </nav>
  )
}

function LeftTopnav() {
  return <div></div>
}

function RightTopnav() {
  return (
    <div className="flex gap-2 items-center">
      <SignedOut>
        <Button>
          <SignInButton />
        </Button>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}

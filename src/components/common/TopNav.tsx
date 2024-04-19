import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"

import { Button } from "@shad"

import { ThemeButton } from "./ThemeButton"

export function TopNav() {
  return (
    <nav className="z-50 absolute top-1 w-screen p-4 flex justify-between">
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
      <ThemeButton />
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

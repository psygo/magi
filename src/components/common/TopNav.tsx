import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"

import { Button } from "~/components/common/shad/exports"

export function TopNav() {
  return (
    <nav className="absolute top-[2px] desktop:top-14 w-screen p-4 flex justify-between">
      <LeftTopnav />
      {/* <RightTopnav /> */}
    </nav>
  )
}

function LeftTopnav() {
  return <div></div>
}

function RightTopnav() {
  return (
    <div className="flex desktop:flex-col gap-2 items-center desktop:items-end z-50">
      <SignedOut>
        <Button asChild>
          <SignInButton />
        </Button>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"

import { Button } from "@shad"

export function AccountButton() {
  return (
    <div className="pt-[6px]">
      <SignedOut>
        <Button
          asChild
          size="sm"
          variant="secondary"
          className="mt-[-2px]"
        >
          <SignInButton />
        </Button>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}

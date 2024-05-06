import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"

import { Button } from "~/components/common/shad/exports"

export function AccountButton() {
  return (
    <div className="pt-[6px]">
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

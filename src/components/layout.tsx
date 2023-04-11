import Link from "next/link";
import type { PropsWithChildren } from "react";
import { SignInButton, useUser, UserButton } from "@clerk/nextjs";

function PageLayout(props: PropsWithChildren) {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  if (!userLoaded) return <div />;

  return (
    <>
      <header>
        <nav>
          <Link href="/">
            <div></div>
          </Link>
          {!isSignedIn && <SignInButton />}
          {isSignedIn && <UserButton />}
        </nav>
      </header>
      <main>{props.children}</main>
    </>
  );
}

export default PageLayout;

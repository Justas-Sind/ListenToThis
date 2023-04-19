import Link from "next/link";
import type { PropsWithChildren } from "react";
import { SignInButton, useUser, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import logoFull from "public/images/logo-full.svg";

function PageLayout(props: PropsWithChildren) {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  if (!userLoaded) return <div />;

  return (
    <div>
      <header className="bg-white">
        <nav className="flex items-center justify-between px-3 py-2">
          <Link href="/">
            <Image
              src={logoFull as string}
              alt="App logo"
              width={140}
              draggable="false"
            />
          </Link>
          {!isSignedIn && (
            <SignInButton mode="modal" redirectUrl="/listen">
              <button className="rounded-full bg-red-500 px-3.5 py-2 text-sm font-semibold leading-none text-white outline-2 outline-red-300 transition-colors duration-300 hover:bg-red-600 focus:bg-red-600 focus:outline active:bg-red-700">
                Sign in
              </button>
            </SignInButton>
          )}
          {isSignedIn && <UserButton />}
        </nav>
      </header>
      <main>{props.children}</main>
    </div>
  );
}

export default PageLayout;

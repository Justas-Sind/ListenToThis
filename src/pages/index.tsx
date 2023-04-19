import { type NextPage } from "next";
import Link from "next/link";

import PageLayout from "~/components/layout";
import { SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import wave1 from "public/images/wave1.svg";
import wave2 from "public/images/wave2.svg";

const Home: NextPage = () => {
  // const hello = api.songSuggestions.hello.useQuery({ text: "from tRPC" });
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <section
        className="relative grid h-[80vh] place-items-center overflow-hidden bg-gradient-to-b from-white
       to-indigo-600"
      >
        <div className="">
          {!isSignedIn && (
            <SignInButton mode="modal" redirectUrl="/listen">
              <button className="text-m rounded-xl border-4 border-white bg-transparent px-5 py-2 font-semibold leading-none text-white outline-2 outline-amber-500 transition-colors duration-300 hover:bg-white hover:text-slate-900 focus:bg-white focus:text-slate-900 focus:outline active:bg-amber-50">
                Lets start
              </button>
            </SignInButton>
          )}
          {isSignedIn && (
            <Link href="/listen">
              <button className="text-m relative z-10 rounded-xl border-4 border-white bg-transparent px-5 py-2 font-semibold leading-none text-white outline-2 outline-amber-500 transition-colors duration-300 hover:bg-white hover:text-slate-900 focus:bg-white focus:text-slate-900 focus:outline active:bg-amber-50">
                Lets start
              </button>
            </Link>
          )}
        </div>
      </section>
      <div>
        <Image
          src={wave1 as string}
          alt=""
          priority
          className="mt-[-1px] w-full"
          draggable="false"
        />
      </div>
      <section className="bg-pattern2 before:bg-repeat sm:bg-cover">
        <div className="text-black">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est eius
          libero blanditiis voluptas quod commodi debitis, repellendus,
          temporibus deserunt doloremque in sunt! Modi perspiciatis a ea alias
          excepturi quibusdam est cupiditate inventore adipisci, libero facilis
          itaque aut odit obcaecati qui dicta debitis! Odio doloremque sapiente
          esse incidunt architecto nostrum aliquid.Lorem ipsum dolor, sit amet
          consectetur adipisicing elit. Est eius Lorem ipsum dolor, sit amet
          consectetur adipisicing elit. Est eius libero blanditiis voluptas quod
          commodi debitis, repellendus, temporibus deserunt doloremque in sunt!
          Modi perspiciatis a ea alias excepturi quibusdam est cupiditate
          inventore adipisci, libero facilis itaque aut odit obcaecati qui dicta
          debitis! Odio doloremque sapiente esse incidunt architecto nostrum
          aliquid.Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est
          eius Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est
          eius libero blanditiis voluptas quod commodi debitis, repellendus,
          temporibus deserunt doloremque in sunt! Modi perspiciatis a ea alias
          excepturi quibusdam est cupiditate inventore adipisci, libero facilis
          itaque aut odit obcaecati qui dicta debitis! Odio doloremque sapiente
          esse incidunt architecto nostrum aliquid.Lorem ipsum dolor, sit amet
          consectetur adipisicing elit. Est eius
        </div>
        <div>
          <Image
            src={wave2 as string}
            alt=""
            priority
            className="mt-[-1px] w-full"
            draggable="false"
          />
        </div>
      </section>
    </PageLayout>
  );
};

export default Home;

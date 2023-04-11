import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";
import PageLayout from "~/components/layout";

const Home: NextPage = () => {
  // const hello = api.songSuggestions.hello.useQuery({ text: "from tRPC" });

  return (
    <PageLayout>
      <div>
        HOME PAGE
      </div>
    </PageLayout>
  );
};

export default Home;

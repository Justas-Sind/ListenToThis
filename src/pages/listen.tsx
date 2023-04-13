import Head from "next/head";
import PageLayout from "~/components/layout";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "~/utils/api";
import { useState } from "react";

const schema = z.object({
  description: z
    .string()
    .min(1, { message: "Please enter a description" })
    .max(100, { message: "The maximum description length is 100 symbols" }),
});

type Description = z.infer<typeof schema>;

function MusicDescriptionWizard() {
  const {
    register,
    resetField,
    handleSubmit,
    formState: { errors },
  } = useForm<Description>({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const [receivedBands, setReceivedBands] = useState("");

  console.log(receivedBands)

  const { mutate, isLoading: isPosting } = api.songSuggestions.getMusic.useMutation({
    onSuccess: (e) => {
      resetField("description");
      console.log(e?.content)
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) console.log(errorMessage[0]);
      else console.log("failed");
    },
  });

  const onSubmit: SubmitHandler<Description> = (data) => {
    mutate({content: data.description});
  }

  return (

    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <textarea
          placeholder="Music similar to Solo Ansamblis"
          cols={50}
          {...register("description")}
          className="bg-gray-100 border-2 border-gray-300 p-4 rounded-lg" 
        />
        <p>{errors.description?.message}</p>
      </div>
      <button className="bg-gray-100" type="submit">
        Send
      </button>
    </form>
  );
}

function FindMusicPage() {
  return (
    <>
      <Head>
        <title>Find Music</title>
      </Head>
      <PageLayout>
        <div>MUSIC PAGE</div>
        <MusicDescriptionWizard />
      </PageLayout>
    </>
  );
}

export default FindMusicPage;

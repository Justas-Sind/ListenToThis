import Head from "next/head";
import PageLayout from "~/components/layout";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "~/utils/api";
import { useState } from "react";
import type { FilteredTrack } from "~/types/SpotifyTypes";

const schema = z.object({
  description: z
    .string()
    .min(10, { message: "Please enter a description" })
    .max(100, { message: "The maximum description length is 100 symbols" }),
});

type Description = z.infer<typeof schema>;

function MusicDescriptionWizard({
  handleReceivedSongs,
}: {
  handleReceivedSongs: (data: FilteredTrack[]) => void;
}) {
  const {
    register,
    resetField,
    handleSubmit,
    formState: { errors },
  } = useForm<Description>({
    resolver: zodResolver(schema),
  });

  const { mutate, isLoading: isPosting } =
    api.songSuggestions.getMusic.useMutation({
      onSuccess: (e) => {
        resetField("description");
        const response = e;
        console.log(response);
        if (response === "error") console.log("error");
        else if (typeof response === "object") handleReceivedSongs(response);
        else console.log("failed");
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) console.log(errorMessage[0]);
        else console.log("failed");
      },
    });

  const onSubmit: SubmitHandler<Description> = (data) => {
    mutate({ content: data.description });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-1.5">
      <div className="relative pb-3 w-full sm:w-1/2">
        <textarea
          placeholder="Music similar to Solo Ansamblis"
          {...register("description")}
          className="rounded-lg border-2 border-gray-300 bg-gray-100 p-4 text-slate-900 w-full"
        />
        <p className="text-slate-900 font-bold text-center text-xs absolute bottom-0 w-full">{errors.description?.message}</p>
      </div>
      <button
        className="rounded-full bg-indigo-500 px-3.5 py-2 text-sm font-semibold leading-none text-white outline-2 outline-red-300 transition-colors duration-300 hover:bg-indigo-600 focus:bg-indigo-600 focus:outline active:bg-indigo-700"
        type="submit"
      >
        Browse
      </button>
    </form>
  );
}

function SongList({ receivedSongs }: { receivedSongs: FilteredTrack[] }) {
  return (
    <div>
      {receivedSongs.map((song) => (
        <div key={song.id}>
          <div className="text-slate-900">{song.name}</div>
        </div>
      ))}
    </div>
  );
}

function FindMusicPage() {
  const [receivedSongs, setReceivedSongs] = useState([] as FilteredTrack[]);

  function handleReceivedSongs(data: FilteredTrack[]) {
    setReceivedSongs(data);
  }

  return (
    <>
      <Head>
        <title>Find Music</title>
      </Head>
      <PageLayout>
        <section className="m-4">
          <MusicDescriptionWizard handleReceivedSongs={handleReceivedSongs} />
        </section>
        <section>
          {receivedSongs.length > 0 && (
            <SongList receivedSongs={receivedSongs} />
          )}
        </section>
      </PageLayout>
    </>
  );
}

export default FindMusicPage;

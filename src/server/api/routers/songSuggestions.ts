/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { filterSongsForClient } from "~/server/helpers/filterSongsForClient";
import type { Track } from "~/types/SpotifyTypes";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);
const clientId = process.env.SPOTIFY_CLIENT_ID as string;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET as string;

async function getSpotifyAccessToken() {
  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  })
    .then((response) => response.json())
    .then((data) => {
      const accessToken = data as { access_token: string };
      return accessToken.access_token;
    });
}

async function getSpotifyArtistID(artistName: string, accessToken: string) {
  return fetch(
    `https://api.spotify.com/v1/search?q=${artistName}&type=artist&offset=0&limit=1`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => data.artists.items[0].id as string);
}

async function getSpotifyArtistTopTracks(
  artistId: string,
  accessToken: string
) {
  return fetch(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=LT`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => data.tracks as Track[]);
}

const configPrompt =
  "Provide an array of 5 names of music artists or bands separated by commas. Your answer must only contain the array of names. In case the description is not sufficient, answer with a single word 'error'. The provided artists or bands should be based on the following description: ";

export const songRouter = createTRPCRouter({
  getMusic: privateProcedure
    .input(z.object({ content: z.string().min(10).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.userId;

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: configPrompt + input.content,
          },
        ],
        max_tokens: 1000,
      });
      const suggestedArtists = response.data.choices[0]?.message?.content;

      if (
        (suggestedArtists?.includes("error") && suggestedArtists.length < 10) ||
        !suggestedArtists
      ) {
        return "error";
      }

      const rawArtistsArray = suggestedArtists
        .replace(/[\[\]]/g, "")
        .split(",");
      const suggestedArtistsArray = rawArtistsArray.map((band) => band.trim());

      const spotifyAccessToken = await getSpotifyAccessToken();
      // TODO: handle error if no access token

      const artistIdArray = await Promise.all(
        suggestedArtistsArray.map(async (band) => {
          const encodedBandName = encodeURIComponent(band);
          const artistId = await getSpotifyArtistID(
            encodedBandName,
            spotifyAccessToken
          );
          return artistId;
        })
      );
      // TODO: handle error if no artist id
      const artistTopTracksArray = await Promise.all(
        artistIdArray.map(async (artistId) => {
          let artistTopTracks = await getSpotifyArtistTopTracks(
            artistId,
            spotifyAccessToken
          );
          artistTopTracks = artistTopTracks.slice(0, 3);
          return artistTopTracks;
        })
      );
      // TODO: handle error if no artist top tracks
      const flatTracksArray = artistTopTracksArray.flat();

      return filterSongsForClient(flatTracksArray);
    }),
});

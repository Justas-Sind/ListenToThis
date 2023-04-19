import type { Track } from "~/types/SpotifyTypes";

import type { FilteredTrack } from "~/types/SpotifyTypes";

export function filterSongsForClient(songs: Track[]) {
  return songs.map((song) => ({
    id: song.id,
    name: song.name,
    artists: song.artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
    })),
    album: {
      name: song.album.name,
      image: song.album.images[0].url,
    },
    external_url: song.external_urls.spotify,
    explicit: song.explicit,
    preview_url: song.preview_url,
  })) as FilteredTrack[];
}
export type ExternalURL = {
  [key: string]: string;
};

export type SpotifyImage = {
  url: string;
};

export type SimplifiedArtist = {
  id: string;
  name: string;
};

type NonEmptyArray<T> = [T, ...T[]];

export type SimplifiedAlbum = {
  images: NonEmptyArray<SpotifyImage>;
  name: string;
};

export type Track = {
  album: SimplifiedAlbum;
  artists: SimplifiedArtist[];
  explicit: boolean;
  external_urls: ExternalURL;
  id: string;
  name: string;
  preview_url: string | null;
};

export type FilteredTrack = {
  id: string;
  name: string;
  artists: {
    id: string;
    name: string;
  }[];
  album: {
    name: string;
    image: string;
  };
  external_url: string;
  explicit: boolean;
  preview_url: string | null;
};
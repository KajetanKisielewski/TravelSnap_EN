export interface UnsplashPhoto {
  id: string;

  urls: {
    regular: string;

    small: string;
  };

  user: {
    name: string;
  };
}

export interface UnsplashResponse {
  total: number;

  results: UnsplashPhoto[];
}
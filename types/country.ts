export interface Country {
  name: {
    common: string;

    official: string;
  };

  flags: {
    png: string;

    svg: string;
  };

  capital?: string[];

  currencies?: Record<
    string,
    {
      name: string;

      symbol: string;
    }
  >;

  region?: string;
}
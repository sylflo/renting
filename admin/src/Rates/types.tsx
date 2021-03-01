type PriceYearType = {
  [key: string]: {
    collapse: boolean;
    prices: PriceItemType[];
    seasons: SeasonType[];
  };
};

type PriceItemType = {
  id: number;
  title: string;
  year: number;
  color: string;
  night: number;
  week: number;
  weekend: number;
  minimumDuration: number;
  seasons: SeasonType[];
};

type SeasonType = {
  id: number;
  date: string;
  end: boolean;
  start: boolean;
  rate: {
    date: string;
    title: string;
    id: number;
  };
};

type QueryPriceType = {
  seasonRates: [PriceItemType];
};

export type PriceYear = PriceYearType;
export type PriceItem = PriceItemType;
export type Season = SeasonType;
export type QueryPrice = QueryPriceType;

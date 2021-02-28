const RATES = [
  {
    title: 'VERY_LOW_SEASON',
    week: 380,
    night: 60,
    weekend: 75,
    minimumDuration: 2,
  },
  {
    title: 'LOW_SEASON',
    week: 430,
    night: 65,
    weekend: 75,
    minimumDuration: 2,
  },
  {
    title: 'MIDDLE_SEASON',
    week: 480,
    night: 0,
    weekend: 0,
    minimumDuration: 7,
  },
  {
    title: 'HIGH_SEASON',
    week: 580,
    night: 0,
    weekend: 0,
    minimumDuration: 7,
  },
]

const SEASONS = [
  {
    titleRate: 'VERY_LOW_SEASON',
    start: '2021-01-01',
    end: '2021-02-05',
  },
  {
    titleRate: 'LOW_SEASON',
    start: '2021-02-06',
    end: '2021-04-30',
  },
  {
    titleRate: 'MIDDLE_SEASON',
    start: '2021-05-01',
    end: '2021-07-02',
  },
  {
    titleRate: 'HIGH_SEASON',
    start: '2021-07-03',
    end: '2021-08-27',
  },
  {
    titleRate: 'MIDDLE_SEASON',
    start: '2021-08-28',
    end: '2021-09-24',
  },
  {
    titleRate: 'LOW_SEASON',
    start: '2021-09-25',
    end: '2021-10-22',
  },
  {
    titleRate: 'VERY_LOW_SEASON',
    start: '2021-10-23',
    end: '2021-12-31',
  },
]

export { RATES, SEASONS }

import { Moment } from 'moment'

export interface IOverseasPeriod {
  tripStartDate: Moment;
  tripEndDate: Moment;
  description: string;
}

export interface IResidenceBreakEvent {
  fromDate: Moment;
  toDate: Moment;
  totalDaysAway: number;
}

export interface ITrip extends IOverseasPeriod {
  id: string;
}

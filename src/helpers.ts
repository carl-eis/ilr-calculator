import { cloneDeep } from 'lodash'
import { default as moment, Moment } from 'moment/moment'

import { IOverseasPeriod, IResidenceBreakEvent } from './interfaces'

export const getDefaultStartDate = (): string => {
  return moment().subtract(1, 'year').toISOString()
}

export const getTripLength = (period: IOverseasPeriod): number => {
  const { tripStartDate, tripEndDate } = period
  const result = tripEndDate.diff(tripStartDate, 'days')
  return result - 1
}

export const calculateDatesAway = (leaveDate: Moment, returnDate: Moment): number => {
  return (returnDate.diff(leaveDate, 'days')) - 1
}

export const findSafeDate = (
  startDate: Moment,
  latestUnsafeDate: Moment | null,
  periods: IOverseasPeriod[]
): Moment | null => {
  let safeDate: Moment | null = null
  if (!latestUnsafeDate) {
    return startDate.clone()
  }

  cloneDeep(periods)
    .reverse()
    .forEach((trip) => {
        const { tripEndDate } = trip
        if (!safeDate) {
          safeDate = tripEndDate.clone()
        } else if (tripEndDate.isAfter(latestUnsafeDate) && tripEndDate.isSameOrBefore(safeDate)) {
          safeDate = tripEndDate.clone()
        }
      }
    )
  return safeDate
}

export const getTravelDurationForSinglePeriod = (
  chunkStart: Moment,
  chunkEnd: Moment,
  period: IOverseasPeriod,
) => {
  const { tripStartDate, tripEndDate } = period
  if (tripEndDate.isBefore(chunkStart)) {
    return 0
  }

  if (tripStartDate.isAfter(chunkEnd)) {
    return 0
  }

  let applicableStartDate: Moment
  if (tripStartDate.isSameOrBefore(chunkStart)) {
    applicableStartDate = chunkStart
  } else {
    applicableStartDate = tripStartDate
  }

  let applicableEndDate: Moment
  if (tripEndDate.isSameOrAfter(chunkEnd)) {
    applicableEndDate = chunkEnd
  } else {
    applicableEndDate = tripEndDate
  }

  return calculateDatesAway(applicableStartDate, applicableEndDate)
}

export const getTravelDurationForAllPeriods = (start: Moment, end: Moment, periods: IOverseasPeriod[]): number => {
  return periods.reduce((acc, current) => {
    const amountDaysAway = getTravelDurationForSinglePeriod(start, end, current)
    return acc + amountDaysAway
  }, 0)
}

export const diffInYmd = (currentDate: Moment, startDate: Moment) => {
  const [a, b] = [currentDate, startDate].map(d => d.clone())

  const years = a.diff(b, 'year')
  b.add(years, 'years')

  const months = a.diff(b, 'months')
  b.add(months, 'months')

  const days = a.diff(b, 'days')
  return years + ' years, ' + months + ' months and ' + days + ' days'
}

export const f = (d: Moment) => {
  if (!d || !d.format) {
    return
  }
  return d.format('YYYY-MM-DD')
}

export const calculateLeaveToRemain = (startDate: Moment, currentDate: Moment = moment(), periodsOfAbsence: IOverseasPeriod[]) => {
  let max = 0

  let latestSafeEntryDate: Moment | null = startDate.clone()
  let latestUnsafeLeaveDate: Moment | null = null

  const chunkStart = startDate.clone()
  const chunkEnd = startDate.clone().add(1, 'year')

  let checks = 0
  const residenceBreakEvents: IResidenceBreakEvent[] = []

  while (chunkEnd.isSameOrBefore(currentDate)) {
    const totalDaysAway = getTravelDurationForAllPeriods(chunkStart, chunkEnd, periodsOfAbsence)
    if (totalDaysAway > max) {
      max = totalDaysAway
    }
    if (totalDaysAway > 180) {
      residenceBreakEvents.push({ fromDate: chunkStart, toDate: chunkEnd, totalDaysAway })
      latestSafeEntryDate = null
      latestUnsafeLeaveDate = chunkStart.clone()
    } else {
      if (!latestSafeEntryDate) {
        latestSafeEntryDate = findSafeDate(startDate, latestUnsafeLeaveDate, periodsOfAbsence)
      }
    }
    chunkStart.add(1, 'day')
    chunkEnd.add(1, 'day')
    checks++
  }

  const daysOfResidence = currentDate.clone().diff(latestSafeEntryDate, 'days')
  const daysRemaining = (365 * 5) - daysOfResidence
  const percentage = (daysOfResidence / (365 * 5) * 100).toFixed(2)
  const ilrDate = (latestSafeEntryDate ?? startDate).clone().add(5, 'years')

  return {
    checks,
    daysOfResidence,
    daysRemaining,
    ilrDate,
    latestSafeEntryDate,
    latestUnsafeLeaveDate,
    max,
    percentage,
    finalChunkStart: chunkStart,
    residenceBreakEvents,
  }
}

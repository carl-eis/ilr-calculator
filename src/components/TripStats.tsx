import { Card, Field, ProgressBar, } from '@fluentui/react-components'
import { last } from 'lodash'
import moment from 'moment'
import React, { FC, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { calculateLeaveToRemain, diffInYmd, f, } from '../helpers'
import { IOverseasPeriod, ITrip } from '../interfaces.ts'
import { startDateState, tripsState } from '../state.ts'

const StyledCard = styled(Card)`
  margin: 12px 0;
  padding: 12px;

  h1 {
    margin: 0;
  }

  h3 {
    margin-bottom: 0;
  }

  p {
    margin: 0;
  }
`

const convertTrip = (t: ITrip): IOverseasPeriod => {
  return {
    description: t.description,
    tripStartDate: t.tripStartDate,
    tripEndDate: t.tripEndDate
  }
}

interface IProps {
  [x: string]: any
}

const TripStats: FC<IProps> = (props) => {
  const startDateStr = useRecoilValue(startDateState)
  const trips = useRecoilValue(tripsState)

  const {
    startDate,
    currentDate,
  } = useMemo(() => {
    const startDate = moment(startDateStr)
    const currentDate = moment()
    return {
      startDate,
      currentDate,
    }
  }, [startDateStr])

  const tripInfo = useMemo(() => {
    const convertedTrips = trips.map(convertTrip)
    return calculateLeaveToRemain(startDate, currentDate, convertedTrips)
  }, [startDateStr, trips])

  const {
    daysOfResidence,
    daysRemaining,
    percentage,
    residenceBreakEvents,
    latestSafeEntryDate,
    ilrDate,
  } = tripInfo

  const tripInfoStr = JSON.stringify({ tripInfo, startDate, currentDate }, null, 2)

  const lastResidenceBreak = last(residenceBreakEvents)

  const diffStr = diffInYmd(ilrDate, currentDate)

  return (
    <div>
      <StyledCard>
        <h2>Stats</h2>
        <div>
          <h3>Days of residence</h3>
          <p>{daysOfResidence}</p>
        </div>
        <div>
          <h3>Days remaining</h3>
          <p>{daysRemaining}</p>
        </div>
        <div>
          <h3>Percentage complete</h3>
          <p>{percentage} %</p>
        </div>
        <div>
          <Field validationState="none">
            <ProgressBar {...props} value={parseFloat(percentage) / 100} />
          </Field>
        </div>
        <div>
          <h3>Remaining time</h3>
          <p>{diffStr}</p>
        </div>
        {!!lastResidenceBreak && (
          <div>
            <h3>Residence broken</h3>
            <p>{`${f(lastResidenceBreak.fromDate)} to ${f(lastResidenceBreak.toDate)}`}</p>
            <p>{lastResidenceBreak.totalDaysAway} days</p>
          </div>
        )}
        <div>
          <h3>Residence counted from</h3>
          <p>{f(latestSafeEntryDate ?? currentDate)}</p>
        </div>
      </StyledCard>
      <pre>{tripInfoStr}</pre>
    </div>
  )
}

TripStats.defaultProps = {}

export default TripStats

import { Button } from '@fluentui/react-components'

import { uniqueId } from 'lodash'
import moment from 'moment'
import React, { FC, useCallback } from 'react'
import { useRecoilState } from 'recoil'

import { tripsState } from '../state.ts'
import DateForm from './DateForm.tsx'
import { StyledCard } from './styles.ts'
import { TripCard } from './TripCard.tsx'

export const TripsList: FC = (props) => {
  const [trips, setTrips] = useRecoilState(tripsState)

  const addTrip = useCallback(() => {
    setTrips([
      ...trips, {
        tripStartDate: moment(),
        tripEndDate: moment(),
        description: 'Set a description for this trip',
        id: uniqueId('trip_')
      }
    ])
  }, [
    trips,
    setTrips,
  ])

  return (
    <div>
      <StyledCard>
        <DateForm></DateForm>
      </StyledCard>
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          startDate={trip.tripStartDate}
          endDate={trip.tripEndDate}
          description={trip.description}
          id={trip.id}
        ></TripCard>

      ))}
      <div style={{ width: 'auto' }}>
        <Button onClick={() => addTrip()}>Add trip</Button>
      </div>
    </div>
  )
}

export default TripsList

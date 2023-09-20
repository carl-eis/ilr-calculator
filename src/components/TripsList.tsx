import { Button } from '@fluentui/react-components'
import moment from 'moment'
import React, { FC, useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { v4 as uuid } from 'uuid'

import { tripsState } from '../state.ts'
import DateForm from './DateForm.tsx'
import { StyledCard } from './styles.ts'
import { TripCard } from './TripCard.tsx'
import TripStats from './TripStats.tsx'

export const TripsList: FC = () => {
  const [trips, setTrips] = useRecoilState(tripsState)

  const addTrip = useCallback(() => {
    setTrips([
      ...trips, {
        tripStartDate: moment().subtract(7, 'days'),
        tripEndDate: moment(),
        description: '',
        id: uuid()
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
      {trips.map((trip, index) => (
        <TripCard
          key={trip.id}
          startDate={trip.tripStartDate}
          endDate={trip.tripEndDate}
          description={trip.description}
          id={trip.id}
          index={index}
        ></TripCard>

      ))}
      <div style={{ width: 'auto' }}>
        <Button onClick={addTrip}>Add trip</Button>
      </div>
      <div>
        <TripStats/>
      </div>
    </div>
  )
}

export default TripsList

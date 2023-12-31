import { Body1, Button, Caption1, Card, CardFooter, CardHeader } from '@fluentui/react-components'
import moment from 'moment'
import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'
import { f } from '../helpers.ts'
import { ITrip } from '../interfaces.ts'
import { tripsState } from '../state.ts'
import { StyledInput } from './Input.tsx'

const StyledCard = styled(Card)`
  display: flex;
  flex: 0 1 auto;
  margin-bottom: 12px;
  width: auto;
`

const CardRow = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

interface ICardFormProps {
  description: string;
  startDate: moment.Moment;
  endDate: moment.Moment;
  id: string;
  callbackRef: React.Ref<any>
}

const CardForm: FC<ICardFormProps> = (props) => {
  const {
    description: initialDescription,
    startDate: initialStartDate,
    endDate: initialEndDate,
    id,
    callbackRef,
  } = props

  const [startDate, setStartDate] = useState(initialEndDate.format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(initialStartDate.format('YYYY-MM-DD'))
  const [description, setDescription] = useState(initialDescription)

  const [trips, setTrips] = useRecoilState(tripsState)

  const onDescriptionChange = (_, { value }) => {
    setDescription(value)
  }

  const onDateChange = (setter) => (_, { value }) => {
    setter(value)
  }

  const onSave = () => {
    const nextTrips: ITrip[] = trips.reduce((acc, currentTrip) => {
      if (currentTrip.id !== id) {
        return [...acc, currentTrip]
      }
      const nextTrip: ITrip = {
        id,
        description,
        tripStartDate: moment(startDate),
        tripEndDate: moment(endDate)
      }
      return [...acc, nextTrip]
    }, [] as ITrip[])

    setTrips(nextTrips)
  }

  useEffect(() => {
    (callbackRef as any).current = onSave
  }, [description, startDate, endDate])

  return (
    <div>
      <StyledInput
        type={'text'}
        placeholder={'Description'}
        label={'Description'}
        value={description}
        onChange={onDescriptionChange}
      />
      <StyledInput
        type={'date'}
        placeholder={'Start Date'}
        label={'Start Date'}
        value={startDate}
        onChange={onDateChange(setStartDate)}
      />
      <StyledInput
        type={'date'}
        placeholder={'End Date'}
        label={'End Date'}
        value={endDate}
        onChange={onDateChange(setEndDate)}
      />
    </div>
  )
}

export const TripCard = (props) => {
  const {
    startDate,
    endDate,
    description,
    id,
    index,
  } = props

  const [trips, setTrips] = useRecoilState(tripsState)
  const [isEditing, setIsEditing] = useState(false)

  const formattedDates = `From ${f(startDate)} to ${f(endDate)}`

  const onSaveCallbackRef = useRef(() => {})

  const daysAway = useMemo(() => {
    const start = moment(startDate)
    const end = moment(endDate)
    return end.diff(start, 'days') - 1
  }, [startDate, endDate])

  const onButtonClick = () => {
    if (isEditing) {
      onSaveCallbackRef?.current()
    }
    setIsEditing(!isEditing)
  }

  const onRemoveClick = () => {
    if (isEditing) {
      setIsEditing(false)
    } else {
      setTrips(trips.filter(item => item.id !== id))
    }
  }

  return (
    <CardRow>
      <StyledCard>
        {!isEditing && (
          <CardHeader
            header={
              <Body1>
                <b>{description || `Trip ${index + 1}`}</b>
              </Body1>
            }
            description={(
              <div>
                <div>
                  <Caption1>{formattedDates}</Caption1>
                </div>
                <div>
                  <Caption1><b>{daysAway}</b> days away</Caption1>
                </div>
              </div>
            )}
          />
        )}
        {isEditing && (
          <CardForm
            description={description}
            startDate={startDate}
            endDate={endDate}
            id={id}
            callbackRef={onSaveCallbackRef}
          />
        )}
        <CardFooter>
          <Button onClick={onButtonClick}>{isEditing ? 'Save' : 'Edit'}</Button>
          <Button onClick={onRemoveClick}>{isEditing ? 'Cancel' : 'Remove'}</Button>
        </CardFooter>
      </StyledCard>
    </CardRow>
  )
}

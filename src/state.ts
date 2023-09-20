import { atom, selector } from 'recoil'
import { getDefaultStartDate } from './helpers.ts'
import moment from 'moment'

import { ITrip } from './interfaces.ts'

export const tripsState = atom<ITrip[]>({
  key: 'tripsState',
  default: [],
})

export const startDateState = atom<string>({
  key: 'startDate',
  default: getDefaultStartDate()
})

export const startDateStr = selector({
  key: 'startDateStr',
  get: ({ get }) => {
    const startDateIso = get(startDateState)
    return moment(startDateIso).format('YYYY-MM-DD')
  }
})

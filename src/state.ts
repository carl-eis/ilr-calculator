import { atom, selector } from 'recoil'
import { getDefaultStartDate } from './helpers.ts'
import moment from 'moment'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

import { ITrip } from './interfaces.ts'

export const tripsState = atom<ITrip[]>({
  key: 'tripsState',
  default: [],
  effects: [persistAtom]
})

export const startDateState = atom<string>({
  key: 'startDate',
  default: getDefaultStartDate(),
  effects: [persistAtom]
})

export const startDateStr = selector({
  key: 'startDateStr',
  get: ({ get }) => {
    const startDateIso = get(startDateState)
    return moment(startDateIso).format('YYYY-MM-DD')
  },
})

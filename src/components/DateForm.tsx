import moment from 'moment'
import { FC } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { startDateState, startDateStr } from '../state.ts'
import { StyledInput } from './Input.tsx'

interface IProps {
  [x: string]: any
}

const DateForm: FC<IProps> = (props) => {
  const {} = props

  const setStartDate = useSetRecoilState(startDateState)
  const startDate = useRecoilValue(startDateStr)

  const onChange = (event, { value }) => {
    const formatted = moment(value).toISOString()
    setStartDate(formatted)
  }

  return (
    <StyledInput
      type={'date'}
      label={'Date of first entry'}
      onChange={onChange}
      value={startDate}
    />
  )
}

DateForm.defaultProps = {}

export default DateForm

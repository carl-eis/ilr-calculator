import { RecoilRoot, } from 'recoil'

import styled from 'styled-components'
import TripsList from '../components/TripsList.tsx'

export const Body = styled.div<any>`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fafafa;
  align-items: center;
`

const Container = styled.div`
  width: 1200px;
  max-width: 80vw;
  display: flex;
  flex-direction: column;
`

function App() {
  return (
    <RecoilRoot>
      <Body>
        <Container>
          <h1>Leave to remain calculator</h1>
          <TripsList/>
        </Container>
      </Body>
    </RecoilRoot>
  )
}

export default App

import { NavBar } from '~/components/NavBar'
import type { NextPage } from 'next'
import Image from 'next/image'
import desktopImage from '../src/static/desktop.svg'
import Typography from '@mui/material/Typography'

const Home: NextPage = () => {
  return (
    <div>
      <NavBar />
      <div style={{ position: 'absolute', left: '-80px' }}>
        <Image src={desktopImage} layout="fixed" width="700px" height="700px" />
      </div>
      <div style={{ position: 'absolute', right: '10%', top: '20%', width: '30%' }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Raleway',
            fontWeight: 700,
            color: '#FF9D6E',
            fontSize: '30px',
            marginBottom: '20px'
          }}
        >
          StarkNet for Healthcare
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Raleway',
            color: '#25282A',
            fontSize: '14px',
          }}
        >
          StarkMed is a medical information system with on-chain verification
          enabled by StarkNet.
          <br />
          <br />

          Why? Most medical records is stored in
          centralised database controlled by healthcare institutions. These data
          can be falsified when medical disputes arise. With free computation
          and high TPS enabled by StarkNet, it is a perfect platform to record
          proofs of medical procedures on-chain. This hackathon idea is a proof
          of concept for future development of an on-chain medical claim
          adjuster and a public healthcare data pool, which is applicable in
          insurance claim and medical disputes settlement. Such data pool can
          also benefit medical researchers as they might face high barriers of
          medical data collection.
        </Typography>
      </div>
    </div>
  )
}

export default Home

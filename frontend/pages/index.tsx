import { NavBar } from '~/components/NavBar'
import type { NextPage } from 'next'
import Image from 'next/image'
import desktopImage from '../src/static/desktop.svg'
import Typography from '@mui/material/Typography'
import { useStarknet } from '@starknet-react/core'
import Button from '@mui/material/Button'
import Link from 'next/link'

const Home: NextPage = () => {
  const { account } = useStarknet()
  return (
    <div>
      <NavBar />
      <div style={{ position: 'absolute', left: '-80px' }}>
        <Image src={desktopImage} layout="fixed" width="700px" height="700px" />
      </div>
      <div
        style={{ position: 'absolute', right: '10%', top: '20%', width: '30%' }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Raleway',
            fontWeight: 700,
            color: '#FF9D6E',
            fontSize: '30px',
            marginBottom: '20px',
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
          Why? Most medical records is stored in centralised database controlled
          by healthcare institutions. These data can be falsified when medical
          disputes arise. With free computation and high TPS enabled by
          StarkNet, it is a perfect platform to record proofs of medical
          procedures on-chain. This hackathon idea is a proof of concept for
          future development of an on-chain medical claim adjuster and a public
          healthcare data pool, which is applicable in insurance claim and
          medical disputes settlement. Such data pool can also benefit medical
          researchers as they might face high barriers of medical data
          collection.
        </Typography>
        {account && (
          <Button
            sx={{
              fontFamily: "'Raleway','Noto Sans HK','Noto Sans SC'",
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#25282A',
              borderRadius: '20px',
              padding: '4px 30px',
              textTransform: 'none',
              marginTop: '20px',
              '&:hover': {
                backgroundColor: '#D1D3D4',
              },
            }}
          >
            <Link href="/prescription">
              <a style={{ textDecoration: 'none', color: 'white' }}>
                Prescribe as Doctor
              </a>
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

export default Home

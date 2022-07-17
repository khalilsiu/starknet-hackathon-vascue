import { useStarknet } from '@starknet-react/core'
import axios from 'axios'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { config } from 'src/config'
import { LoginResponseData } from 'src/types/LoginResponseData'
import { ConnectWallet } from '~/components/ConnectWallet'
import { useVascueContract } from '~/hooks/vascue'

const { apiUrl } = config

const RegisterPage: NextPage = () => {
  const { account } = useStarknet()
  const { contract: vascue } = useVascueContract()

  const [data, setData] = useState<LoginResponseData | null>(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!account) {
      return
    }
    (async () => {
      try {
        const response = await axios.request({
          data: {
            walletId: account
          },
          method: "POST",
          url: apiUrl + "/auth/login",
        });
        setData(response.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoaded(true);
      }
    })();
  }, [account]);

  return (
    <div>
      <ConnectWallet />
      {loaded && data ? <>
        <p>ID: {data.user.id}</p>
        <p>Name: {data.user.name}</p>
        <p>Role: {data.user.role}</p>
      </> : <></>}
      <p>{error}</p>
      {/* TODO: Add register function here */}
    </div>
  )
}

export default RegisterPage

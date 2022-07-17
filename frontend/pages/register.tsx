import { useStarknet } from '@starknet-react/core'
import axios from 'axios'
import { AuthContext } from 'contexts/AuthContext'
import type { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react'
import { config } from 'src/config'
import { LoginResponseData } from 'src/types/LoginResponseData'
import { ConnectWallet } from '~/components/ConnectWallet'
import { useVascueContract } from '~/hooks/vascue'

const { apiUrl } = config

const RegisterPage: NextPage = () => {
  const { userId, name, role, loaded, error } = useContext(AuthContext);

  return (
    <div>
      <ConnectWallet />
      {loaded && userId && name && role ? <>
        <p>ID: {userId}</p>
        <p>Name: {name}</p>
        <p>Role: {role}</p>
      </> : <></>}
      <p>{error}</p>
      {/* TODO: Add register function here */}
    </div>
  )
}

export default RegisterPage

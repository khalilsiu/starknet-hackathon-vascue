import { useStarknet } from '@starknet-react/core';
import { createContext, memo, ReactNode, useEffect, useState } from 'react';
import { Role } from 'src/types/User';
import { config } from 'src/config'
import axios from 'axios';
import { getChecksumAddress } from 'starknet';

const { apiUrl } = config

export interface AuthContextType {
  userId: string
  name: string
  role: Role | null
  error: string
  loaded: boolean
  accessToken: string | null
}

export const AuthContext = createContext<AuthContextType>(null as any);

// eslint-disable-next-line react/display-name
export const AuthContextProvider = memo(({ children }: { children: ReactNode }) => {
  const { account } = useStarknet()
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (!account) {
      return
    }
    (async () => {
      try {
        const response = await axios.request({
          data: {
            walletId: getChecksumAddress(account)
          },
          method: "POST",
          url: apiUrl + "/auth/login",
        });
        const { user, accessToken } = response.data.data
        setUserId(user.id);
        setName(user.name);
        setRole(user.role);
        setAccessToken(accessToken)
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoaded(true);
      }
    })();
  }, [account]);

  return (
    <AuthContext.Provider
      value={{
        error,
        loaded,
        userId,
        name,
        role,
        accessToken
      }}
    >
      {children}
    </AuthContext.Provider>
  )
});
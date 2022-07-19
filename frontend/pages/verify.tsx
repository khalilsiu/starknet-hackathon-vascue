import { useStarknet } from '@starknet-react/core'
import axios from 'axios'
import { useCallback, useContext, useState } from 'react'
import { useVascueContract } from '~/hooks/vascue'
import { config } from 'src/config'
import { ConnectWallet } from '~/components/ConnectWallet'
import { AuthContext } from 'contexts/AuthContext'
import { createHexArgs, hashCode } from 'utils'

const { apiUrl } = config

type LogType = "Prescription" | "Drug Administration"

const VerifyPage = () => {
  const { account } = useStarknet()
  const { contract: vascue } = useVascueContract()
  const [logType, setLogType] = useState<LogType>("Prescription")
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)
  const [id, setId] = useState("")
  const [data, setData] = useState<string[] | Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const { accessToken } = useContext(AuthContext);

  const getLog = useCallback(() => {
    const route = logType === "Prescription" ? "/prescriptions/" : "/drug-admin-logs/"
    const response = axios.request({
      method: "GET",
      url: apiUrl + route + id,
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response
  }, [accessToken, id, logType])

  const onSwitch = () => {
    setLogType(logType === 'Prescription' ? 'Drug Administration' : 'Prescription')
  }

  const onVerify = useCallback(async () => {
    if (account && accessToken && vascue) {
      let log
      try {
        const response = await getLog()
        console.log(response.data)
        log = response.data.data
        if (!response.data.success) {
          setError("Fail to fetch")
          return
        }
      } catch (error: any) {
        setError(error)
        return
      }


      let starknetResponse
      if (logType === 'Prescription') {
        const { caseId, doctorId, drug, frequency, quantity, route, unit } = log
        console.log(caseId, doctorId, drug, frequency, quantity, route, unit)
        const args = createHexArgs([
          id,
          caseId,
          doctorId,
          drug,
          quantity.toString(),
          unit,
          frequency,
          route,
        ])
        starknetResponse = await vascue.verify_prescription_log(id, args, args.length * 4)
      } else {
        const { prescriptionId, caseId, nurseId, drug, quantity, route, unit } = log
        const stringInputArray = [prescriptionId, caseId, nurseId, drug, quantity, route, unit]
        const input = stringInputArray.map(value => hashCode(value))
        console.log([id, caseId, nurseId, ...input])
        starknetResponse = await vascue.verify_drug_administration_log(id, input, 32)
      }

      setVerificationResult(starknetResponse.result.words[0] === 1)
      setData(log)
    }
  }, [accessToken, account, getLog, id, logType, vascue])

  return (
    <div>
      <ConnectWallet />
      <h2>Verify {logType} Log</h2>
      <p>
        <span>{logType} ID: </span>
        <input onChange={(evt) => setId(evt.target.value)} />
      </p>
      {data ? <span>{JSON.stringify(data)}</span> : <></>}
      <button onClick={onVerify}>
        Verify
      </button>
      <span>{error}</span>
      <span>Result: {JSON.stringify(verificationResult)} </span>
    </div>
  )
}

export default VerifyPage;
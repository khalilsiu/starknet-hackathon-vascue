import { useStarknet } from '@starknet-react/core'
import axios from 'axios'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { config } from 'src/config'
import { LoginResponseData } from 'src/types/LoginResponseData'
import { ConnectWallet } from '~/components/ConnectWallet'
import { useVascueContract } from '~/hooks/vascue'
import { useForm } from 'react-hook-form'
import styles from '../styles.module.css'
import { createHexArgs, hashCode, splitAndHash } from '../utils'
import { toFelt } from 'starknet/utils/number'
import { getChecksumAddress } from 'starknet'
import { toHex } from 'starknet/dist/utils/number'

const { apiUrl } = config
const drugs = [
  'Atorvastatin',
  'Levothyroxine',
  'Lisinopril',
  'Metformin',
  'Metoprolol',
  'Amlodipine',
  'Albuterol',
  'Omeprazole',
  'Losartan',
  'Gabapentin',
]

const PrescriptionPage: NextPage = () => {
  const { account } = useStarknet()
  const { contract: vascue } = useVascueContract()

  const [data, setData] = useState<LoginResponseData | null>(null)
  const [apiError, setApiError] = useState('')
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [prescriptionId, setPrescriptionId] = useState('')
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      caseId: 'Peter',
      drug: 'Penecillin',
      quantity: 10,
      unit: 'pill',
      frequency: 'hr',
      route: 'Hong Kong',
    },
  })
  const onSubmit = async (formData: any) => {
    console.log({ formData })
    if (!data) {
      setApiError('')
      return
    }
    formData.quantity = parseInt(formData.quantity)
    try {
      const response = await axios.request({
        data: {
          doctorId: data.user.id,
          ...formData,
        },
        method: 'POST',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
        url: apiUrl + '/prescriptions',
      })
      setPrescriptionId(response.data.data.id)
      setApiError('')
      setIsDataSubmitted(true)
    } catch (e) {
      setIsDataSubmitted(false)
      setPrescriptionId('')
      setApiError(JSON.stringify((e as any).response.data.errors))
    }
  }

  const handleAttest = async () => {
    if (!vascue || !data || !data.user || !data.user.id) {
      return
    }
    try {
      const { caseId, drug, quantity, unit, frequency, route } = getValues()

      const args = createHexArgs([
        prescriptionId,
        caseId,
        data.user.id,
        drug,
        quantity.toString(),
        unit,
        frequency,
        route,
      ])

      console.log('createHexArgs', args)

      const [res0, res1, res2, res3]: any[] = await vascue.compute_keccak(
        args,
        4 * args.length
      )
      const resp2 = await vascue.attest_prescription_log(
        prescriptionId,
        toHex(res0),
        toHex(res1),
        toHex(res2),
        toHex(res3)
      )
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (!account) {
      return
    }
    ; (async () => {
      try {
        const response = await axios.request({
          data: {
            walletId: getChecksumAddress(account),
          },
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          url: apiUrl + '/auth/login',
        })
        setData(response.data.data)
      } catch (error: any) {
        setApiError(error.message)
      } finally {
        setLoaded(true)
      }
    })()
  }, [account])

  return (
    <div>
      <ConnectWallet />
      {/* TODO: Add Prescription function here */}
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formItem}>
          <label htmlFor="caseId">Name</label>
          <input
            id="caseId"
            disabled={!loaded}
            {...(register('caseId'), { required: true, maxLength: 10 })}
          />
          {errors.caseId && <span>This field is required</span>}
        </div>
        <div className={styles.formItem}>
          <label htmlFor="drug">Drug</label>
          <select
            disabled={!loaded}
            id="drug"
            {...register('drug', { required: true })}
          >
            {drugs.map((drug) => (
              <option key={drug} value={drug}>
                {drug}
              </option>
            ))}
          </select>
          {errors.drug && <span>This field is required</span>}
        </div>
        <div className={styles.formItem}>
          <label htmlFor="quantity">Quantity</label>
          <input
            disabled={!loaded}
            id="quantity"
            {...register('quantity', { required: true, min: 0, max: 100 })}
          />
          {errors.quantity && <span>This field is required</span>}
        </div>
        <div className={styles.formItem}>
          <label htmlFor="unit">Unit</label>
          <input
            disabled={!loaded}
            id="unit"
            {...register('unit', { required: true })}
          />
          {errors.unit && <span>This field is required</span>}
        </div>
        <div className={styles.formItem}>
          <label htmlFor="frequency">Frequency</label>
          <input
            id="frequency"
            disabled={!loaded}
            {...register('frequency', { required: true })}
          />
          {errors.frequency && <span>This field is required</span>}
        </div>
        <div className={styles.formItem}>
          <label htmlFor="route">Route</label>
          <input
            disabled={!loaded}
            id="route"
            {...register('route', { required: true })}
          />
          {errors.route && <span>This field is required</span>}
        </div>
        <div className={styles.formItem}>
          <input disabled={!loaded} type="submit" />
        </div>
        <div className={styles.formItem}>
          <button onClick={handleAttest} disabled={!loaded || !isDataSubmitted}>
            Attest
          </button>
        </div>
      </form>

      {apiError && (
        <div>
          Api Errors:
          <div>{apiError}</div>
        </div>
      )}
    </div>
  )
}

export default PrescriptionPage

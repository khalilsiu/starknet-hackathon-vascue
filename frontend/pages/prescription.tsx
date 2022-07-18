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
import { hashCode } from '../utils'
import { toFelt } from 'starknet/utils/number'

const { apiUrl } = config

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
    if (!data) {
      setApiError('')
      return
    }
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
      console.log({ prescriptionId })
      const { caseId, drug, quantity, unit, frequency, route } = getValues()
      console.log(data.user.id, hashCode(data.user.id))
      const args = [
        "0x49632d5f356c4c514e492d59626d37345467363451",
        hashCode(caseId),
        "0x49632d5f356c4c514e492d59626d37345467363451",
        hashCode(drug),
        quantity,
        hashCode(unit),
        hashCode(frequency),
        hashCode(route),
      ]
      console.log(args)

      const resp = await vascue.compute_sha256(args, 32)
      // const resp = await vascue.compute_sha256(
      //   [
      //     hashCode('u7rKeBDum'),
      //     hashCode(caseId),
      //     hashCode('u7rKeBDum'),
      //     hashCode(drug),
      //     quantity,
      //     hashCode(unit),
      //     hashCode(frequency),
      //     hashCode(route),
      //   ],
      //   32
      // )
      console.log({ resp })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (!account) {
      return
    }
    ;(async () => {
      try {
        const response = await axios.request({
          data: {
            walletId: account,
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
            defaultValue="caseId"
            disabled={!loaded}
            {...(register('caseId'), { required: true })}
          />
          {errors.caseId && <span>This field is required</span>}
        </div>
        <div className={styles.formItem}>
          <label htmlFor="drug">Drug</label>
          <input
            disabled={!loaded}
            id="drug"
            {...register('drug', { required: true })}
          />
          {errors.drug && <span>This field is required</span>}
        </div>
        <div className={styles.formItem}>
          <label htmlFor="quantity">Quantity</label>
          <input
            disabled={!loaded}
            id="quantity"
            {...register('quantity', { required: true })}
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

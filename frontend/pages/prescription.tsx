import { useStarknet } from '@starknet-react/core'
import axios from 'axios'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { config } from 'src/config'
import { LoginResponseData } from 'src/types/LoginResponseData'
import { ConnectWallet } from '~/components/ConnectWallet'
import { useVascueContract } from '~/hooks/vascue'
import { FieldError, useForm } from 'react-hook-form'
import styles from '../styles.module.css'
import { createHexArgs, hashCode, splitAndHash } from '../utils'
import { toFelt } from 'starknet/utils/number'
import { getChecksumAddress } from 'starknet'
import { toHex } from 'starknet/dist/utils/number'
import { NavBar } from '~/components/NavBar'

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
const routes = [
  'Oral',
  'Intravenous',
  'Intramuscular',
  'Intrathecal',
  'Subcutaneous',
  'Rectal',
  'Buccal',
  'Vaginal',
  'Ocular',
  'Nasal',
  'Inhalation',
  'Nebulisation',
  'Cutaneous',
  'Topical',
  'Transdermal',
]

const units = ['pills', 'tablets', 'mg', 'ml']

const frequencies = ['1 per day', '2 per day', '3 per day', '4 per day']

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
      caseId: '',
      drug: 'Atorvastatin',
      quantity: 0,
      unit: 'pills',
      frequency: '1 per day',
      route: 'Oral',
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
    ;(async () => {
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

  console.log(errors)
  const handleErrors = (error: FieldError, min?: number, max?: number) => {
    if (error.type === 'max') {
      return `Please enter a number less than ${max}`
    }
    if (error.type === 'min') {
      return `Please enter a number larger than ${min}`
    }
    if (error.type === 'required') {
      return `This field is required`
    }
  }
  return (
    <div>
      <NavBar />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '50%' }}>
          {/* TODO: Add Prescription function here */}
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formItem}>
              <label htmlFor="caseId">Case ID</label>
              <input
                disabled={!loaded}
                id="caseId"
                {...register('caseId', { required: true, min: 1, max: 100 })}
              />
              {errors.caseId && <span>{handleErrors(errors.caseId)}</span>}
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
              {errors.drug && <span>{handleErrors(errors.drug)}</span>}
            </div>
            <div className={styles.formItem}>
              <label htmlFor="quantity">Quantity</label>
              <input
                disabled={!loaded}
                id="quantity"
                {...register('quantity', { required: true, min: 1, max: 100 })}
              />
              {errors.quantity && (
                <span>{handleErrors(errors.quantity, 0, 100)}</span>
              )}
            </div>
            <div className={styles.formItem}>
              <label htmlFor="unit">Unit</label>
              <select
                disabled={!loaded}
                id="unit"
                {...register('unit', { required: true })}
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              {errors.unit && <span>{handleErrors(errors.unit)}</span>}
            </div>
            <div className={styles.formItem}>
              <label htmlFor="frequency">Frequency</label>
              <select
                disabled={!loaded}
                id="frequency"
                {...register('frequency', { required: true })}
              >
                {frequencies.map((frequency) => (
                  <option key={frequency} value={frequency}>
                    {frequency}
                  </option>
                ))}
              </select>
              {errors.frequency && (
                <span>{handleErrors(errors.frequency)}</span>
              )}
            </div>
            <div className={styles.formItem}>
              <label htmlFor="route">Route</label>
              <select
                disabled={!loaded}
                id="route"
                {...register('route', { required: true })}
              >
                {routes.map((route) => (
                  <option key={route} value={route}>
                    {route}
                  </option>
                ))}
              </select>
              {errors.route && <span>{handleErrors(errors.route)}</span>}
            </div>
            <div className={styles.formItem}>
              <input disabled={!loaded} type="submit" />
            </div>
            <div className={styles.formItem}>
              <button
                onClick={handleAttest}
                disabled={!loaded || !isDataSubmitted}
              >
                Attest
              </button>
            </div>
          </form>

          {prescriptionId && (
            <div className="errors">
              Your Prescription ID is 
              <div>{prescriptionId}</div>
            </div>
          )}

          {apiError && (
            <div className="errors">
              API Errors:
              <div>{apiError}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PrescriptionPage

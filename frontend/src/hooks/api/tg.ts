import { useApi } from './index'

export interface ExchangeForm {
  sendToken: number
  sendCurrency: number
  receiveToken: number
  receiveCurrency: number
  wallet?: string
}

export interface ExchangeProperties {
  sendToken: number
  sendCurrency: string
  receiveToken: number
  receiveCurrency: string
  wallet?: string
}

export function useApiTg() {
  const { axiosClient } = useApi()

  const generateLink = async (props: ExchangeProperties, params?): Promise<any[]> => {
    const { data } = await axiosClient.post('tg', props, { params })
    return data
  }

  return {
    generateLink,
  }
}

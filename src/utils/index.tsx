import { ERROR_MESSAGE } from '@/constants/constants'

export const getErrorMessage = (error: any) => {
  console.log(error)
  return error?.response?.data?.message || ERROR_MESSAGE
}

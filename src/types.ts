export interface Item {
  id: number
  categoryid: number
  unitid: number
  code: string
  name: string
  quantity: number
  description: string
  image: string | undefined
}

interface BasicData {
  id: number
  name: string
}

export interface Division extends BasicData {}
export interface Category extends BasicData {}
export interface Unit extends BasicData {}
export interface People extends BasicData {}
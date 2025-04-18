export interface Item {
  id: number
  categoryid: number
  unitid: number
  divisionid: number
  code: string
  name: string
  quantity: number
  location: string
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
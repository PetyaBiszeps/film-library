export interface ICommonCard {
  title: string
  meta?: string
  year?: string | number
  genre?: string
  duration?: string
  posterSrc?: string
  posterAlt?: string
  disabled?: boolean
}

export interface ICommonChip {
  label: string
  active?: boolean
  disabled?: boolean
  href?: string
  marker?: 'square' | 'bar'
}

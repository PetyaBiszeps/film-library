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

export interface ICommonDropdown {
  label: string
  title?: string
  items: ICommonDropdownItem[]
  align?: 'left' | 'right'
  disabled?: boolean
}

export interface ICommonDropdownItem {
  key: string
  label: string
  active?: boolean
  disabled?: boolean
}

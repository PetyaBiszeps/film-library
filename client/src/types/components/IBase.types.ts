export interface IBaseButton {
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'tertiary'
}

export interface IBaseLink {
  name?: string
  href: string
  exact?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'tertiary'
}

export interface IBaseInput {
  id?: string
  name: string
  type?: 'text' | 'number' | 'email' | 'password' | 'url' | 'search' |'tel' | 'password_confirmation'
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  autocomplete?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary'
}

export interface IBaseIcon {
  src: string
  size?: {
    x: string
    y: string
  }
}

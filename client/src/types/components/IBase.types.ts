export interface IButton {
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl'
  variant?: 'primary' | 'secondary' | 'tertiary' | 'tab'
}

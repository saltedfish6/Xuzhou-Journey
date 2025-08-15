declare module '@react-vant/icons' {
  import { FC, SVGProps } from 'react'
  
  interface IconProps extends SVGProps<SVGSVGElement> {
    className?: string
    style?: React.CSSProperties
  }
  
  export const ArrowLeft: FC<IconProps>
  export const Close: FC<IconProps>
  export const Search: FC<IconProps>
  export const Plus: FC<IconProps>
  export const Arrow: FC<IconProps>
  export const LocationO: FC<IconProps>
  export const Clock: FC<IconProps>
  export const Delete: FC<IconProps>
  export const Edit: FC<IconProps>
  export const Star: FC<IconProps>
  export const HomeO: FC<IconProps>
  export const TodoListO: FC<IconProps>
  export const ChatO: FC<IconProps>
  export const UserO: FC<IconProps>
}
import type { HTMLAttributes } from 'react'
import { ReactNode, forwardRef } from 'react'

export type FlexProps = {
  children?: ReactNode | ReactNode[]
  centered?: boolean
  justify?: 'start' | 'end' | 'center' | 'between' | 'evenly' | 'evenly'
  align?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  wrap?: boolean
  className?: string
} & HTMLAttributes<HTMLDivElement>

const tailwindClassMap = {
  justify: {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  },
  align: {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    between: 'items-between',
    around: 'items-around',
    evenly: 'items-evenly',
  },
  direction: {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  },
  wrap: 'flex-wrap',
}

const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ className, centered, direction, justify, align, wrap, children, ...restProps }, ref) => {
    const classNameArr = ['flex', ...(className?.split(' ') || [])]
    if (centered) classNameArr.push('justify-center', 'items-center')
    if (direction) classNameArr.push(tailwindClassMap.direction[direction])
    if (justify) classNameArr.push(tailwindClassMap.justify[justify])
    if (align) classNameArr.push(tailwindClassMap.align[align])
    if (wrap) classNameArr.push(tailwindClassMap.wrap)

    return (
      <div className={classNameArr.join(' ')} ref={ref} {...restProps}>
        {children}
      </div>
    )
  }
)

export default Flex

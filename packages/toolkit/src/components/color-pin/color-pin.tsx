import React, { memo, ReactNode } from 'react'

import { Color } from '../../types'

export interface ColorPinProps {
  buttonContent?: ReactNode | ((color: Color) => ReactNode),
  color: Color,
  expandsLeft?: boolean,
  isColorAdded?: boolean | ((color: Color) => boolean),
  isOpen?: boolean,
  labelContent?: ReactNode | ((Color) => ReactNode),
  onColorAdded?: (Color) => void,
  style?: { top: string, left: string, size?: string }
}

const ColorPin = ({
  buttonContent,
  color,
  expandsLeft = false,
  isColorAdded,
  isOpen = false,
  labelContent,
  onColorAdded,
  style
}: ColorPinProps): JSX.Element => {
  const { hex } = color
  const getButtonContent = typeof buttonContent === 'function' ? buttonContent?.(color) : buttonContent
  const getIsColorAdded = typeof isColorAdded === 'function' ? isColorAdded?.(color) : isColorAdded
  const getLabelContent = typeof labelContent === 'function' ? labelContent?.(color) : labelContent

  return (
    <div className='flex absolute' style={style} aria-label={color.name}>
      <button
        className={`${
          isOpen ? 'w-12 h-12 z-50' : 'w-8 h-8 z-10'
        } flex items-center justify-center border-2 border-white rounded-full ring-primary focus:outline-none focus-visible:ring-2`}
        style={{ background: hex, width: style?.size, height: style?.size }}
      >
        {!isOpen && getIsColorAdded && getButtonContent}
      </button>
      {isOpen && (
        <div className={`flex z-40 absolute ${expandsLeft ? 'right-1/2 flex-row-reverse' : 'left-1/2'} bg-white`}>
          <button
            className={`w-20 h-12 flex items-center justify-center ${
              expandsLeft ? 'pr-5' : 'pl-5'
            } border-y-2 border-white`}
            style={{ background: hex, fontSize: '2rem' }}
            onClick={() => onColorAdded?.(color)}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              e.stopPropagation()
              onColorAdded?.(color)
            }}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {getButtonContent}
          </button>
          <div className='m-auto px-2 bg-white text-dark'>{getLabelContent}</div>
        </div>
      )}
    </div>
  )
}

export default memo<ColorPinProps>(ColorPin)
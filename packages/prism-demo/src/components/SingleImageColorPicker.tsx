import React, { useState, useEffect, useContext } from 'react'
import Prism, { ImageColorPicker, ColorPin } from '@prism/toolkit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/pro-solid-svg-icons'
import { withColorData } from './withColorData'

function SingleImageColorPicker({ colors }: any) {
  const img = 'https://sherwin.scene7.com/is/image/sw/prism-cvw-lowes-nav-color-collections?fmt=jpg&qlt=95'

  return (
    <ImageColorPicker
      imgSrc={img}
      colors={colors}
      pinRenderer={(props) => (
        <ColorPin
          {...props}
          labelContent={(color) => (
            <>
              <p style={{ lineHeight: '1.1rem', whiteSpace: 'nowrap' }}>{`${color.brandKey} ${color.colorNumber}`}</p>
              <p style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{color.name}</p>
            </>
          )}
        />
      )}
      removeButtonContent={<FontAwesomeIcon aria-label='remove' icon={faTrash} style={{ display: 'inline-block' }} />}
    />
  )
}

export default withColorData(SingleImageColorPicker)

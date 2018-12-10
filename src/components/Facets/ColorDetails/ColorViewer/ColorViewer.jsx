// @flow
import React, { PureComponent } from 'react'

import { fullColorNumber } from '../../../../shared/helpers/ColorUtils'

type Props = {
  color: Object
}

class ColorViewer extends PureComponent<Props> {
  static baseClass = 'color-info'

  render () {
    const { color } = this.props

    return (
      <React.Fragment>
        <h1 className={`${ColorViewer.baseClass}__name-number`}>
          <span className={`${ColorViewer.baseClass}__number`}>{fullColorNumber(color.brandKey, color.colorNumber)}</span>
          <span className={`${ColorViewer.baseClass}__name`}>{color.name}</span>
        </h1>
        <h2 className={`${ColorViewer.baseClass}__type`}>
          {(color.isInterior) ? 'Interior' : ''}
          {(color.isInterior && color.isExterior) ? ' / ' : ''}
          {(color.isExterior) ? 'Exterior' : ''}
        </h2>
        <h3 className={`${ColorViewer.baseClass}__rack-location`}>
          Location Number: {color.storeStripLocator}
        </h3>
      </React.Fragment>
    )
  }
}

export default ColorViewer

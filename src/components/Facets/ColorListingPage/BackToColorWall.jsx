// @flow
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import ButtonBar from '../../GeneralButtons/ButtonBar/ButtonBar'

import { generateColorWallPageUrl, fullColorName } from '../../../shared/helpers/ColorUtils'
import { MODE_CLASS_NAMES } from '../ColorWall/shared'
import { type Color } from '../../../shared/types/Colors'

type StateProps = {
  color?: Color,
  family?: string,
  section?: string
}

type OwnProps = {}

type Props = StateProps & OwnProps

export function BackToColorWall ({ color, family, section }: Props) {
  // this will degrade gracefully if section and/or family and or color do(es) not exist in redux down to the root color wall URL
  const colorWallUrl = color
    ? generateColorWallPageUrl(section, family, color.id, fullColorName(color.brandKey, color.colorNumber, color.name))
    : generateColorWallPageUrl(section, family)

  return (
    <div className={MODE_CLASS_NAMES.BASE}>
      <div className={MODE_CLASS_NAMES.COL}>
        <div className={MODE_CLASS_NAMES.CELL}>
          <ButtonBar.Bar>
            <ButtonBar.Button to={colorWallUrl}>
              <FontAwesomeIcon icon={['fal', 'th-large']} pull='left' fixedWidth />
              <FormattedMessage id='BACK_TO_COLOR_WALL' />
            </ButtonBar.Button>
          </ButtonBar.Bar>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state, props) => {
  return {
    family: state.colors.family,
    section: state.colors.section,
    color: state.colors.colorWallActive
  }
}

export default connect(mapStateToProps, null)(BackToColorWall)

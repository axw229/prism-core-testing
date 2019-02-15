// @flow
import type { Color } from '../../shared/types/Colors'

import React, { PureComponent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { without, times, flatMap, intersection } from 'lodash'
import update from 'immutability-helper'
import { Link } from 'react-router-dom'

import { LP_MAX_COLORS_ALLOWED } from 'constants/configurations'

import { activate, reorder } from '../../store/actions/live-palette'
import { arrayToSpacedString } from '../../shared/helpers/StringUtils'

import { varValues } from 'variables'

import EmptySlot from './EmptySlot'
import ActiveSlot from './ActiveSlot'

import './LivePalette.scss'

type Props = {
  colors: Array<Color>,
  activateColor: Function,
  reorderColors: Function,
  activeColor: Color,
  removedColor: Color
}

type State = {
  spokenWord: string
}

class LivePalette extends PureComponent<Props, State> {
  state = {
    spokenWord: ''
  }

  pendingUpdateFn: any
  requestedFrame: number | void

  constructor (props) {
    super(props)

    this.activeSlotRef = React.createRef()
  }

  componentDidUpdate (prevProps, prevState) {
    let spokenWord: Array<string> = []
    const prevColor = prevProps.activeColor
    const curColor = this.props.activeColor

    if (this.props.removedColor && prevProps.removedColor !== this.props.removedColor) {
      spokenWord.push(`${this.props.removedColor.name} has been removed.`)
    }

    if (curColor && prevColor !== curColor) {
      spokenWord.push(`${curColor.name} has been activated.`)

      // POC AHEAD
      // TODO: This depends on manual intervention to remove unhelpful color families. Type of color (red, yellow, etc) should be
      // determined programmatically based on color values.
      if (prevColor) {
        let mainFam = without(intersection(prevColor.colorFamilyNames, curColor.colorFamilyNames), 'Timeless Color', 'Historic Color', 'White & Pastel')[0]

        if (mainFam) {
          let prevLightness = prevColor.lightness
          let curLightness = curColor.lightness

          let brightnessDifference = (curLightness > prevLightness ? 'lighter' : curLightness < prevLightness ? 'darker' : void (0))

          if (brightnessDifference) {
            spokenWord.push(`${curColor.name} is a ${brightnessDifference} ${mainFam} than ${prevColor.name}`)
          }
        }
      }
      // END POC
    }

    if (spokenWord.length) {
      this.setState({ // eslint-disable-line react/no-did-update-set-state
        spokenWord: arrayToSpacedString(spokenWord)
      })
    }
  }

  render () {
    const { colors, activeColor } = this.props

    const { spokenWord } = this.state
    // TODO: abstract below into a class method
    // calculate all the active slots
    const activeSlots = colors.map((color, index) => {
      if (color && index < LP_MAX_COLORS_ALLOWED) {
        return (<ActiveSlot
          ref={this.activeSlotRef}
          node={this.activeSlotRef} // passing the ref down as a prop so DnD has access to the DOM element
          index={index}
          key={color.id}
          color={color}
          onClick={this.activateColor}
          moveColor={this.moveColor}
          active={(activeColor.id === color.id)}
        />)
      }
    })

    // after determining active slots, determine how many empty ones there should be
    let disabledSlots = []
    const additionalSlots = (LP_MAX_COLORS_ALLOWED - 1) - activeSlots.length
    if (additionalSlots > 0) {
      disabledSlots = times(additionalSlots, (index) => <EmptySlot key={index} />)
    }

    const ADD_COLOR_TEXT = (colors.length) ? 'ADD_A_COLOR' : 'FIND_COLORS_IN_CW'
    const COLOR_TRAY_CLASS_MODIFIERS = (colors.length) ? 'add' : 'add-empty'

    return (
      <div className='prism-live-palette'>
        <div className='prism-live-palette__list'>
          {activeSlots}
          {colors.length < LP_MAX_COLORS_ALLOWED && <Link to={`/active/color-wall`} className={`prism-live-palette__slot prism-live-palette__slot--${COLOR_TRAY_CLASS_MODIFIERS}`}>
            <FontAwesomeIcon className='prism-live-palette__icon' icon={['fal', 'plus-circle']} size='2x' color={varValues.colors.swBlue} />
            <FormattedMessage id={ADD_COLOR_TEXT}>
              {(msg: string) => <span className='prism-live-palette__slot__copy'>{msg}</span>}
            </FormattedMessage>
          </Link>}
          {disabledSlots}
        </div>
        {/* This will speak the current and removed color, as well as some color-delta info. */}
        <aside aria-live='assertive' className='prism-live-palette__color-description'>{spokenWord}</aside>
      </div>
    )
  }

  activateColor = (color) => {
    this.props.activateColor(color)
  }

  scheduleUpdate = (updateFn) => {
    this.pendingUpdateFn = updateFn

    if (!this.requestedFrame) {
      this.requestedFrame = window.requestAnimationFrame(this.drawFrame)
    }
  }

  drawFrame = () => {
    const sortedColorsById = update([], this.pendingUpdateFn)

    // trigger the reordering via redux
    this.props.reorderColors(sortedColorsById)

    this.pendingUpdateFn = undefined
    this.requestedFrame = undefined
  }

  moveColor = (originColorId: Number, destinationColorId: Number) => {
    const { colors } = this.props
    // $FlowIgnore - ignoring flow validation on this line because flatMap's flow-type is more strict than lodash's actual implementation
    const colorsByIndex = flatMap(colors, color => color.id) // creates an array of only all color ids
    const originIndex = colorsByIndex.indexOf(originColorId) // get the index of the origin color
    const destIndex = colorsByIndex.indexOf(destinationColorId) // get the index of the dest color

    // shuffle the origin with the dest
    const from = colorsByIndex.splice(originIndex, 1)[0]
    colorsByIndex.splice(destIndex, 0, from)

    // schedule the rearrangement of a swatch with the browser
    this.scheduleUpdate({
      $push: colorsByIndex
    })
  }
}

const mapStateToProps = (state, props) => {
  const { lp } = state
  return {
    colors: lp.colors,
    activeColor: lp.activeColor,
    // previousActiveColor: lp.previousActiveColor,
    removedColor: lp.removedColor
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    activateColor: (color) => {
      dispatch(activate(color))
    },
    reorderColors: (colors) => {
      dispatch(reorder(colors))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LivePalette)

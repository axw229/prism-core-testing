// @flow
import React, { PureComponent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { has } from 'lodash'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { FormattedMessage } from 'react-intl'
import ReactGA from 'react-ga'

import ColorInfo from './ColorInfo/ColorInfo'
import ColorViewer from './ColorViewer/ColorViewer'
import ColorStrip from './ColorStrip/ColorStrip'
import CoordinatingColors from './CoordinatingColors/CoordinatingColors'
import SimilarColors from './SimilarColors/SimilarColors'
import SceneManager from '../../SceneManager/SceneManager'

import { paintAllMainSurfaces } from '../../../actions/scenes'
import { varValues } from 'variables'
import './ColorDetails.scss'

type Props = {
  match: any,
  colors: ColorMap,
  scenesLoaded: boolean,
  paintAllMainSurfaces: Function
}

type State = {
  sceneIsDisplayed: boolean,
  chipIsMaximized: boolean
}

class ColorDetails extends PureComponent<Props, State> {
  static baseClass = 'color-info'
  static tabNamesForGA = ['View Coord Color Section', 'View Similar Color Section', 'View Color Info Section']

  state: State = {
    sceneIsDisplayed: true,
    chipIsMaximized: false
  }

  constructor (props) {
    super(props)

    this.toggleSceneDisplay = this.toggleSceneDisplay.bind(this)
    this.toggleChipMaximized = this.toggleChipMaximized.bind(this)
    this.reportTabSwitchToGA = this.reportTabSwitchToGA.bind(this)
  }

  render () {
    const { match: { params }, colors } = this.props
    const { sceneIsDisplayed, chipIsMaximized } = this.state

    // TODO: Color Details won't be a top level component, so this may not be valid so temporarily not rendering until it has colors
    if (!colors) {
      return null
    }

    // grab the color by color number from the URL
    const activeColor = this.getColorById(params.colorId)
    if (!activeColor) {
      console.info(`ColorDetails: ${params.colorId} is not a valid color ID`)
      return null
    }

    const activeColorIsDark = activeColor.isDark

    // perform some css class logic & scaffolding instead of within the DOM itself
    let contrastingTextColor = varValues.colors.black

    let SWATCH_CLASSES = [
      `${ColorDetails.baseClass}__max-chip`
    ]
    let DISPLAY_TOGGLES_WRAPPER = [
      `${ColorDetails.baseClass}__display-toggles-wrapper`
    ]

    let SWATCH_SIZE_WRAPPER_CLASSES = DISPLAY_TOGGLES_WRAPPER.slice()
    SWATCH_SIZE_WRAPPER_CLASSES.push(`${ColorDetails.baseClass}__display-toggles-wrapper--swatch-size`)

    let MAIN_INFO_CLASSES = [
      `${ColorDetails.baseClass}__main-info`
    ]

    let SWATCH_SIZE_TOGGLE_BUTTON_CLASSES = [
      `${ColorDetails.baseClass}__display-toggle-button`,
      `${ColorDetails.baseClass}__swatch-size-toggle-button`
    ]
    let ALT_SWATCH_SIZE_TOGGLE_BUTTON_CLASSES = SWATCH_SIZE_TOGGLE_BUTTON_CLASSES.slice()
    ALT_SWATCH_SIZE_TOGGLE_BUTTON_CLASSES.push(`${ColorDetails.baseClass}__display-toggle-button--alt`)

    let SCENE_DISPLAY_TOGGLE_BUTTON_CLASSES = [
      `${ColorDetails.baseClass}__display-toggle-button`,
      `${ColorDetails.baseClass}__scene-display-toggle-button`
    ]
    let ALT_SCENE_DISPLAY_TOGGLE_BUTTON_CLASSES = SCENE_DISPLAY_TOGGLE_BUTTON_CLASSES.slice()
    ALT_SCENE_DISPLAY_TOGGLE_BUTTON_CLASSES.push(`${ColorDetails.baseClass}__scene-display-toggle-button--alt`)

    if (chipIsMaximized) {
      SWATCH_CLASSES.push(`${ColorDetails.baseClass}__max-chip--maximized`)
      SWATCH_SIZE_WRAPPER_CLASSES.push(`${ColorDetails.baseClass}__display-toggles-wrapper--chip-maximized`)
      SWATCH_SIZE_TOGGLE_BUTTON_CLASSES.push(`${ColorDetails.baseClass}__display-toggle-button--active`)
      ALT_SWATCH_SIZE_TOGGLE_BUTTON_CLASSES.push(`${ColorDetails.baseClass}__display-toggle-button--active`)
    }
    if (sceneIsDisplayed) {
      SCENE_DISPLAY_TOGGLE_BUTTON_CLASSES.push(`${ColorDetails.baseClass}__display-toggle-button--active`)
      ALT_SCENE_DISPLAY_TOGGLE_BUTTON_CLASSES.push(`${ColorDetails.baseClass}__display-toggle-button--active`)
    }
    if (activeColorIsDark) {
      contrastingTextColor = varValues.colors.white
      SWATCH_SIZE_TOGGLE_BUTTON_CLASSES.push(`${ColorDetails.baseClass}__display-toggle-button--dark-color`)
      SCENE_DISPLAY_TOGGLE_BUTTON_CLASSES.push(`${ColorDetails.baseClass}__display-toggle-button--dark-color`)
      ALT_SWATCH_SIZE_TOGGLE_BUTTON_CLASSES.push(`${ColorDetails.baseClass}__display-toggle-button--dark-color`)
      ALT_SCENE_DISPLAY_TOGGLE_BUTTON_CLASSES.push(`${ColorDetails.baseClass}__display-toggle-button--dark-color`)
      MAIN_INFO_CLASSES.push(`${ColorDetails.baseClass}__main-info--dark-color`)
    }

    return (
      <React.Fragment>
        <div className='color-detail-view'>
          <div className={SWATCH_CLASSES.join(' ')} style={{ backgroundColor: activeColor.hex }} />
          <div className={SWATCH_SIZE_WRAPPER_CLASSES.join(' ')}>
            <button className={SWATCH_SIZE_TOGGLE_BUTTON_CLASSES.join(' ')} onClick={this.toggleChipMaximized}>
              <FontAwesomeIcon className={`${ColorDetails.baseClass}__display-toggles-icon`} icon={['fal', 'arrow-left']} color={contrastingTextColor} /><FontAwesomeIcon className={`${ColorDetails.baseClass}__display-toggles-icon`} icon={['fal', 'arrow-right']} color={contrastingTextColor} />
              <div className={`${ColorDetails.baseClass}__scene-toggle-copy`}>
                <FormattedMessage id='MAXIMIZE_COLOR_SWATCH'>
                  {(txt: string) => (
                    <React.Fragment>{txt}</React.Fragment>
                  )}
                </FormattedMessage>
              </div>
            </button>
            <button className={ALT_SWATCH_SIZE_TOGGLE_BUTTON_CLASSES.join(' ')} onClick={this.toggleChipMaximized}>
              <FontAwesomeIcon className={`${ColorDetails.baseClass}__display-toggles-icon`} icon={['fal', 'arrow-right']} color={contrastingTextColor} /><FontAwesomeIcon className={`${ColorDetails.baseClass}__display-toggles-icon`} icon={['fal', 'arrow-left']} color={contrastingTextColor} />
              <div className={`${ColorDetails.baseClass}__scene-toggle-copy`}>
                <FormattedMessage id='RESTORE_COLOR_SWATCH_TO_DEFAULT_SIZE'>
                  {(txt: string) => (
                    <React.Fragment>{txt}</React.Fragment>
                  )}
                </FormattedMessage>
              </div>
            </button>
          </div>
          <div className={`color-detail__scene-wrapper ${sceneIsDisplayed ? ` color-detail__scene-wrapper--displayed` : ''}`}>
            <SceneManager maxActiveScenes={1} interactive={false} mainColor={activeColor} />
          </div>
          <div className='color-detail__info-wrapper'>
            <button className={SCENE_DISPLAY_TOGGLE_BUTTON_CLASSES.join(' ')} onClick={this.toggleSceneDisplay}>
              <FontAwesomeIcon className={`${ColorDetails.baseClass}__display-toggles-icon ${ColorDetails.baseClass}__display-toggles-icon--scene`} icon={['fal', 'home']} color={contrastingTextColor} />
              <div className={`${ColorDetails.baseClass}__scene-toggle-copy`}>
                <FormattedMessage id='DISPLAY_SCENE_PAINTER'>
                  {(txt: string) => (
                    <React.Fragment>{txt}</React.Fragment>
                  )}
                </FormattedMessage>
              </div>
            </button>
            <button className={ALT_SCENE_DISPLAY_TOGGLE_BUTTON_CLASSES.join(' ')} onClick={this.toggleSceneDisplay}>
              <FontAwesomeIcon className={`${ColorDetails.baseClass}__display-toggles-icon ${ColorDetails.baseClass}__display-toggles-icon--scene`} icon={['fas', 'home']} color={contrastingTextColor} />
              <div className={`${ColorDetails.baseClass}__scene-toggle-copy`}>
                <FormattedMessage id='HIDE_SCENE_PAINTER'>
                  {(txt: string) => (
                    <React.Fragment>{txt}</React.Fragment>
                  )}
                </FormattedMessage>
              </div>
            </button>

            <div className={MAIN_INFO_CLASSES.join(' ')} style={{ backgroundColor: activeColor.hex }}>
              <ColorViewer color={activeColor} />
              <ColorStrip key={activeColor.id} colors={colors} color={activeColor} />
            </div>
            <div className={`${ColorDetails.baseClass}__additional-info`}>
              <Tabs onSelect={this.reportTabSwitchToGA}>
                <TabList className={`${ColorDetails.baseClass}__tab-list`} style={{ backgroundColor: activeColor.hex }}>
                  <Tab className={`${ColorDetails.baseClass}__tab ${activeColor.isDark ? `${ColorDetails.baseClass}__tab--dark-color` : ''}`}>
                    <div className={`${ColorDetails.baseClass}__tab-copy`}>
                      <FormattedMessage id='COORDINATING_COLORS'>
                        {(txt: string) => (
                          <React.Fragment>{txt}</React.Fragment>
                        )}
                      </FormattedMessage>
                    </div>
                  </Tab>
                  <Tab className={`${ColorDetails.baseClass}__tab ${activeColor.isDark ? `${ColorDetails.baseClass}__tab--dark-color` : ''}`}>
                    <div className={`${ColorDetails.baseClass}__tab-copy`}>
                      <FormattedMessage id='SIMILAR_COLORS'>
                        {(txt: string) => (
                          <React.Fragment>{txt}</React.Fragment>
                        )}
                      </FormattedMessage>
                    </div>
                  </Tab>
                  <Tab className={`${ColorDetails.baseClass}__tab ${activeColor.isDark ? `${ColorDetails.baseClass}__tab--dark-color` : ''}`}>
                    <div className={`${ColorDetails.baseClass}__tab-copy`}>
                      <FormattedMessage id='DETAILS'>
                        {(txt: string) => (
                          <React.Fragment>{txt}</React.Fragment>
                        )}
                      </FormattedMessage>
                    </div>
                  </Tab>
                </TabList>
                <TabPanel className={`${ColorDetails.baseClass}__tab-panel`}>
                  <CoordinatingColors colors={colors} color={activeColor} />
                </TabPanel>
                <TabPanel className={`${ColorDetails.baseClass}__tab-panel`}>
                  <SimilarColors colors={colors} color={activeColor} />
                </TabPanel>
                <TabPanel className={`${ColorDetails.baseClass}__tab-panel color-info__tab-panel-details`}>
                  <ColorInfo color={activeColor} />
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  componentDidMount () {
    const { match: { params } } = this.props
    const color = this.getColorById(params.colorId)

    if (color) {
      ReactGA.pageview(`color-detail/${color.brandKey} ${color.colorNumber} - ${color.name}`)
    }
  }

  componentDidUpdate () {
    const { match: { params }, scenesLoaded } = this.props

    // paint all the main surfaces on load of the CDP
    const color = this.getColorById(params.colorId)
    if (scenesLoaded && color) {
      this.props.paintAllMainSurfaces(color)
    }
  }

  getColorById (colorId) {
    const { colors } = this.props

    if (!has(colors, colorId)) {
      return null
    }

    return colors[colorId]
  }

  toggleSceneDisplay = function toggleSceneDisplay () {
    this.setState({ sceneIsDisplayed: !this.state.sceneIsDisplayed })
  }

  toggleChipMaximized = function toggleChipMaximized () {
    if (!this.state.chipIsMaximized) {
      ReactGA.event({
        category: 'Color Detail',
        action: 'Maximize Swatch',
        label: 'Maximize Swatch'
      })
    }

    this.setState({ chipIsMaximized: !this.state.chipIsMaximized })
  }

  reportTabSwitchToGA (index) {
    const tabReportingName = ColorDetails.tabNamesForGA[index]

    ReactGA.event({
      category: 'Color Detail',
      action: tabReportingName,
      label: tabReportingName
    })
  }
}

const mapStateToProps = (state, props) => {
  const { colors, scenes } = state

  return {
    colors: colors.items.colorMap,
    scenesLoaded: !scenes.loadingScenes
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    paintAllMainSurfaces: (color: Color) => {
      dispatch(paintAllMainSurfaces(color))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ColorDetails))

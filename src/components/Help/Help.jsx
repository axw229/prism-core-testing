// @flow
import React, { useState, useEffect, useCallback, useContext, forwardRef } from 'react'
import CardMenu from 'src/components/CardMenu/CardMenu'
import Iconography from '../Iconography/Iconography'
import { helpHeader, filterHelpItems } from './data'
import './Help.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import debounce from 'lodash/debounce'
import camelCase from 'lodash/camelCase'
import { FormattedMessage, useIntl } from 'react-intl'
import * as scroll from 'scroll'
import { KEY_CODES } from 'src/constants/globals'
import ConfigurationContext, { type ConfigurationContextType } from 'src/contexts/ConfigurationContext/ConfigurationContext'
import '../SingleTintableSceneView/SceneSelectorNavButton.scss'

const baseClass = `cvw-help`
const wrapper = `${baseClass}__wrapper`
const tabsContainer = `${baseClass}__tabs-container`
const contentWrapper = `${baseClass}__content-wrapper`
const helpContent = `${baseClass}__help-content`
const helpContentHide = `${helpContent}--hide`
const contentHeader = `${baseClass}__content-header`
const contentDetails = `${baseClass}__content-details`
const subContent = `${baseClass}__subcontent`
const subContentHeader = `${baseClass}__subContent-header`
const subContentDetails = `${baseClass}__subContent-details`
const helpIcons = `${baseClass}__help-icons`
const helpImages = `${baseClass}__help-images`
const helpImagesMobile = `${baseClass}__help-images-mobile`
const iconWrap = `${baseClass}__icon-wrap`
const iconWrapUndoRedo = `${baseClass}__icon-wrap-undoredo`
const iconInfo = `${baseClass}__icon-info`
const secondIcon = `${baseClass}__second-icon`
const SCROLL_SPEED = 500

const getDataElement = (data: string) => camelCase(data.split('.').pop())

const HelpInterior = () => {
  const { cvw = {}, featureExclusions = [] }: ConfigurationContextType = useContext(ConfigurationContext)
  const { help = {} } = cvw
  const contentWrapperRef = React.createRef()
  const [contentRefs, setContentRefs] = useState([])
  const [filteredHelpItems, setFilteredHelpItems] = useState([])
  const [activeTabIdentifier, setActiveTabIdentifier] = useState({
    index: 0,
    timestamp: 0 // this is necessary since "visual active" drives the appearance of the active tab
  })
  const [visualactiveTabIndex, setVisualactiveTabIndex] = useState(0)

  // scroll the help contents when setting an active tab
  useEffect(() => {
    if (contentRefs.length === 0) return

    const tgtOffset = contentRefs[activeTabIdentifier.index]?.current?.offsetTop

    if (contentWrapperRef.current && typeof tgtOffset !== 'undefined') {
      scroll.top(contentWrapperRef.current, tgtOffset, { duration: SCROLL_SPEED })
    }
  }, [activeTabIdentifier, contentRefs, contentWrapperRef.current])

  // update sidebar active state when content scrolls
  const contentWrapperScrollHandler = useCallback(debounce((e) => {
    if (!contentWrapperRef.current) return
    const tgt = contentRefs.reduce((accum, next, index) => {
      const scrollTrigger = {
        top: contentWrapperRef.current.scrollTop,
        bottom: contentWrapperRef.current.scrollTop + contentRefs[index - 1]?.current.scrollHeight - 70
      }
      if (scrollTrigger[help.scrollContentPosition ?? 'top'] >= next.current.offsetTop) {
        return index
      }
      return accum
    }, 0)
    setVisualactiveTabIndex(tgt)
  }, SCROLL_SPEED), [contentRefs, contentWrapperRef])

  // handle clicking on sidebar nav item
  const handleNavClick = (index) => (e) => {
    e.preventDefault()
    setActiveTabIdentifier({ index: index, timestamp: Date.now() })
    setVisualactiveTabIndex(index)
  }

  const handleNavKeyDown = (index) => (e) => {
    if (e.keyCode === KEY_CODES.KEY_CODE_ENTER || e.keyCode === KEY_CODES.KEY_CODE_SPACE) {
      e.preventDefault()
      setActiveTabIdentifier({ index: index, timestamp: Date.now() })
      setVisualactiveTabIndex(index)
    }
  }

  useEffect(() => {
    const { contents = [], contentsHiddenMobile = [] } = help
    const filtered = filterHelpItems(contents, contentsHiddenMobile, featureExclusions)
    setFilteredHelpItems(filtered)
    setContentRefs(filtered.map((item, index) => React.createRef()))
  }, [featureExclusions, help])

  return (
    <div className={`${wrapper}`}>
      <div className={`${tabsContainer}`}>
        <ul className={`${tabsContainer}__list`}>
          {filteredHelpItems.map((tab: Object, index: number) => <HelpItemHeader messageId={tab.header} key={index} isActive={index === visualactiveTabIndex} onClick={handleNavClick(index)} onKeyDown={handleNavKeyDown(index)} />)}
        </ul>
      </div>
      <div role='tab' tabIndex='0' ref={contentWrapperRef} className={contentWrapper} onScroll={contentWrapperScrollHandler}>
        {filteredHelpItems.map((tab: Object, index: number) => <HelpItemContent key={index} data={tab} ref={contentRefs[index]} />)}
      </div>
    </div>
  )
}

type HelpItemHeaderProps = {
  onClick: Function,
  onKeyDown: Function,
  isActive: boolean,
  messageId: string
}

const HelpItemHeader = ({ onClick, onKeyDown, isActive, messageId }: HelpItemHeaderProps) => {
  const { cvw = {} }: ConfigurationContextType = useContext(ConfigurationContext)

  return (
    <li
      className={`${tabsContainer}__list__item ${isActive ? `${tabsContainer}__list__item--active` : `${tabsContainer}__list__item--inactive`}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role='tab'
      tabIndex='0'
    >
      {cvw.help?.[getDataElement(messageId)]?.title ?? <FormattedMessage id={messageId} />}
    </li>
  )
}

type HelpItemContentProps = {
  data: Object
}

const HelpItemContent = forwardRef((props: HelpItemContentProps, ref) => {
  const { data } = props
  const { formatMessage } = useIntl()
  const { cvw = {} }: ConfigurationContextType = useContext(ConfigurationContext)
  const { help = {} } = cvw

  const tabContent = data.content
  const imageList = data.imageList
  const tabSubContent = data.subContent
  const imageListMobile = data.imageListMobile

  return <div ref={ref} className={`${helpContent} ${data.isHiddenMobile ? helpContentHide : ''}`}>
    <div className={`${contentHeader}`}>
      <h2>{help[getDataElement(data.header)]?.title ?? <FormattedMessage id={`${data.header}`} />}</h2>
      <span>{help[getDataElement(data.subHeader)]?.subtitle ?? <FormattedMessage id={`${data.subHeader}`} />}</span>
    </div>
    <div className={`${contentDetails}`}>
      {
        (tabContent) ? <ul className={`${helpIcons}`}>
          {
            tabContent && tabContent.map((tab: Object, index: number) => {
              const iconProps = {}
              if (!Array.isArray(tab.fontAwesomeIcon) && tab.fontAwesomeIcon.flip) {
                iconProps.flip = tab.fontAwesomeIcon.flip
              }
              if (!Array.isArray(tab.fontAwesomeIcon) && tab.fontAwesomeIcon.size) {
                iconProps.size = `${tab.fontAwesomeIcon.size}`
              }
              const sectionItem = help[getDataElement(data.header)]?.[getDataElement(tab.iconInfoName)]
              return (tab.iconInfoContent[0] || sectionItem) && (
                <li key={`li-${index}`}>
                  <div className={`${iconWrap} ${(tab.isUndoRedo) ? `${iconWrapUndoRedo}` : ``}`}>
                    {
                      (Array.isArray(tab.fontAwesomeIcon))
                        ? tab.fontAwesomeIcon.map((fontIcon, index) => {
                          if (fontIcon.flip) {
                            iconProps.flip = fontIcon.flip
                          }
                          if (fontIcon.size) {
                            iconProps.size = `${fontIcon.size}`
                          }
                          return sectionItem?.icon
                            ? <Iconography name={sectionItem?.icon} index={index} key={`icon-${index}`} />
                            : <FontAwesomeIcon key={`icon-${index}`} className={`${(index > 0 && !tab.isUndoRedo) ? secondIcon : ``}`} icon={[fontIcon.variant, fontIcon.icon]} size='lg' transform={fontIcon.rotate ? { rotate: fontIcon.rotate } : {}} {...iconProps} />
                        })
                        : sectionItem?.icon
                          ? <Iconography name={sectionItem?.icon} style={{ position: 'relative', float: 'left', backgroundColor: 'white' }} />
                          : <FontAwesomeIcon className={``} icon={[tab.fontAwesomeIcon.variant, tab.fontAwesomeIcon.icon]} size='lg' transform={tab.fontAwesomeIcon.rotate ? { rotate: tab.fontAwesomeIcon.rotate } : {}} {...iconProps} />
                    }
                  </div>
                  <div className={`${iconInfo}`}>
                    <h3>
                      {sectionItem?.title ?? <FormattedMessage id={`${tab.iconInfoName}`} />}
                    </h3>
                    <p>
                      {sectionItem?.content ?? <FormattedMessage id={`${tab.iconInfoContent[0]}`} />}
                    </p>
                  </div>
                </li>
              )
            })
          }
        </ul> : (imageList) ? <ul className={`${helpImages}`}>
          {
            imageList && imageList.map((item, index) => <li key={`li-${index}`} className={`${helpImages}__cell ${(index > 0) ? `${helpImages}__cell--overlay ${helpImages}__cell--${index}` : `${helpImages}__cell--base`}`}>
              {help ? <img className={`${helpImages}__i`} src={help[item.imagePathKey]} alt={item.alt ? formatMessage({ id: item.alt }) : ''} /> : null}
            </li>)
          }
        </ul> : ''
      }
      {
        imageListMobile && <ul className={`${helpImagesMobile}`}>
          {
            imageListMobile.map((item, index) => <li key={`li-mobile-image-${index}`} className={`${helpImages}__cell ${(index > 0) ? `${helpImages}__cell--overlay ${helpImages}__cell--${index}` : `${helpImages}__cell--base`}`}>
              {help ? <img className={`${helpImages}__i`} src={help[item.imagePathKey]} alt={item.alt ? formatMessage({ id: item.alt }) : ''} /> : null}
            </li>)
          }
        </ul>
      }
    </div>
    {tabSubContent && tabSubContent.map((content, index) => {
      return (
        <div key={`tabSubContent-${index}`} className={`${subContent}`}>
          <div className={`${subContentHeader}`}>
            <FormattedMessage id={`${content.header}`} />
          </div>
          <p className={`${subContentDetails}`}>
            <FormattedMessage id={`${content.content}`} />
          </p>
        </div>
      )
    })}
  </div>
})

const Help = () => {
  const { formatMessage } = useIntl()
  return (
    <CardMenu menuTitle={formatMessage({ id: helpHeader })}>
      {() => <HelpInterior />}
    </CardMenu>
  )
}

export default Help

// @flow
import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Switch, Route, useHistory, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FormattedMessage, useIntl } from 'react-intl'
import { isMobileOnly, isTablet, isIOS } from 'react-device-detect'
import ImageRotateContainer from '../../MatchPhoto/ImageRotateContainer'
import { showWarningModal, unsetActiveScenePolluted } from 'src/store/actions/scenes'
import { queueImageUpload } from 'src/store/actions/user-uploads'
import './ColorVisualizerNav.scss'
import { FEATURE_EXCLUSIONS } from '../../../constants/configurations'
import { shouldAllowFeature } from '../../../shared/utils/featureSwitch.util'
import WithConfigurationContext from '../../../contexts/ConfigurationContext/WithConfigurationContext'

type DropDownMenuProps = {
  title: string,
  items: {
    img: string,
    imgiPhone?: string,
    imgiPad?: string,
    imgAndroid?: string,
    title: string,
    titleMobile?: string,
    content: string,
    contentAndroid?: string,
    contentiPhone?: string,
    description?: string,
    onClick: () => void
  }[]
}

type ColorVisualizerNavProps = {
  config: any,
  setPaintScene: Function,
  setMatchPhotoScene: Function
}

const isSupportedImageFormat = (file: Object, exts: string[] = ['jpeg', 'jpg', 'png']) => {
  if (file && file.name) {
    const fileName = file.name.toLowerCase().split('.')
    if (fileName.length > 1) {
      return exts.indexOf(fileName[fileName.length - 1]) > -1
    }
  }

  return false
}

export const DropDownMenu = ({ title, items }: DropDownMenuProps) => {
  const history = useHistory()
  const selectDevice = (web, iPhone = web, android = web, iPad = web) => (isMobileOnly ? (isIOS ? iPhone : android) : (isTablet ? iPad : web)) || web
  return (
    <>
      <button className='overlay' onClick={() => history.push('/active')} />
      <div className='dashboard-submenu'>
        <button className='dashboard-submenu__close' onClick={() => history.push('/active')}>
          <FormattedMessage id='CLOSE' />
          <FontAwesomeIcon icon={['fa', 'chevron-up']} />
        </button>
        <h1 className='dashboard-submenu__header'>{title}</h1>
        <ul className='dashboard-submenu__content'>
          {items.map(({ img, imgiPhone, imgiPad, imgAndroid, title, titleMobile, content, contentAndroid, contentiPhone, description, onClick }, i) => {
            return (
              <li key={i}>
                <button onClick={onClick}>
                  <img className='dashboard-submenu-image' src={selectDevice(img, imgiPhone, imgAndroid, imgiPad)} alt='' />
                  <h3 className='dashboard-submenu__content__title'>{selectDevice(title, titleMobile)}</h3>
                  <p className='dashboard-submenu__content__content'>{selectDevice(content, contentiPhone, contentAndroid)}</p>
                  {description && <p className='dashboard-submenu__content__tip'>{description}</p>}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

const ColorVisualizerNav = (props: ColorVisualizerNavProps) => {
  const { config: { featureExclusions }, setMatchPhotoScene, setPaintScene } = props
  console.log('CONFIG::', props.config)
  const { messages } = useIntl()
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const isActiveScenePolluted: boolean = useSelector(store => store.scenes.isActiveScenePolluted)
  const useSmartMask = useSelector(state => state.useSmartMask)

  const hiddenImageUploadInput: { current: ?HTMLElement } = useRef()
  const [imgUrl: string, setImgUrl: (string) => void] = useState()

  useEffect(() => {
    if (imgUrl) {
      location.pathname === '/active/match-photo'
        ? setMatchPhotoScene(<ImageRotateContainer key={imgUrl + 'mp'} showPaintScene isFromMyIdeas={false} isPaintScene={false} imgUrl={imgUrl} />)
        : setPaintScene(<ImageRotateContainer key={imgUrl} showPaintScene isFromMyIdeas={false} isPaintScene imgUrl={imgUrl} />)
    }
  }, [imgUrl])

  const getDropDownItemsForGetInspired = () => {
    const items = [
      {
        img: require('src/images/color-visualizer-wrapper/inspiration-submenu__thumbnail--painted-scenes.png'),
        title: messages['NAV_LINKS.PAINTED_PHOTOS'],
        content: messages['NAV_DROPDOWN_LINK_SUB_CONTENT.PAINTED_PHOTOS'],
        onClick: () => history.push('/active/use-our-image')
      },
      {
        img: require('src/images/color-visualizer-wrapper/inspiration-submenu__thumbnail--expert-color-picks.png'),
        title: messages['NAV_LINKS.EXPERT_COLOR_PICKS'],
        content: messages['NAV_DROPDOWN_LINK_SUB_CONTENT.EXPERT_COLOR_PICKS'],
        onClick: () => history.push('/active/expert-colors')
      },
      {
        img: require('src/images/color-visualizer-wrapper/inspiration-submenu__thumbnail--sample-photos.png'),
        title: messages['NAV_LINKS.INSPIRATIONAL_PHOTOS'],
        content: messages['NAV_DROPDOWN_LINK_SUB_CONTENT.INSPIRATIONAL_PHOTOS'],
        onClick: () => history.push('/active/color-from-image')
      }
    ]

    return items.filter((item) => {
      if (item.title === messages['NAV_LINKS.INSPIRATIONAL_PHOTOS']) {
        return shouldAllowFeature(featureExclusions, FEATURE_EXCLUSIONS.inspirationalPhotos)
      }

      if (item.title === messages['NAV_LINKS.EXPERT_COLOR_PICKS']) {
        return shouldAllowFeature(featureExclusions, FEATURE_EXCLUSIONS.experColorPicks)
      }

      if (item.title === messages['NAV_LINKS.PAINTED_PHOTOS']) {
        return shouldAllowFeature(featureExclusions, FEATURE_EXCLUSIONS.paintedPhotos)
      }

      return true
    })
  }

  const getDropDownItemsForPaintAPhoto = () => {
    const items = [
      {
        img: require('src/images/color-visualizer-wrapper/scene-submenu__thumbnail--sample-scenes.png'),
        title: messages['NAV_LINKS.USE_OUR_PHOTOS'],
        content: messages['NAV_DROPDOWN_LINK_SUB_CONTENT.USE_OUR_PHOTOS'],
        onClick: () => history.push('/active/paint-photo')
      },
      {
        img: require('src/images/color-visualizer-wrapper/scene-submenu__thumbnail--my-photos.png'),
        imgiPhone: require('src/images/color-visualizer-wrapper/scene-submenu__thumbnail--iphone.png'),
        imgiPad: require('src/images/color-visualizer-wrapper/scene-submenu__thumbnail--ipad.png'),
        imgAndroid: require('src/images/color-visualizer-wrapper/scene-submenu__thumbnail--android.png'),
        title: messages['NAV_LINKS.UPLOAD_YOUR_PHOTO'],
        titleMobile: messages['NAV_LINKS.GET_THE_APP'],
        content: messages['NAV_DROPDOWN_LINK_SUB_CONTENT.UPLOAD_YOUR_PHOTO'],
        contentAndroid: messages['NAV_DROPDOWN_LINK_SUB_CONTENT.UPLOAD_YOUR_PHOTO_ANDROID'],
        contentiPad: messages['NAV_DROPDOWN_LINK_SUB_CONTENT.UPLOAD_YOUR_PHOTO_IPAD'],
        contentiPhone: messages['NAV_DROPDOWN_LINK_SUB_CONTENT.UPLOAD_YOUR_PHOTO_IPHONE'],
        description: messages['NAV_DROPDOWN_LINK_TIP_DESCRIPTION.UPLOAD_YOUR_PHOTO'],
        onClick: () => {
          const activate = () => {
            dispatch(unsetActiveScenePolluted())
            const selectDevice = (web, iPhone = web, android = web, iPad = web) => (isMobileOnly ? (isIOS ? iPhone : android) : (isTablet ? iPad : web)) || web
            history.push(selectDevice(
              '/active/paint-scene',
              'https://play.google.com/store/apps/details?id=com.colorsnap',
              'https://itunes.apple.com/us/app/colorsnap-visualizer-iphone/id316256242?mt=8',
              'https://itunes.apple.com/us/app/colorsnap-studio/id555300600?mt=8'
            ))

            if (hiddenImageUploadInput.current) {
              hiddenImageUploadInput.current.value = ''
              hiddenImageUploadInput.current.click() // uploads image
            }
          }

          isActiveScenePolluted ? dispatch(showWarningModal(activate)) : activate()
        }
      }
    ]

    return items.filter((item) => {
      if (item.title === messages['NAV_LINKS.USE_OUR_PHOTOS']) {
        return shouldAllowFeature(featureExclusions, FEATURE_EXCLUSIONS.useOurPhotos)
      }

      if (item.title === messages['NAV_LINKS.UPLOAD_YOUR_PHOTO']) {
        return shouldAllowFeature(featureExclusions, FEATURE_EXCLUSIONS.uploadYourPhoto)
      }

      return true
    })
  }

  const getDropDownItemsForExploreColors = () => {
    const items = [
      {
        img: require('src/images/color-visualizer-wrapper/color-submenu__thumbnail--explore-color.png'),
        title: messages['NAV_LINKS.DIGITAL_COLOR_WALL'],
        content: messages['NAV_DROPDOWN_LINK_SUB_CONTENT.DIGITAL_COLOR_WALL'],
        onClick: () => history.push('/active/color-wall/section/sherwin-williams-colors')
      },
      {
        img: require('src/images/color-visualizer-wrapper/color-submenu__thumbnail--color-collections.png'),
        title: messages['NAV_LINKS.COLOR_COLLECTIONS'],
        content: messages['NAV_DROPDOWN_LINK_SUB_CONTENT.COLOR_COLLECTIONS'],
        onClick: () => history.push('/active/color-collections')
      },
      {
        img: require('src/images/color-visualizer-wrapper/color-submenu__thumbnail--match-photo.png'),
        title: messages['NAV_LINKS.MATCH_A_PHOTO'],
        content: messages['NAV_DROPDOWN_LINK_SUB_CONTENT.MATCH_A_PHOTO'],
        onClick: () => {
          const activate = () => {
            dispatch(unsetActiveScenePolluted())
            history.push('/active/match-photo')
            if (hiddenImageUploadInput.current) {
              hiddenImageUploadInput.current.value = ''
              hiddenImageUploadInput.current.click()
            }
          }

          isActiveScenePolluted ? dispatch(showWarningModal(activate)) : activate()
        }
      }
    ]

    return items.filter((item) => {
      if (item.title === messages['NAV_LINKS.DIGITAL_COLOR_WALL']) {
        return shouldAllowFeature(featureExclusions, FEATURE_EXCLUSIONS.colorWall)
      }

      if (item.title === messages['NAV_LINKS.COLOR_COLLECTIONS']) {
        return shouldAllowFeature(featureExclusions, FEATURE_EXCLUSIONS.colorCollections)
      }

      if (item.title === messages['NAV_LINKS.MATCH_A_PHOTO']) {
        return shouldAllowFeature(featureExclusions, FEATURE_EXCLUSIONS.matchAPhoto)
      }

      return true
    })
  }

  return (
    <nav className='cvw-navigation-wrapper'>
      <input ref={hiddenImageUploadInput} style={{ display: 'none' }} type='file' onChange={e => {
        if (!isMobileOnly && !isTablet) {
          const userImg = e.target.files && e.target.files.length ? e.target.files[0] : null

          if (userImg && isSupportedImageFormat(userImg)) {
            if (useSmartMask) {
              dispatch(queueImageUpload(userImg))
            }
            const imageUrl = URL.createObjectURL(userImg)
            // @todo In the old code base this action aroused suspicious of race conditions edge cases... this needs to be revisited -RS
            setImgUrl(imageUrl)
          } else {
            // @todo implement notification of failed format. -RS
          }
        }
      }} />
      <ul className='cvw-navigation-wrapper__center' role='presentation'>
        { shouldAllowFeature(featureExclusions, FEATURE_EXCLUSIONS.exploreColors)
          ? <li>
            <button className={`cvw-nav-btn ${location.pathname === '/active/colors' ? 'cvw-nav-btn--active' : ''}`} onClick={() => history.push('/active/colors')}>
              <span className='fa-layers fa-fw cvw-nav-btn-icon'>
                <FontAwesomeIcon icon={['fal', 'square-full']} size='xs' transform={{ rotate: 10 }} />
                <FontAwesomeIcon icon={['fal', 'square-full']} size='sm' transform={{ rotate: 0 }} />
                <FontAwesomeIcon icon={['fal', 'square-full']} size='1x' transform={{ rotate: 350 }} />
                <FontAwesomeIcon icon={['fal', 'plus-circle']} size='xs' />
              </span>
              <FormattedMessage id='NAV_LINKS.EXPLORE_COLORS' />
            </button>
          </li> : null }
        { shouldAllowFeature(featureExclusions, FEATURE_EXCLUSIONS.getInspired)
          ? <li>
            <button className={`cvw-nav-btn ${location.pathname === '/active/inspiration' ? 'cvw-nav-btn--active' : ''}`} onClick={() => history.push('/active/inspiration')}>
              <FontAwesomeIcon className='cvw-nav-btn-icon' icon={['fal', 'lightbulb']} size='1x' />
              <FormattedMessage id='NAV_LINKS.GET_INSPIRED' />
            </button>
          </li> : null }
        { shouldAllowFeature(featureExclusions, FEATURE_EXCLUSIONS.paintAPhoto)
          ? <li>
            <button className={`cvw-nav-btn ${location.pathname === '/active/scenes' ? 'cvw-nav-btn--active' : ''}`} onClick={() => history.push('/active/scenes')}>
              <span className='fa-layers fa-fw cvw-nav-btn-icon'>
                <FontAwesomeIcon icon={['fal', 'square-full']} />
                <FontAwesomeIcon icon={['fa', 'brush']} size='sm' transform={{ rotate: 320 }} />
              </span>
              <FormattedMessage id='NAV_LINKS.PAINT_A_PHOTO' />
            </button>
          </li> : null }
      </ul>
      <ul className='cvw-navigation-wrapper__right' role='presentation'>
        {
          shouldAllowFeature(featureExclusions, FEATURE_EXCLUSIONS.documentSaving)
            ? <li>
              <button className={`cvw-nav-btn ${location.pathname === '/active/my-ideas' ? 'cvw-nav-btn--active' : ''}`} onClick={() => history.push('/active/my-ideas')}>
                <FormattedMessage id='NAV_LINKS.MY_IDEAS' />
              </button>
            </li> : null
        }
        <li>
          <button className={`cvw-nav-btn ${location.pathname === '/active/help' ? 'cvw-nav-btn--active' : ''}`} onClick={() => history.push('/active/help')}>
            <FormattedMessage id='NAV_LINKS.HELP' />
          </button>
        </li>
      </ul>
      <Switch>
        <Route path='/active/colors'>
          <DropDownMenu
            title={messages['NAV_DROPDOWN_TITLE.EXPLORE_COLORS']}
            items={getDropDownItemsForExploreColors()}
          />
        </Route>
        <Route path='/active/inspiration'>
          <DropDownMenu
            title={messages['NAV_DROPDOWN_TITLE.GET_INSPIRED']}
            items={getDropDownItemsForGetInspired()}
          />
        </Route>
        <Route path='/active/scenes'>
          <DropDownMenu
            title={messages['NAV_DROPDOWN_TITLE.PAINT_A_PHOTO']}
            items={getDropDownItemsForPaintAPhoto()}
          />
        </Route>
      </Switch>
    </nav>
  )
}

export default WithConfigurationContext(ColorVisualizerNav)

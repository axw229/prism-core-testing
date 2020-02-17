// @flow
import React, { useState, type ComponentType, useEffect } from 'react'
import './CollectionsHeaderWrapper.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'src/providers/fontawesome/fontawesome'
import { Link } from 'react-router-dom'
import { RouteConsumer } from '../../contexts/RouteContext/RouteContext'
import { FormattedMessage } from 'react-intl'
const baseClass = 'collections-header'
const wrapper = `${baseClass}__wrapper`
const wrapperHeader = `${baseClass}__header`
export const heading = `${baseClass}__heading`
const button = `${baseClass}__button`
export const buttonLeft = `${baseClass}__button--left`
const buttonLeftText = `${baseClass}__button-left-text`
export const buttonRight = `${baseClass}__button--right`
const buttonClose = `${baseClass}__close`
const buttonCancel = `${baseClass}__cancel`
const wrapperContent = `${baseClass}__content`

export default (WrappedComponent: ComponentType<any>) => (props: any) => {
  const [showBack, setShowBack] = useState(false)
  const [header, setHeader] = useState('')
  const backButtonRef = React.useRef()

  useEffect(() => {
    if (backButtonRef.current) {
      backButtonRef.current.focus()
    }
  }, [showBack])

  return (<div className={`${wrapper}`}>
    <div className={`${wrapperHeader}`}>
      <div className={`${heading}`}>{header}</div>
      {showBack && <button ref={backButtonRef} className={`${button} ${buttonLeft}`} onClick={() => setShowBack(false)} onMouseDown={(e) => e.preventDefault()}>
        <div>
          <FontAwesomeIcon className={``} icon={['fa', 'angle-left']} />
          &nbsp;<span className={`${buttonLeftText}`}><FormattedMessage id='BACK' /></span>
        </div>
      </button>}
      <RouteConsumer>
        {(context) => (
          <Link tabIndex='-1' to={`/active`}>
            <button className={`${button} ${buttonRight}`} onClick={() => { context && context.navigate(true, true) }}>
              <div className={`${buttonClose}`}>
                <span><FormattedMessage id='CLOSE' /></span>&nbsp;<FontAwesomeIcon className={``} icon={['fa', 'chevron-up']} />
              </div>
              <div className={`${buttonCancel}`}>
                <FontAwesomeIcon className={``} icon={['fa', 'times']} />
              </div>
            </button>
          </Link>)
        }
      </RouteConsumer>
    </div>
    <div className={`${wrapperContent}`}>
      <WrappedComponent
        {...props}
        showBack={() => setShowBack(true)}
        isShowBack={showBack}
        setHeader={setHeader}
      />
    </div>
  </div>)
}

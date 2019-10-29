// @flow
import '@babel/polyfill'
import '@formatjs/intl-relativetimeformat/polyfill'
import '@formatjs/intl-relativetimeformat/dist/locale-data/en'
import '@formatjs/intl-relativetimeformat/dist/locale-data/fr'
import '@formatjs/intl-pluralrules/polyfill'
import '@formatjs/intl-pluralrules/dist/locale-data/en'
import '@formatjs/intl-pluralrules/dist/locale-data/fr'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { BrowserRouter, HashRouter, MemoryRouter } from 'react-router-dom'
import ReactGA from 'react-ga'
import toArray from 'lodash/toArray'
import mapValues from 'lodash/mapValues'
import { LiveAnnouncer } from 'react-aria-live'

import { GOOGLE_ANALYTICS_UID } from './constants/globals'

import ConfigurationContextProvider from './contexts/ConfigurationContext/ConfigurationContextProvider'
import { flattenNestedObject } from './shared/helpers/DataUtils'

// global sass import -- keep this BEFORE the APPS import to maintain compiled CSS order
import './scss/main.scss'

// all supported languages
import languages from './translations/translations'

// import the redux store
import store from './store/store'

// import all mountable components
import APPS from './config/components'

// load all fontawesome fonts we are using
import './config/fontawesome'

// publically exposed variables for validations
window.PRISM = {
  version: APP_VERSION // eslint-disable-line no-undef
}

// initialize Google Analytics
ReactGA.initialize([{
  trackingId: GOOGLE_ANALYTICS_UID,
  gaOptions: {
    name: 'GAtrackerPRISM'
  }
}], { alwaysSendToDefaultTracker: false })

const renderAppInElement = (el) => {
  if (el.className.indexOf('__react-bound') > -1) {
    return
  }

  // get props from elements data attribute, like the post_id
  const allProps = mapValues(Object.assign({}, el.dataset), v => v === '' ? true : v)
  const { reactComponent, ...other } = allProps
  const props: EmbeddedConfiguration = other // just doing this for the typing

  // if no data attribute specifying the react component exists, let's get out.
  // although if it doesn't have this data attribute, it shouldn't have a __react-root class...
  if (!reactComponent) {
    console.warn(el, ' does not have a data-react-component specified.')
    return
  }

  const App = APPS[reactComponent]

  // if the component doesn't exist, let's get out too
  if (!App) {
    console.warn(`${reactComponent} does is not included. Please import this component into index.jsx.`)
    return
  }

  // set the language
  const language = props.language || navigator.language || 'en-US'

  // set the page root if it exists
  const pageRoot = props.pageRoot || '/'

  // checks if a default routing type is set, if not we'll use hash routing
  const routeType = props.routeType || 'hash'

  const BrowserRouterRender = (
    <BrowserRouter basename={pageRoot}>
      <App {...props} />
    </BrowserRouter>
  )
  const HashRouterRender = (
    <HashRouter>
      <App {...props} />
    </HashRouter>
  )
  const MemoryRouterRender = (
    <MemoryRouter>
      <App {...props} />
    </MemoryRouter>
  )
  const RouterRender = (route => {
    switch (route) {
      case 'browser':
        return BrowserRouterRender
      case 'hash':
        return HashRouterRender
      case 'memory':
      default:
        return MemoryRouterRender
    }
  })(routeType)

  const flatLanguages = flattenNestedObject(languages[language])

  render(
    <IntlProvider locale={language} messages={flatLanguages} textComponent={React.Fragment}>
      <Provider store={store}>
        <ConfigurationContextProvider {...props}>
          <LiveAnnouncer>
            { RouterRender }
          </LiveAnnouncer>
        </ConfigurationContextProvider>
      </Provider>
    </IntlProvider>, el)

  el.classList.add('__react-bound')
}

const bindReactToDOM = () => {
  toArray(document.querySelectorAll('.__react-root')).forEach(renderAppInElement)
}

bindReactToDOM()

export default bindReactToDOM

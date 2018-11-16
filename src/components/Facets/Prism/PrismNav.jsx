/* eslint-disable */
import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'

import './PrismNav.scss'

class PrismNav extends PureComponent {
  constructor (props) {
    super(props)
  }

  isScene (pathname) {
    return /^\/active\/?$/.test(pathname)
  }

  isColorWall (pathname) {
    return /^\/active\/color-wall/.test(pathname)
  }

  isSearch (pathname) {
    return /^\/search\/?$/.test(pathname)
  }

  render () {
    const { history, location: { pathname }, match } = this.props

    return (
      <React.Fragment>
        <button onClick={() => {this.props.history.push('/active')}} className={`prism-nav-btn ${this.isScene(pathname) ? 'prism-nav-btn--active' : ''}`}>Scenes</button>
        <button onClick={() => {this.props.history.push('/active/color-wall')}} className={`prism-nav-btn ${this.isColorWall(pathname) ? 'prism-nav-btn--active' : ''}`}>Color Wall</button>
        <button onClick={() => {this.props.history.push('/search')}} className={`prism-nav-btn ${this.isSearch(pathname) ? 'prism-nav-btn--active' : ''}`}>Search</button>
      </React.Fragment>
    )
  }
}

export default withRouter(PrismNav)
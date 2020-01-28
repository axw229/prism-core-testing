// @flow
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import HeroLoaderExpanded from '../../Loaders/HeroLoader/HeroLoaderExpanded'
import ConfigurationContext from '../../../contexts/ConfigurationContext/ConfigurationContext'
import { loadColors } from '../../../store/actions/loadColors'
import kebabCase from 'lodash/kebabCase'

type Props = {
  children: React.Node,
  redirect?: boolean
}

export default ({ children, redirect = true }: Props) => {
  const { brandId } = React.useContext(ConfigurationContext)
  const { section, status: { loading } } = useSelector(state => state.colors)
  const dispatch = useDispatch()
  const { locale } = useIntl()

  React.useEffect(() => { dispatch(loadColors(brandId, { language: locale })) }, [])
  return (loading
    ? <HeroLoaderExpanded />
    : <Switch>
      <Route path='/active/color-wall/section/:section/family/:family/color/:colorId/:colorName/search/'>{children}</Route>
      <Route path='/active/color-wall/section/:section/family/:family/color/:colorId/:colorName'>{children}</Route>
      <Route path='/active/color-wall/section/:section/family/:family/search/'>{children}</Route>
      <Route path='/active/color-wall/section/:section/family/:family'>{children}</Route>
      <Route path='/active/color-wall/section/:section/family'>{children}</Route>
      <Route path='/active/color-wall/section/:section/color/:colorId/:colorName/family/'>{children}</Route>
      <Route path='/active/color-wall/section/:section/color/:colorId/:colorName/search/'>{children}</Route>
      <Route path='/active/color-wall/section/:section/color/:colorId/:colorName'>{children}</Route>
      <Route path='/active/color-wall/section/:section/search/'>{children}</Route>
      <Route path='/active/color-wall/section/:section'>{children}</Route>
      {redirect ? <Redirect to={`/active/color-wall/section/${kebabCase(section)}`} /> : null}
    </Switch>
  )
}

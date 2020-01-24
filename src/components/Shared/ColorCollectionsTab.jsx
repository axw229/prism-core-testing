// @flow
//
import React, { useState, useEffect } from 'react'
import type { ColorCollectionsTabs } from '../../shared/types/Colors'

type Props = {
  collectionTabs: ColorCollectionsTabs,
  showTab: Function,
  tabIdShow: string
}

const KEY_CODE_ENTER = 13
const KEY_CODE_SPACE = 32

const baseClass = 'color-collections'
const tabListSelect = `${baseClass}__tab-list-select`
const tabListHeading = `${baseClass}__tab-list-heading`
const tabListDropdownMobile = `${baseClass}__tab-list-dropdown-mobile`
const tabList = `${baseClass}__tab-list`
const tabListActive = `${baseClass}__tab-list--active`
const tabListInactive = `${baseClass}__tab-list--inactive`
const tabListItem = `${baseClass}__tab-list-item`
const tabListItemActive = `${baseClass}__tab-list-item--active`

function ColorCollectionsTab (props: Props) {
  const { collectionTabs, showTab, tabIdShow } = props
  const [tabListMobileShow, showTabListMobile] = useState(false)
  const tabFind = collectionTabs.find(tab => tab.id === tabIdShow)
  const tabActive = (tabFind) ? tabFind.tabName : undefined
  const tabShowName = (tabActive !== undefined) ? tabActive : 'Choose collection'

  const tabRefs = collectionTabs.reduce((acc, value) => {
    acc[value.id] = React.createRef()
    return acc
  }, {})

  useEffect(() => {
    if (tabRefs[tabIdShow] && tabRefs[tabIdShow].current) {
      tabRefs[tabIdShow].current.focus()
    }
  }, [tabIdShow])

  return (
    <div className={`${tabListSelect}`}>
      <span className={`${tabListHeading}`}>Choose a Collection</span>

      <span
        className={`${tabListDropdownMobile}`}
        tabIndex='0'
        role='button'
        onKeyDown={(e) => (e.keyCode === KEY_CODE_ENTER || e.keyCode === KEY_CODE_SPACE) && showTabListMobile(!tabListMobileShow)}
        onClick={() => showTabListMobile(!tabListMobileShow)}>{tabShowName}
      </span>

      <ul
        role='tablist'
        className={`${tabList} ${(tabListMobileShow)
          ? `${tabListActive}`
          : `${tabListInactive}`}`}
      >
        {
          collectionTabs.map((tab, id) => {
            return (
              <li
                onBlur={() => tabRefs[tab.id].current.blur()}
                ref={tabRefs[tab.id]}
                data-testid={`${tab.id}`}
                tabIndex='0'
                role='tab'
                key={tab.id}
                aria-selected={(tab.id === tabIdShow)}
                onKeyDown={(e) => {
                  if (e.keyCode === KEY_CODE_ENTER || e.keyCode === KEY_CODE_SPACE) {
                    if (tab.id !== tabIdShow) {
                      showTab(tab.id, true)
                    }
                    showTabListMobile(!tabListMobileShow)
                  }
                }}
                className={`${tabListItem} ${(tab.id === tabIdShow) ? `${tabListItemActive}` : ''}`}
                onClick={() => tab.id !== tabIdShow && showTab(tab.id, true)}
              >
                {tab.tabName}
              </li>
            )
          })}
      </ul>
    </div>
  )
}

export {
  tabListSelect,
  tabListHeading,
  tabListDropdownMobile,
  tabList,
  tabListActive,
  tabListInactive,
  tabListItem,
  tabListItemActive
}
export default ColorCollectionsTab

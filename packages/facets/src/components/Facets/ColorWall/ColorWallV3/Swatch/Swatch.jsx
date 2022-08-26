// @flow
import React, { useContext } from 'react'
import { ColorSwatch } from '@prism/toolkit'
import ColorSwatchContent from 'src/components/ColorSwatchContent/ColorSwatchContent'
import ConfigurationContext, {
  type ConfigurationContextType
} from 'src/contexts/ConfigurationContext/ConfigurationContext'
import { cleanColorNameForURL, fullColorName, generateColorDetailsPageUrl } from 'src/shared/helpers/ColorUtils'
import * as GA from 'src/analytics/GoogleAnalytics'
import { GA_TRACKER_NAME_BRAND, HASH_CATEGORIES } from 'src/constants/globals'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import at from 'lodash/at'
import ColorWallContext from '../../ColorWallContext'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { emitColor } from '../../../../../store/actions/loadColors'
import { add } from '../../../../../store/actions/live-palette'
import startCase from 'lodash/startCase'
import InfoButton from '../../../../InfoButton/InfoButton'
import { Link } from 'react-router-dom'
import './Swatch.scss'
import 'src/components/ColorSwatchContent/ColorSwatchContent.scss'
import type { ColorWallContextProps } from '../../ColorWallContext'

const swatchClass = 'cwv3__swatch'

type SwatchProps = {
  active: boolean,
  activeFocus: boolean,
  color: Color,
  data: {
    children: any,
    titles: any,
    props: any,
    childProps: any
  },
  enabled: boolean,
  id: string,
  message?: string,
  onRefSwatch: any,
  perimeterLevel: number,
  onClick: any,
  style: any
}

type SwatchContentProps = {
  color: any,
  style?: {},
  isOnlyUsedforSearch?: boolean,
  message?: string,
  enabled?: boolean
}

// TODO:
// isOnlyUsedforSearch should be refactored when swatch contents are merged together
export const SwatchContent = ({
  color,
  style,
  message,
  isOnlyUsedforSearch = false,
  enabled = true
}: SwatchContentProps) => {
  const dispatch = useDispatch()
  const { messages = {} } = useIntl()

  const {
    addButtonText,
    displayAddButton,
    displayInfoButton,
    displayDetailsLink,
    colorDetailPageRoot
  }: ColorWallContextProps = useContext(ColorWallContext)
  const { brandId, brandKeyNumberSeparator, swatchShouldEmit }: ConfigurationContextType =
    useContext(ConfigurationContext)

  const colorIsInLivePalette: boolean = useSelector((store) =>
    store.lp.colors.some(({ colorNumber }) => colorNumber === color.colorNumber)
  )
  const title = (addButtonText || at(messages, 'ADD_TO_PALETTE')[0] || '').replace(
    '{name}',
    fullColorName(color.brandKey, color.colorNumber, color.name, brandKeyNumberSeparator)
  )

  return (
    <div className={!isOnlyUsedforSearch ? 'swatch-content-size' : null}>
      <div className='swatch-content__btns'>
        <div className='swatch-content__button-group swatch-content__button-group--xs' style={style}>
          {enabled &&
            displayAddButton &&
            (colorIsInLivePalette ? (
              <FontAwesomeIcon className='check-icon' icon={['fa', 'check-circle']} size='2x' />
            ) : (
              <button
                title={title}
                onClick={() => {
                  dispatch(swatchShouldEmit ? emitColor(color) : add(color))
                  GA.event(
                    {
                      category: startCase(
                        window.location.hash.split('/').filter((hash) => HASH_CATEGORIES.indexOf(hash) >= 0)
                      ),
                      action: 'Color Swatch Add',
                      label: fullColorName(color.brandKey, color.colorNumber, color.name, brandKeyNumberSeparator)
                    },
                    GA_TRACKER_NAME_BRAND[brandId]
                  )
                }}
              >
                <FontAwesomeIcon className='add-icon' icon={['fal', 'plus-circle']} size='2x' />
                {addButtonText && <span className='OmniButton__content'>{title}</span>}
              </button>
            ))}
          {enabled && displayInfoButton && <InfoButton color={color} />}
          {enabled &&
            displayDetailsLink &&
            (colorDetailPageRoot ? (
              <a
                href={`${colorDetailPageRoot}/${color.brandKey}${color.colorNumber}-${cleanColorNameForURL(
                  color.name
                )}`}
                title={(at(messages, 'VIEW_DETAILS_FOR')[0] || '').replace(
                  '{name}',
                  fullColorName(color.brandKey, color.colorNumber, color.name, brandKeyNumberSeparator)
                )}
                className='OmniButton color-swatch__content__cta color-swatch__content__cta--l'
              >
                {at(messages, 'VIEW_DETAILS')[0]}
              </a>
            ) : (
              <Link
                to={generateColorDetailsPageUrl(color)}
                title={(at(messages, 'VIEW_DETAILS_FOR')[0] || '').replace('{name}', fullColorName(color))}
                className='OmniButton color-swatch__content__cta color-swatch__content__cta--l'
              >
                {at(messages, 'VIEW_DETAILS')[0]}
              </Link>
            ))}
        </div>
      </div>
      <div className='swatch-content__label swatch-content__number-name'>
        <p className='swatch-content__label--number'>{`${color.brandKey} ${color.colorNumber}`}</p>
        <p className='swatch-content__label--name'>{color.name}</p>
      </div>
      {message ? <div className={'color-swatch__content-message'}>{message}</div> : null}
    </div>
  )
}

export function Swatch({
  color,
  style,
  id,
  onRefSwatch,
  active,
  activeFocus,
  perimeterLevel,
  onClick,
  enabled = true,
  message
}: SwatchProps) {
  const {
    brandId,
    brandKeyNumberSeparator,
    colorWall: { colorSwatch = {} }
  }: ConfigurationContextType = useContext(ConfigurationContext)

  const { houseShaped = false } = colorSwatch
  return (
    <ColorSwatch
      active={active}
      activeFocus={activeFocus}
      aria-label={fullColorName(color.brandKey, color.colorNumber, color.name, brandKeyNumberSeparator)}
      color={color}
      flagged={!enabled}
      className={`${swatchClass}${
        active ? ` ${swatchClass}--active${houseShaped ? ` ${swatchClass}--house-shaped` : ''}` : ''
      }${perimeterLevel > 0 ? ` ${swatchClass}--perimeter ${swatchClass}--perimeter--${perimeterLevel}` : ''}`}
      id={id}
      onClick={() => {
        onClick()
        GA.event(
          {
            category: 'Color Wall',
            action: 'Color Swatch Click',
            label: fullColorName(color.brandKey, color.colorNumber, color.name, brandKeyNumberSeparator)
          },
          GA_TRACKER_NAME_BRAND[brandId]
        )
      }}
      ref={onRefSwatch}
      renderer={() =>
        houseShaped ? (
          <ColorSwatchContent
            className='swatch-content--house-shaped'
            color={color}
            enabled={enabled}
            message={message}
          />
        ) : (
          <SwatchContent color={color} enabled={enabled} message={message} />
        )
      }
      style={style}
    />
  )
}

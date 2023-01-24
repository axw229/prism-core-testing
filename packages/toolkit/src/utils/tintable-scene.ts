import kebabCase from 'lodash/kebabCase'
import uniqueId from 'lodash/uniqueId'
import { Color, MiniColor } from '../types'

export const getFilterId = (sceneId: string, surfaceId: string | number, suffix?: string): string => {
  return kebabCase(`scene${sceneId}_surface${surfaceId}_tinter-filter${suffix ? `_${suffix}` : ''}`)
}

export const getMaskId = (sceneId: string, surfaceId: string | number, suffix?: string): string => {
  return kebabCase(`scene${sceneId}_surface${surfaceId}_object-mask${suffix ? `_${suffix}` : ''}`)
}

export const ERROR_NOT_STRING = 'Input must be a string'

export function getBeforeHash(input: string): string {
  if (typeof input !== 'string') throw new TypeError(ERROR_NOT_STRING)

  if (input.includes('#')) {
    return input.split('#')[0]
  }

  return input
}

function createTimestamp(): string {
  const now = new Date()
  return [
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds()
  ].join('-')
}

export function createUniqueSceneId(): string {
  return `${createTimestamp()}-${uniqueId()}`
}

// @todo: just use as the color as is? No performance penalty by using full object
export function createMiniColorFromColor(color: Color): MiniColor {
  return {
    brandKey: color.brandKey,
    id: color.id,
    colorNumber: color.colorNumber,
    red: color.red,
    blue: color.blue,
    green: color.green,
    hex: color.hex,
    L: color.lab.L,
    A: color.lab.A,
    B: color.lab.B
  }
}

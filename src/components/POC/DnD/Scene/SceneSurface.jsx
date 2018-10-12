// @flow
import React, { PureComponent } from 'react'
import { ItemTypes } from '../Constants'
import { DropTarget } from 'react-dnd'

import './Scene.scss'

type Props = {
  connectDropTarget: Function,
  isOver: Boolean,
  id: number, // eslint-disable-line
  onDrop: Function, // eslint-disable-line
  color: string
}

const sceneSurfaceSpec = {
  drop (props: Props, monitor) {
    const droppedItem = monitor.getItem()

    if (droppedItem && droppedItem.colorValue) {
      props.onDrop(props.id, droppedItem.colorValue)
    }
  }
}

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
}

class SceneSurface extends PureComponent<Props> {
  static defaultProps = {}
  static baseClass = 'prism-scene__surface'
  static getClassName (isOver) {
    return [
      SceneSurface.baseClass,
      isOver ? `${SceneSurface.baseClass}--hover` : null
    ].join(' ')
  }

  render () {
    const { connectDropTarget, isOver, color } = this.props
    return connectDropTarget(
      <div className={SceneSurface.getClassName(isOver)}
        style={{ backgroundColor: color }} />
    )
  }
}

export default DropTarget(ItemTypes.SWATCH, sceneSurfaceSpec, collect)(SceneSurface)

// @flow
import React, { PureComponent } from 'react'
import { DRAG_TYPES } from 'constants/globals'
import { DropTarget } from 'react-dnd'

type Props = {
  connectDropTarget: Function,
  isOver: Boolean,
  id: string, // eslint-disable-line
  onDrop: Function, // eslint-disable-line
  onClick: Function, // eslint-disable-line
  onOver: Function,
  onOut: Function,
  svgSource: string
}

const TintableSceneHitAreaSpec = {
  drop (props: Props, monitor) {
    const droppedItem = monitor.getItem()

    if (droppedItem && droppedItem.color && droppedItem.color.hex) {
      props.onDrop(props.id, droppedItem.color.hex)
    }
  }
}

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
    // canDrop: monitor.canDrop(),
  }
}

class TintableSceneHitArea extends PureComponent<Props> {
  static defaultProps = {}
  static baseClass = 'prism-scene-manager__scene__hit-area'
  static baseClassMask = `${TintableSceneHitArea.baseClass}__mask`

  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.isOver !== this.props.isOver) {
      if (this.props.isOver) {
        this.props.onOver(this.props.id)
      } else {
        this.props.onOut(this.props.id)
      }
    }
  }

  handleClick = function handleClick (e: any) {
    this.props.onClick(this.props.id)
  }

  render () {
    const { connectDropTarget, svgSource, isOver } = this.props

    return connectDropTarget && connectDropTarget(
      <svg className={TintableSceneHitArea.baseClass}>
        <use className={`${TintableSceneHitArea.baseClassMask} ${isOver ? `${TintableSceneHitArea.baseClassMask}--hover` : ''}`}
          xlinkHref={`${svgSource}#mask`}
          onClick={this.handleClick} />
      </svg>
    )
  }
}

export default DropTarget(DRAG_TYPES.SWATCH, TintableSceneHitAreaSpec, collect)(TintableSceneHitArea)

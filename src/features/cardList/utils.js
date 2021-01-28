import { Node } from 'slate'
import _ from 'lodash'

export const serialize = nodes => {
  return nodes.map(n => Node.string(n)).join('\n')
}

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone

  return result
}

const grid = 8

export const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: grid * 2,
  wordBreak: 'break-all',
  height: '100px',
  overflowY: 'auto',
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? 'lightgreen' : '#fff',
  ...draggableStyle,
})

export const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
  margin: grid,
})

export const newList = () => ({
  id: _.uniqueId(),
  items: [],
})

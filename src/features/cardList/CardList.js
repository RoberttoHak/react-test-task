import React, { useMemo, useState } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import _ from 'lodash'
import './style.css'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { getItemStyle, getListStyle, move, reorder, serialize } from './utils'
import { useDispatch, useSelector } from 'react-redux'
import { selectLists, setLists } from './cardListSlice'
import { Button } from 'antd'

export const CardList = () => {
  const editor = useMemo(() => withReact(createEditor()), [])

  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ])

  const lists = useSelector(selectLists)
  const dispatch = useDispatch()

  const addItem = () => {
    const serialized = serialize(value)

    if (!serialized.length) {
      alert('Please fill in some text')
      return
    }

    const newLists = lists.map((list, key) => {
      if (key === 0) {
        return {
          ...list,
          items: [...list.items, {
            id: _.uniqueId(),
            value: serialized,
          }],
        }
      }

      return list
    })

    dispatch(setLists(newLists))

    setValue([
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ])
  }

  const onDragEnd = result => {
    const clonedLists = _.cloneDeep(lists)
    const { source, destination } = result

    if (!destination) {
      return
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        clonedLists.find(list => list.id === source.droppableId).items,
        source.index,
        destination.index,
      )

      dispatch(setLists(clonedLists.map(list => {
        if (list.id === source.droppableId) {
          list.items = items
        }

        return list
      })))
    } else {
      const result = move(
        clonedLists.find(list => list.id === source.droppableId).items,
        clonedLists.find(list => list.id === destination.droppableId).items,
        source,
        destination,
      )

      dispatch(setLists(clonedLists.map(list => {
        if (list.id === source.droppableId) {
          list.items = result[source.droppableId]
        }

        if (list.id === destination.droppableId) {
          list.items = result[destination.droppableId]
        }

        return list
      })))
    }
  }

  return (
    <div>
      <div className="text-editor-wrapper">
        <Button type="primary" className="text-editor__button" onClick={addItem}>Add</Button>
        <div className="text-editor">
          <Slate editor={editor} value={value} onChange={newVal => setValue(newVal)}>
            <Editable/>
          </Slate>
        </div>
      </div>

      <div className="list-container">
        <DragDropContext onDragEnd={onDragEnd}>
          {lists.map(list => (
            <Droppable droppableId={list.id} key={list.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  className="list"
                >
                  {list.items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                          )}>
                          {item.value}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  )
}

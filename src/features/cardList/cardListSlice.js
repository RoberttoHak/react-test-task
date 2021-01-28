import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import { newList } from './utils'

const initialLists = _.range(0, 10).map(() => {
  return newList()
})

export const cardListSlice = createSlice({
  name: 'cardList',
  initialState: {
    lists: initialLists,
  },
  reducers: {
    setLists: (state, action) => {
      state.lists = action.payload
    },
  },
})

export const { setLists } = cardListSlice.actions

export const selectLists = state => state.cardList.lists

export default cardListSlice.reducer

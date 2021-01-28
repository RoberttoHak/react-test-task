import { configureStore } from '@reduxjs/toolkit'
import cardListReducer from '../features/cardList/cardListSlice'

export default configureStore({
  reducer: {
    cardList: cardListReducer,
  },
})

import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface AppState {
  app: {}
}

const initialState: AppState = {
  app: {}
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    increment: (state) => {
      // state.value += 1
    },
    decrement: (state) => {
      // state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      // state.value += action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = appSlice.actions

export default appSlice.reducer

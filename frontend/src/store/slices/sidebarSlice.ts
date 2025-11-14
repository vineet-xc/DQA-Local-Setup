import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface SidebarState {
    isCollapsed: boolean
}

const initialState: SidebarState = {
    isCollapsed: false
}

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isCollapsed = !state.isCollapsed
        },
        setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.isCollapsed = action.payload
        },
        collapseSidebar: (state) => {
            state.isCollapsed = true
        },
        expandSidebar: (state) => {
            state.isCollapsed = false
        }
    }
})

export const {
    toggleSidebar,
    setSidebarCollapsed,
    collapseSidebar,
    expandSidebar
} = sidebarSlice.actions

export default sidebarSlice.reducer
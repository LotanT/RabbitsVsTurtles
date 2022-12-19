import { configureStore } from "@reduxjs/toolkit";

import playersReducer from './playersSlice'
import infoReducer from './infoSlice'
import pastEventsReducer from './pastEventsSlice'
import playerReducer from './playerToShowSlice'
import eventsRducer from './eventsSlice'
import darkModeRducer from './darkModeSlice'
import connectionNameRducer from './connectionNameSlice'
import chatReducer from './chatSlice'

export const store = configureStore({
    reducer: {
        players: playersReducer,
        info: infoReducer,
        pastEvents: pastEventsReducer,
        player: playerReducer,
        events: eventsRducer,
        darkMode: darkModeRducer,
        connectionName : connectionNameRducer,
        chat: chatReducer
    }
})
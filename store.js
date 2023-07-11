import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  libs: []
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'UPDATE_LIBS':
      return { ...state, libs: action.payload };
    default:
      return state;
  }
};

const store = configureStore({
  reducer: { lib: reducer } 
});

export default store;
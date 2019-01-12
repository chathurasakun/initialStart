import { createStore, combineReducers } from 'redux';
import operationReducer from './reducers/operationReducer';

const rootReducer = combineReducers({
  userDetails: operationReducer
});

const configureStore = () => {
  return createStore(rootReducer);
}

export default configureStore;
import { combineReducers } from 'redux';
import alerts from './alerts';
import restaurant from './restaurant';

export default combineReducers({
	alerts,
	restaurant,
});

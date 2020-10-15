import axios from 'axios';
import { setAlert } from './alerts';
import { GET_RESTAURANTS, GET_RESTAURANTS_ERROR } from './types';

/**
 *  Get Restaurants
 */
export const getRestaurants = () => async (dispatch) => {
	try {
		const res = await axios.get('/api/restaurants/');
		console.log(res.data);
		// dispatch restaurants and success type
		dispatch({
			type: GET_RESTAURANTS,
			payload: res.data,
		});
	} catch (err) {
		//dispatch(setAlert(err.response.data, 'error'));

		dispatch({
			type: GET_RESTAURANTS_ERROR,
		});
	}
};

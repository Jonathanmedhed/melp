import { GET_RESTAURANTS, GET_RESTAURANTS_ERROR } from '../actions/types';
const initialState = {
	loading: true,
	restaurants: null,
	error: {},
};
export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case GET_RESTAURANTS:
			return {
				...state,
				restaurants: payload,
				loading: false,
			};
		case GET_RESTAURANTS_ERROR:
			return {
				...state,
				loading: false,
			};
		default:
			return state;
	}
}

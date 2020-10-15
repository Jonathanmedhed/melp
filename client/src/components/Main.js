import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import Jumbo from '../components/jumbo/Jumbo';
import Navbar from '../components/navbar/Navbar';

// Functions
import { getRestaurants } from '../actions/restaurant';
import { setAlert } from '../actions/alerts';

const Main = ({
	// Restaurant
	getRestaurants,
	// Alert
	setAlert,
	//States
	restaurant: { loading, restaurants },
}) => {
	useEffect(() => {
		getRestaurants();
	}, [getRestaurants]);

	return (
		<div className="main">
			<Navbar />
			<Jumbo />
		</div>
	);
};

Main.propTypes = {
	// Alerts
	setAlert: PropTypes.func.isRequired,
	// Restaurant
	getRestaurants: PropTypes.func.isRequired,
	restaurant: PropTypes.array.isRequired,
	// Loading
	loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	restaurant: state.restaurant,
	loading: state.loading,
});

export default connect(mapStateToProps, {
	getRestaurants,
	setAlert,
})(Main);

import React, { useState, useEffect, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import Body from '../components/body/Body';
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
	// References
	let topRef = createRef();
	let bodyRef = createRef();
	let mapRef = createRef();

	// Move to references
	const toTop = () => {
		window.scrollTo(0, topRef.current.offsetTop);
	};
	const toBody = () => {
		window.scrollTo(0, bodyRef.current.offsetTop);
	};
	const toMap = () => {
		window.scrollTo(0, mapRef.current.offsetTop);
	};

	useEffect(() => {
		getRestaurants();
	}, [getRestaurants]);

	return (
		<div className="main">
			{/** Reference to return screen to top */}
			<div ref={topRef}></div>
			<Navbar toTop={toTop} toBody={toBody} toMap={toMap} />
			{/** Reference to return screen to top */}
			<Jumbo toBody={toBody} />
			<div ref={bodyRef}></div>
			<Body loading={loading} restaurants={restaurants} toTop={toTop} toBody={toBody} toMap={toMap} />
			<div ref={mapRef}></div>
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

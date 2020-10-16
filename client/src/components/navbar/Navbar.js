import React from 'react';

const Navbar = ({ toTop, toBody, toMap }) => {
	return (
		<nav className="navbar">
			<div className="left">
				<div className="title">melp</div>
				<i className="fas fa-utensils"></i>
			</div>
			<div className="right">
				<div onClick={() => toBody()} className="item">
					Find a Restaurant
				</div>
			</div>
		</nav>
	);
};
export default Navbar;

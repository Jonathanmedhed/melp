import React from 'react';

const Jumbo = () => {
	return (
		<div className="jumbo">
			<img src={require('../../img/jumbo.jpg')} className="bg-pic"></img>
			<div className="jumbo-content">
				<div className="title">
					<div className="text">Melp</div>
					<i className="fas fa-utensils"></i>
				</div>
				<div className="intro">Find the restaurant that suits your needs</div>
				<div className="btn btn-primary">Go get them!</div>
			</div>
		</div>
	);
};
export default Jumbo;

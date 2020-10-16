import React from 'react';

// Components
import { Rating } from 'primereact/rating';
import { GMap } from 'primereact/gmap';

const Restaurant = ({ restaurant }) => {
	const options = {
		center: { lat: 36.890257, lng: 30.707417 },
		zoom: 12,
	};

	return (
		<div className="restaurant">
			<div className="info-card">
				<div className="name">Restaurant</div>
				<div className="rating">
					<Rating stars={4} value={3} readonly cancel={false}></Rating>
				</div>
				<div className="address">Maracay</div>
				<div className="options">
					<div className="btn btn-primary">Face</div>
					<div className="btn btn-primary">Go</div>
					<div className="btn btn-primary">Web</div>
				</div>
			</div>
			<div className="map-buttons">
				<div className="btn btn-danger">exit</div>
				<div className="btn btn-primary">Go to list</div>
				<div className="map">
					{/**
                 
				<GMap options={options} style={{ width: '100%', minHeight: '320px' }} />
                 */}
				</div>
			</div>
		</div>
	);
};
export default Restaurant;

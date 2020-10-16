/*global google*/
import React, { useState, Fragment } from 'react';

// Components
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import { GMap } from 'primereact/gmap';

const Body = ({ restaurants, loading, toBody, toMap }) => {
	const [selectedRestaurant, setSelectedRestaurant] = useState(null);

	//Gmap
	const [options, setOptions] = useState({
		center: { lat: 19.440057053713137, lng: -99.12704709742486 },
		zoom: 12,
	});

	// Dataview states
	const [layout, setLayout] = useState('grid');
	const [sortKey, setSortKey] = useState(null);
	const [sortOrder, setSortOrder] = useState(null);
	const [sortField, setSortField] = useState(null);

	// Sorting options
	const sortOptions = [
		{ label: 'Name Z to A', value: '!name' },
		{ label: 'Name A to Z', value: 'name' },
		{ label: 'Rating High to Low', value: '!rating' },
		{ label: 'Rating Low to High', value: 'rating' },
	];

	// Sorting function
	let onSortChange = (event) => {
		const value = event.value;

		if (value.indexOf('!') === 0) {
			setSortOrder(-1);
			setSortField(value.substring(1, value.length));
			setSortKey(value);
		} else {
			setSortOrder(1);
			setSortField(value);
			setSortKey(value);
		}
	};

	// layout for grid item
	let renderGridItem = (data) => {
		return (
			<div
				onClick={() => setSelectedRestaurant(data)}
				className={selectedRestaurant === data ? 'restaurant-ver-highlighted' : 'restaurant-ver'}
			>
				<div className="name">{data.name}</div>
				<div className="rating">
					<Rating stars={4} value={data.rating} readonly cancel={false}></Rating>
				</div>
				<div className="address">
					<div>
						{data.address.city} - {data.address.street}
					</div>
				</div>
				<div className="options">
					<i onClick={() => toMap()} className="fas fa-map-marker-alt"></i>
					<a href={data.contact.site}>
						<i class="fab fa-chrome"></i>
					</a>
					<a href={`mailto:${data.contact.email}`}>
						<i class="fas fa-envelope"></i>
					</a>
					<a href={`tel:${data.contact.phone}`}>
						<i class="fas fa-phone"></i>
					</a>
				</div>
			</div>
		);
	};

	// return layout depending on option
	let itemTemplate = (product, layout) => {
		if (!product) {
			return;
		}
		if (layout === 'grid') return renderGridItem(product);
	};

	// Dataview Header
	let header = (
		<div className="dataview-header">
			<Dropdown
				options={sortOptions}
				value={sortKey}
				optionLabel="label"
				placeholder="Sort Options"
				onChange={onSortChange}
			/>
		</div>
	);

	return (
		<div className="body">
			<div className="title-separator">Restaurans in Town</div>
			<div className="content">
				<DataView
					value={restaurants && restaurants}
					layout={layout}
					header={header}
					itemTemplate={itemTemplate}
					paginator
					rows={9}
					sortOrder={sortOrder}
					sortField={sortField}
				/>
				{selectedRestaurant ? (
					<Fragment>
						<GMap
							options={{
								center: {
									lat: selectedRestaurant.address.location.lat,
									lng: selectedRestaurant.address.location.lng,
								},
								zoom: 12,
							}}
							overlays={[
								new google.maps.Marker({
									position: {
										lat: selectedRestaurant.address.location.lat,
										lng: selectedRestaurant.address.location.lng,
									},
									title: 'Ataturk Park',
								}),
							]}
							className="map"
							style={{ width: '100%' }}
						/>
					</Fragment>
				) : (
					<GMap options={options} className="map" style={{ width: '100%' }} />
				)}
				<div className="options-mobile">
					<div className="btn btn-primary" onClick={() => toBody()}>
						Go to list
					</div>
				</div>
			</div>
		</div>
	);
};
export default Body;

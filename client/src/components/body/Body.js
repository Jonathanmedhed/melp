/*global google*/
import React, { useState, Fragment } from 'react';

// Components
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import { GMap } from 'primereact/gmap';
import { FacebookProvider, Like } from 'react-facebook';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';

const Body = ({ restaurants, loading, toBody, toMap }) => {
	// Selected restaurant from list
	const [selectedRestaurant, setSelectedRestaurant] = useState(null);

	/************************* Dialog ******************************/

	// show dialog state
	const [showDialog, setShowDialog] = useState(false);
	const [minimizeDialog, setMinimizeDialog] = useState(false);

	// hide dialog
	const onHide = () => {
		setShowDialog(false);
		setSearchDone(false);
		setRecommendSearchDone(false);
	};

	/************************* Gmap ******************************/

	// Gmap default location
	const [options, setOptions] = useState({
		center: { lat: 19.440057053713137, lng: -99.12704709742486 },
		zoom: 12,
	});

	// Gmap states
	const [meters, setMeters] = useState(null);
	const [overlays, setOverlays] = useState(null);
	const [pointSelected, setPointSelected] = useState(null);
	const [restaurantsInRange, setRestaurantsInRange] = useState([]);
	const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);
	const [searchDone, setSearchDone] = useState(false);
	const [recommendSearchDone, setRecommendSearchDone] = useState(false);
	const [min, setMin] = useState(0);
	const [max, setMax] = useState(1);

	// set selected point on map click
	const onMapClick = (event) => {
		setPointSelected({ lat: event.latLng.lat(event.hb.x), lng: event.latLng.lng(event.hb.y) });
		setOverlays([
			new google.maps.Marker({
				position: {
					lat: event.latLng.lat(event.hb.x),
					lng: event.latLng.lng(event.hb.y),
				},
			}),
		]);
	};

	// Create radius
	const createRadius = () => {
		let newOverlays = [];
		// create area
		let area = new google.maps.Circle({
			center: { lat: pointSelected.lat, lng: pointSelected.lng },
			fillColor: '#1976D2',
			fillOpacity: 0.35,
			strokeWeight: 1,
			radius: meters,
		});
		newOverlays.push(area);
		setOverlays(newOverlays);
	};

	// Check if location witheen radius
	const arePointsNear = (checkPoint, centerPoint, kms) => {
		var ky = 40000 / 360;
		var kx = Math.cos((Math.PI * centerPoint.lat) / 180.0) * ky;
		var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
		var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
		return Math.sqrt(dx * dx + dy * dy) <= kms / 1000;
	};

	// Check if array of rstaurants inside radius
	const checkRestaurantsInRange = () => {
		let list = [];
		let overlayList = [];
		restaurants.forEach((element) => {
			if (arePointsNear(element.address.location, pointSelected, meters)) {
				// add to restaurant list
				list.push(element);
				// add to map overlay list
				overlayList.push(
					new google.maps.Marker({
						position: {
							lat: element.address.location.lat,
							lng: element.address.location.lng,
						},
						title: element.name,
					})
				);
			}
		});
		setOverlays(overlayList);
		setRestaurantsInRange(list);
		setSearchDone(true);
	};

	// Check if restaurants between raring range
	const checkRestaurantsRatingInRange = (min, max, restaurants) => {
		let list = [];
		let overlayList = [];
		restaurants.forEach((element) => {
			if (element.rating <= max && element.rating >= min) {
				// add to restaurant list
				list.push(element);
				// add to map overlay list
				overlayList.push(
					new google.maps.Marker({
						position: {
							lat: element.address.location.lat,
							lng: element.address.location.lng,
						},
						title: element.name,
					})
				);
			}
		});
		setOverlays(overlayList);
		setRecommendedRestaurants(list);
		setRecommendSearchDone(true);
	};

	// Get average rating
	const getAverageRating = (list) => {
		let sum = 0;
		list.forEach((item) => {
			sum = sum + item.rating;
		});
		return sum / list.length;
	};

	// Create array of ratings
	const getRatingsArray = (list) => {
		let ratings = [];
		list.forEach((item) => {
			ratings.push(item.rating);
		});
		return ratings;
	};

	// Calculate standard deviation
	const standardDeviation = (values) => {
		let avg = average(values);

		let squareDiffs = values.map((value) => {
			let diff = value - avg;
			let sqrDiff = diff * diff;
			return sqrDiff;
		});

		let avgSquareDiff = average(squareDiffs);

		let stdDev = Math.sqrt(avgSquareDiff);
		return stdDev;
	};

	// Get average from list
	const average = (data) => {
		let sum = data.reduce((sum, value) => {
			return sum + value;
		}, 0);

		let avg = sum / data.length;
		return avg;
	};

	/*********************************** Dataview ******************************************/
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
						<i className="fab fa-chrome"></i>
					</a>
					<a href={`mailto:${data.contact.email}`}>
						<i className="fas fa-envelope"></i>
					</a>
					<a href={`tel:${data.contact.phone}`}>
						<i className="fas fa-phone"></i>
					</a>
					<FacebookShareButton
						url={data.contact.site}
						quote={'Check out this amazing restaurant'}
						hashtag={`#${data.name}`}
						className="facebook-share"
					>
						<i className="fab fa-facebook-square"></i>
					</FacebookShareButton>
				</div>
				<FacebookProvider appId="717589285046812">
					<Like href="https://www.facebook.com/subway/" colorScheme="dark" showFaces={false} share={false} />
				</FacebookProvider>
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
			{/** Show/Hide dialog to check map */}
			{minimizeDialog ? (
				<div className="absolute">
					<div onClick={() => setMinimizeDialog(false)} className="btn btn-primary">
						{!pointSelected ? 'Select a location on map' : 'Open search form'}
					</div>
				</div>
			) : (
				<Dialog header="Search" visible={showDialog} onHide={() => onHide()}>
					<div className="top-options">
						{/** First Search Fields */}
						{!searchDone ? (
							<Fragment>
								<div className="form-group">
									<div className="label">Range(mts)</div>
									<InputNumber
										value={meters}
										onValueChange={(e) => setMeters(e.value)}
										suffix=" mts"
									/>
								</div>
								<div className="form-group">
									<div className="label">Selected Location</div>
									<div className="selected-loc">
										<Checkbox checked={pointSelected}></Checkbox>
										{/** Button to minimize dialog */}
										<div
											onClick={() => setMinimizeDialog(true)}
											className={!pointSelected ? 'btn btn-success' : 'btn btn-danger'}
										>
											{!pointSelected ? 'select' : 'change'}
										</div>
									</div>
								</div>
								{/** Draw area on map */}
								<div onClick={() => createRadius()} className="btn btn-primary">
									Set Area
								</div>
								{/** Search for restaurants in area */}
								{overlays && (
									<div onClick={() => checkRestaurantsInRange()} className="btn btn-success">
										Search
									</div>
								)}
							</Fragment>
						) : (
							<Fragment>
								{/** Search Results */}
								{!recommendSearchDone && (
									<div className="form-group">
										<div className="label">Restaurants In Range</div>
										<div>{restaurantsInRange.length}</div>
									</div>
								)}
								{restaurantsInRange.length > 0 && !recommendSearchDone && (
									<div className="form-group">
										<div className="label">Average Rating</div>
										<div>{getAverageRating(restaurantsInRange)}</div>
									</div>
								)}
								{restaurantsInRange.length > 0 && !recommendSearchDone && (
									<div className="form-group">
										<div className="label">Standard Deviation</div>
										<div>{standardDeviation(getRatingsArray(restaurantsInRange))}</div>
									</div>
								)}
								{/** Second Search Fields */}
								{restaurantsInRange.length > 0 && (
									<div className="form-group">
										<div className="label">Search By Rating</div>
										<div className="range">
											<InputNumber
												value={min}
												onValueChange={(e) => setMin(e.value)}
												min={0}
												max={4}
												placeholder={'min'}
											/>
											<div>to</div>
											<InputNumber
												value={max}
												onValueChange={(e) => setMax(e.value)}
												min={1}
												max={4}
												placeholder={'max'}
											/>
										</div>
										{/** Search recommended by rating */}
										<div
											onClick={() => checkRestaurantsRatingInRange(min, max, restaurantsInRange)}
											className="btn btn-primary"
										>
											search
										</div>
									</div>
								)}
								{/** 1rst search try again button */}
								{restaurantsInRange.length === 0 && (
									<div onClick={() => setSearchDone(false)} className="btn btn-danger">
										try again
									</div>
								)}
								{/** Second search results */}
								{recommendSearchDone && recommendedRestaurants && (
									<Fragment>
										<div className="form-group">
											<div className="label">Restaurants In Range</div>
											<div>{recommendedRestaurants.length}</div>
										</div>
									</Fragment>
								)}
								{/** 2nd search try again button */}
								{recommendSearchDone && recommendedRestaurants.length === 0 && (
									<div onClick={() => setRecommendSearchDone(false)} className="btn btn-danger">
										try again
									</div>
								)}
							</Fragment>
						)}
					</div>
				</Dialog>
			)}
			{/** Jumbo to body separator */}
			<div className="title-separator">
				<div className="title">Restaurans in Town </div>
				<div onClick={() => setShowDialog(true)} className="search">
					<div className="text">Search</div>
					<i class="fas fa-search"></i>
				</div>
			</div>
			{/** Body Content */}
			<div className="content">
				{/** Restaurant List */}
				<DataView
					value={
						recommendedRestaurants.length > 0 &&
						restaurantsInRange.length > 0 &&
						restaurants &&
						restaurants.length > 0
							? recommendedRestaurants
							: !recommendedRestaurants.length > 0 &&
							  restaurantsInRange.length > 0 &&
							  restaurants &&
							  restaurants.length > 0
							? restaurantsInRange
							: !recommendedRestaurants.length > 0 &&
							  !restaurantsInRange.length > 0 &&
							  restaurants &&
							  restaurants.length > 0 &&
							  restaurants
					}
					layout={layout}
					header={header}
					itemTemplate={itemTemplate}
					paginator
					rows={9}
					sortOrder={sortOrder}
					sortField={sortField}
				/>
				<Fragment>
					{/** Maps */}
					{selectedRestaurant && !overlays ? (
						<Fragment>
							<GMap
								onMapClick={onMapClick}
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
										title: selectedRestaurant.name,
									}),
								]}
								className="map"
								style={{ width: '100%' }}
							/>
						</Fragment>
					) : overlays ? (
						<GMap
							onMapClick={onMapClick}
							options={options}
							overlays={overlays}
							className="map"
							style={{ width: '100%' }}
						/>
					) : (
						<GMap onMapClick={onMapClick} options={options} className="map" style={{ width: '100%' }} />
					)}
				</Fragment>
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

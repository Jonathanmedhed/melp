import React, { useState } from 'react';

import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import { GMap } from 'primereact/gmap';

const Body = ({ restaurants, loading }) => {
	//Gmap
	const options = {
		center: { lat: 36.890257, lng: 30.707417 },
		zoom: 12,
	};

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
			<div className="restaurant-ver">
				<div className="name">{data.name}</div>
				<div className="rating">
					<Rating stars={4} value={data.rating} readonly cancel={false}></Rating>
				</div>
				<div className="address">{data.address.city}</div>
				<div className="options">
					<div className="btn btn-primary">visit</div>
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
			<div className="title-separator">Best Restaurans in Town</div>
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
				<GMap options={options} style={{ width: '100%', minHeight: '320px' }} />
			</div>
		</div>
	);
};
export default Body;

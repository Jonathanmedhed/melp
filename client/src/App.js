import React, { Fragment } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
// Redux
import { Provider } from 'react-redux';
import store from './store';

import './scss/App.scss';

// Components
import Main from './components/Main';

const App = () => (
	<Fragment>
		<Provider store={store}>
			<Router>
				<Main />
			</Router>
		</Provider>
	</Fragment>
);

export default App;

import React from 'react';
import MapComponent from './components/mapComponent';
import MapMarkers from './components/markersMap'
import Event from './components/collaboratorEvent'
import CalendaryWithEvents from './components/calendaryWithEvents'
import Galery from './components/collaboratorGalery'
import GaleryViews from './components/galeryView';
const App = () => {
  return (
    <div className="App">
        <CalendaryWithEvents/>
    </div>
  );
};

export default App;


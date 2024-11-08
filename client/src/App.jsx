import React from 'react';
import MapComponent from './components/mapComponent';

const App = () => {
  return (
    <div className="App">
        <h3>Mapa de Marcadores</h3>
        <h1>Marca el punto en el mapa donde quieras agregar informacion</h1>
        <MapComponent />
    </div>
  );
};

export default App;


import { useState } from 'react';

const MarkerForm = ({ formData, setFormData, editMode, setMarkers, markers, currentMarkerIndex, handleCloseForm }) => {
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMediaChange = (e) => {
    const { files, name } = e.target;
    const updatedFiles = { ...formData };

    if (name === "image") {
      updatedFiles.image = Array.from(files);
    } else if (name === "audio") {
      updatedFiles.audio = Array.from(files);
    }

    setImageFile(updatedFiles);
    setAudioFile(updatedFiles);
  };


  const uploadFile = async (file) => {
    const fileData = new FormData();
    fileData.append('file', file);
    fileData.append('upload_preset', 'my_preset');
  
    try {
      console.log("Intentando cargar archivo en Cloudinary...");
      const res = await fetch(`https://api.cloudinary.com/v1_1/dkktczf96/upload`, {
        method: 'POST',
        body: fileData,
      });
      
      const data = await res.json();
      console.log("Respuesta de Cloudinary:", data);
  
      if (data.secure_url) {
        console.log("URL del archivo cargado:", data.secure_url);
        return data.secure_url;
      } else {
        console.error('Error en la respuesta de subida de archivo:', data);
        return null;
      }
    } catch (error) {
      console.error('Error al subir el archivo a Cloudinary:', error);
      return null;
    }
  };
  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Imagen seleccionada:", imageFile);
    console.log("Audio seleccionado:", audioFile);
  
    // Subir solo los archivos que están presentes
    let imageUrl = formData.image;
    let audioUrl = formData.audio;
  
    if (imageFile) {
      imageUrl = await uploadFile(imageFile);
      console.log("URL de la imagen cargada:", imageUrl);
      if (!imageUrl) {
        console.error('Error al cargar la imagen.');
        return;
      }
    }
  
    if (audioFile) {
      audioUrl = await uploadFile(audioFile);
      if (!audioUrl) {
        console.error('Error al cargar el audio.');
        return;
      }
    }
  
    // Rellenar solo los campos con URL válidas o conservar el valor original si están vacíos
    const requestData = {
      ...formData,
      image: imageUrl || formData.image,
      audio: audioUrl || formData.audio,
      lat: formData.lat,
      lng: formData.lng,
    };
  
    // Continuar con la lógica de envío del marcador...
    try {
      if (editMode) {
        await fetch(`http://localhost:4000/api/markers/${markers[currentMarkerIndex]._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });
        const updatedMarkers = [...markers];
        updatedMarkers[currentMarkerIndex] = requestData;
        setMarkers(updatedMarkers);
      } else {
        const response = await fetch('http://localhost:4000/api/markers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });
        const newMarker = await response.json();
        setMarkers([...markers, newMarker]);
      }
      console.log()
      handleCloseForm();
    } catch (error) {
      console.error('Error al enviar el marcador:', error);
    }
  };
  

  return (
    <div style={{ position: 'absolute', top: '10%', left: '10%', background: 'white', padding: '1rem', zIndex: 1000 }}>
      <form onSubmit={handleFormSubmit}>
        <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleInputChange} required />
        <textarea name="description" placeholder="Descripción" value={formData.description} onChange={handleInputChange} required />
        <select name="category" value={formData.category} onChange={handleInputChange} required>
          <option value="">Seleccione una categoría</option>
          <option value="escuela">Escuela</option>
          <option value="monumento">Monumento</option>
          <option value="museo">Museo</option>
          <option value="mastil">Mástil</option>
          <option value="ferrocarril">Ferrocarril</option>
          <option value="municipalidad">Municipalidad</option>
        </select>
        
        <label>
          Latitud:
          <input type="number" name="lat" value={formData.lat} onChange={handleInputChange} step="0.000001" required readOnly />
        </label>
        <label>
          Longitud:
          <input type="number" name="lng" value={formData.lng} onChange={handleInputChange} step="0.000001" required readOnly />
        </label>
        
        <input type="file" name="image" onChange={handleMediaChange} accept="image/*"/>
        <input type="file" name="audio" onChange={handleMediaChange} accept="audio/*"/>
        <div>
          <button type="submit">{editMode ? 'Guardar Cambios' : 'Crear Marcador'}</button>
          <button type="button" onClick={handleCloseForm} style={{ marginLeft: '10px' }}>Cerrar</button>
        </div>
      </form>
    </div>
  );
};

export default MarkerForm;

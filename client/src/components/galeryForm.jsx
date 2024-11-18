import React, { useState, useEffect, useRef } from 'react';

const GaleryForm = ({ galery, editMode, onSave, onClose }) => {
  const [formGalery, setFormGalery] = useState({
    name: '',
    author: '',
    description: '',
    image: null,
  });

  const [preview, setPreview] = useState(null);  // Estado para la vista previa de la imagen
  const imageInputRef = useRef();

  useEffect(() => {
    if (editMode && galery) {
      console.log("Arte recibido para edición:", galery); // Verifica qué contiene 'event'
      setFormGalery({
        _id: galery._id,
        name: galery.name || '',
        author: galery.author || '',
        description: galery.description || '',
        image: galery.image || null,
      });
      setPreview(galery.image || null);  // Si es un evento editado, mostrar la imagen actual
    }
  }, [editMode, galery]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormGalery((prevGalery) => ({
      ...prevGalery,
      [name]: value,
    }));
  };

  const handleFileChange = async (galery) => {
    const file = galery.target.files[0];
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', 'DF_preset'); // Agregar el upload_preset aquí
    
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dtzgpdbyx/upload', {
        method: 'POST',
        body: uploadData,
      });
  
      const data = await response.json(); // Espera la respuesta JSON
      console.log('Respuesta de Cloudinary:', data);
  
      if (data.secure_url) {
        // Asigna la URL de la imagen a formEvent.image
        setFormGalery((prevGalery) => ({
          ...prevGalery,
          image: data.secure_url,
        }));
        setPreview(data.secure_url);  // Actualiza la vista previa
      } else {
        throw new Error('No se recibió una URL segura de Cloudinary');
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = {
      name: formGalery.name,
      author: formGalery.author,
      description: formGalery.description,
      image: formGalery.image,
    };
  
    try {
      let response;
      if (editMode && formGalery._id) {
        response = await fetch(`http://localhost:4000/api/galery/${formGalery._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch('http://localhost:4000/api/galery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }
  
      const data = await response.json();
      console.log('arte guardado:', data);
      onSave(data);
      onClose();
    } catch (error) {
      console.error('Error al guardar el arte:', error);
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md">
      <div>
        <label htmlFor="name" className="block">Nombre</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formGalery.name}
          onChange={handleChange}
          required
          className="input input-bordered w-full mb-2"
        />
      </div>
      <div>
        <label htmlFor="author" className="block">Autor</label>
        <input
          type="text"
          id="author"
          name="author"
          value={formGalery.author}
          onChange={handleChange}
          required
          className="input input-bordered w-full mb-2"
        />
      </div>
      <div>
        <label htmlFor="description" className="block">Descripción</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formGalery.description}
          onChange={handleChange}
          required
          className="input input-bordered w-full mb-2"
        />
      </div>
      <div>
        <label htmlFor="image" className="block">Imagen</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleFileChange}
          className="file-input file-input-bordered w-full mb-2"
        />
        {preview && (
          <div className="mt-2">
            <h3>Vista previa:</h3>
            <img src={preview} alt="Vista previa" className="max-w-xs mt-2" />
          </div>
        )}
      </div>
      <button type="submit" className="btn btn-primary w-full">{editMode ? 'Actualizar Arte' : 'Crear Arte'}</button>
      <button
        type="button"
        onClick={onClose}
        className="btn btn-secondary w-full mt-2"
      >
        Cerrar Formulario
      </button>
    </form>
  );
};

export default GaleryForm;

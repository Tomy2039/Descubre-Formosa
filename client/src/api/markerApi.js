import axios from 'axios';

export const createMarker = async (formData) => {
  try {
    const response = await axios.post('/api/markers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

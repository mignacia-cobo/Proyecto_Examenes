import axios from 'axios';

const API_URL = 'http://localhost:3000/api/salas';

export const getSalas = async () => {
  return await axios.get(API_URL);
};

export const createSala = async (sala) => {
  return await axios.post(API_URL, sala);
};

export const updateSala = async (id, sala) => {
  return await axios.put(`${API_URL}/${id}`, sala);
};

export const deleteSala = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};
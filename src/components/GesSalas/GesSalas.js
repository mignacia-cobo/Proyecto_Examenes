import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import './GesSalas.css';
import salaApi from '../../api/salaApi';
import { fetchSalasConfirmadas, eliminarSalasConfirmadas, guardarSala } from '../../services/api';

function GesSalas() {
  const [salas, setSalas] = useState([]);
  const [salasConfirmadas, setSalasConfirmadas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getSalasConfirmadas = async () => {
      try {
        const result = await fetchSalasConfirmadas();
        setSalasConfirmadas(result);
      } catch (error) {
        console.error('Error al obtener las salas confirmadas:', error);
      }
    };

    getSalasConfirmadas();
  }, []);

  const handleEdit = (ID_Sala) => {
    navigate(`/editar-sala/${ID_Sala}`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Por favor selecciona un archivo válido.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log('Datos leídos del archivo:', jsonData); 

      if (jsonData.length === 0 || Object.keys(jsonData[0]).length !== 5) {
        alert("El archivo no tiene el formato correcto.");
        return;
      }

      const salasCargadas = jsonData.map((row, index) => ({
        ID_Sala: index + 1,
        Codigo_sala: row['codigo_sala'],
        Nombre_sala: row['nombre_sala'],
        Capacidad: row['capacidad'],
        Edificio_ID: row['Edificio'],
        Estado: true,
      }));

      setSalas(salasCargadas);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleConfirmarSalas = async () => {
    try {
      const result = await Promise.all(salas.map(async (sala) => {
        console.log('Enviando sala al backend:', sala); // Log adicional
        const response = await guardarSala(sala);
        console.log('Respuesta del backend:', response); // Log adicional
        return response;
      }));
      setSalasConfirmadas(result);
      alert('Salas confirmadas con éxito.');
    } catch (error) {
      console.error('Error al guardar las salas en la base de datos:', error);
    }
  };

  const handleRemoveSalasConfirmadas = async () => {
    try {
      await eliminarSalasConfirmadas();
      setSalas([]);
      setSalasConfirmadas([]);
      alert('Salas eliminadas.');
    } catch (error) {
      console.error('Error al eliminar las salas confirmadas de la base de datos:', error);
    }
  };

  return (
    <div className='carga-masiva-container'>
      <h1>Carga Masiva de Salas</h1>
      <input type="file" onChange={handleFileUpload} accept=".xls, .xlsx" />
      {salas.length > 0 && (
        <>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Capacidad</th>
                <th>Edificio</th>
              </tr>
            </thead>
            <tbody>
              {salas.map((sala) => (
                <tr key={sala.ID_Sala}>
                  <td>{sala.Codigo_sala}</td>
                  <td>{sala.Nombre_sala}</td>
                  <td>{sala.Capacidad}</td>
                  <td>{sala.Edificio_ID}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <button onClick={handleConfirmarSalas}>Confirmar Salas</button>
        </>
      )}

      {salasConfirmadas.length > 0 && (
        <>
          <h2>Salas Confirmadas</h2>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre Sala</th>
                <th>Capacidad</th>
                <th>Edificio</th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody>
              {salasConfirmadas.map((sala) => (
                <tr key={sala.ID_Sala}>
                  <td>{sala.Codigo_sala}</td>
                  <td>{sala.Nombre_sala}</td>
                  <td>{sala.Capacidad}</td>
                  <td>{sala.Edificio_ID}</td>
                  <td>
                    <FaEdit onClick={() => handleEdit(sala.ID_Sala)} style={{ cursor: 'pointer' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleRemoveSalasConfirmadas} className="btn">
            <img className="imagen-boton" src="eliminar.png" alt="Eliminar" />
          </button>
        </>
      )}
    </div>
  );
}

export default GesSalas;
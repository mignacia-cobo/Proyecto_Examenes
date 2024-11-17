import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import './GesSalas.css';

function GesSalas() {
  const [salas, setSalas] = useState([]);
  const [salasConfirmadas, setSalasConfirmadas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const salasGuardadas = localStorage.getItem('salas');
    if (salasGuardadas) {
      setSalas(JSON.parse(salasGuardadas));
    }
  }, []);


  const handleEdit = (id) => {
    navigate(`/editar-sala/${id}`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Por favor selecciona un archivo válido.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      if (data[0].length !== 5) {
        alert("El archivo no tiene el formato correcto.");
        return;
      }

      const salasCargadas = data.slice(1).map((row) => ({
        id: row[0],
        codigo: row[1],
        nombre: row[2],
        capacidad: row[3],
        edificio: row[4]
      }));

      setSalas(salasCargadas);
    };
    reader.readAsBinaryString(file);
  };

  const confirmarSalas = () => {
    setSalasConfirmadas(salas);
    localStorage.setItem('salasConfirmadas', JSON.stringify(salas));
    localStorage.setItem('salas', JSON.stringify(salas));
    alert('Salas confirmadas con éxito.');
  };

  useEffect(() => {
    const salasGuardadas = localStorage.getItem('salas');//elimine salasConfirmadas prueba
    if (salasGuardadas) {
      setSalasConfirmadas(JSON.parse(salasGuardadas));
      setSalas(JSON.parse(salasGuardadas));
    }
  }, []);

  const handleRemoveSalasConfirmadas = () => {
    localStorage.removeItem('salasConfirmadas');
    localStorage.removeItem('salas');
    setSalas([]);
    setSalasConfirmadas([]);
    alert('Salas eliminadas.');
  };

  return (
    <div className='carga-masiva-container'>
      <h1>Carga Masiva de Salas</h1>
      <input type="file" onChange={handleFileUpload} accept=".xls, .xlsx" />
      {salas.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Nombre</th>
                <th>Capacidad</th>
                <th>Edificio</th>
                <th>Editar</th> {/* Nueva columna */}
              </tr>
            </thead>
            <tbody>
              {salas.map((sala) => (
                <tr key={sala.id}>
                  <td>{sala.id}</td>
                  <td>{sala.codigo}</td>
                  <td>{sala.nombre}</td>
                  <td>{sala.capacidad}</td>
                  <td>{sala.edificio}</td>
                  <td>
                    <FaEdit onClick={() => handleEdit(sala.id)} style={{ cursor: 'pointer' }} />
                  </td> {/* Ícono de edición */}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={confirmarSalas}>Confirmar Salas</button>
        </>
      )}

      {salasConfirmadas.length > 0 && (
        <>
          <h2>Salas Confirmadas</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Nombre Sala</th>
                <th>Capacidad</th>
                <th>Edificio</th>
              </tr>
            </thead>
            <tbody>
              {salasConfirmadas.map((sala) => (
                <tr key={sala.id}>
                  <td>{sala.id}</td>
                  <td>{sala.codigo}</td>
                  <td>{sala.nombre}</td>
                  <td>{sala.capacidad}</td>
                  <td>{sala.edificio}</td>
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

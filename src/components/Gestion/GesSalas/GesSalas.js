import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit,FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import './GesSalas.css';
import { fetchSalasConfirmadas, guardarSala,deleteSalaInAPI } from '../../../services/api';

function GesSalas() {
  const [salas, setSalas] = useState([]);
  const [salasConfirmadas, setSalasConfirmadas] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [newSala, setNewSala]  = useState({    
    Codigo_sala: '',
    Nombre_sala: '',
    Capacidad: '',
    Edificio_ID: '',
  });

  //SE OBTIENEN LAS SALAS REGISTRADAS EN LA BASE DE DATOS
  useEffect(() => {
    const getSalasConfirmadas = async () => {
      try {
        const result = await fetchSalasConfirmadas();
        console.log(result)
        setSalasConfirmadas(result);
      } catch (error) {
        console.error('Error al obtener las salas:', error);
      }
    };
    getSalasConfirmadas();
  }, []);

  //EDITAR SALA- SE ABRE VENTANA PARA EDITAR SALA
  const handleEdit = (ID_Sala) => {
    navigate(`/EditarSala/${ID_Sala}`);
  };

  //SUBIR ARCHIVO DE EXCEL, SE PREVISUALIZAN LAS SALAS ANTES DE GUARDARLAS
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

  //GUARDA LAS SALAS QUE SE CARGARON EN EL ARCHIVO EN LA BASE DE DATOS
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

  //ELIMINA UNA SALA DE LA BASE DE DATOS, SE PASA EL ID CUANDO SE LLAMA AL METODO, EL ID SE OBTIENE DE LA FILA DE LA TABLA DE SALAS CONFIRMADAS
  const handleRemoveSalasConfirmadas = async (ID_Sala) => {
    try {
      const response = await deleteSalaInAPI(ID_Sala);
      console.log('Sala eliminada ID_Sala:', ID_Sala, response);
      setSalasConfirmadas(prevSalasConfirmadas => prevSalasConfirmadas.filter(sala => sala.ID_Sala !== ID_Sala));
      alert('Salas eliminadas.');
    } catch (error) {
      console.error('Error al eliminar las salas confirmadas de la base de datos:', error);
    }
  };

  //AGREGAR SALA A LA BASE DE DATOS
  const handleAddSala = async () => {
    try {
      const response = await guardarSala(newSala);
      console.log('Sala agregada:', response);
      setSalasConfirmadas([...salasConfirmadas, newSala]);
      setNewSala({
        Codigo_sala: '',
        Nombre_sala: '',
        Capacidad: '',
        Edificio_ID: ''
      });
      alert('Sala agregada con éxito.');
    } catch (error) {
      console.error('Error al agregar la sala:', error);
    }
  };

  //BUESQUEDA DE SALAS
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  //FILTRAR SALAS
  const filteredSalas = salasConfirmadas.filter(sala =>
    sala.Codigo_sala.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sala.Nombre_sala.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sala.Capacidad.toString().includes(searchTerm) ||
    sala.Edificio_ID.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    console.log('salas confirmadas para filtrar',salasConfirmadas)
  );

  return (
    <>
      <p className="titulo">Gestión de Salas</p>
      <div className='container-lateral'>
        <div className="search-section">
          <h2>Registrar Sala</h2>
          <div className="search-box">
            <input
              type='text'
              placeholder='Código de Sala'
              value={newSala.Codigo_sala}
              onChange={(e) => setNewSala({ ...newSala, Codigo_sala: e.target.value })}
            />
            <input
              type='text'
              placeholder='Nombre de Sala'
              value={newSala.Nombre_sala}
              onChange={(e) => setNewSala({ ...newSala, Nombre_sala: e.target.value })}
            />
            <input
              type='number'
              placeholder='Capacidad'
              value={newSala.Capacidad}
              onChange={(e) => setNewSala({ ...newSala, Capacidad: e.target.value })}
            />
            <input
              type='text'
              placeholder='ID de Edificio'
              value={newSala.Edificio_ID}
              onChange={(e) => setNewSala({ ...newSala, Edificio_ID: e.target.value })}
            />
            <br></br>
            <button onClick={handleAddSala}>Agregar Sala</button>
          </div>

          <h2>Buscar Salas</h2>
          <div className="search-box">
            <input
              type='search'
              placeholder='Buscar...'
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <h2>Carga Masiva de Salas</h2>
          <div className='search-box'>
            <input
              className="file-input"
              type="file"
              onChange={handleFileUpload}
              accept=".xls, .xlsx"
              id="file-upload"
              style={{ display: 'none' }} // Oculta el input original
            />
            <button>
              <label htmlFor="file-upload" className="custom-file-upload">
                Examinar
              </label>
            </button>
            {salas.length > 0 && (
              <>
                <div class="search-box-table">
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
          </div>
        </div>
      </div>

      <div className="details-section">
        <div className="details-section-table">
          {filteredSalas.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th colSpan={5}>
                    <h2>Salas Registradas</h2>
                  </th>
                </tr>
                <tr>
                  <th>Código</th>
                  <th>Nombre Sala</th>
                  <th>Capacidad</th>
                  <th>Edificio</th>
                  <th>Editar</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalas.map(sala => (
                  <tr key={sala.ID_Sala}>
                    <td>{sala.Codigo_sala}</td>
                    <td>{sala.Nombre_sala}</td>
                    <td>{sala.Capacidad}</td>
                    <td>{sala.Edificio_ID}</td>
                    <td>
                      <FaEdit onClick={() => handleEdit(sala.ID_Sala)} style={{ cursor: 'pointer' }} />
                      <FaTrash onClick={() => handleRemoveSalasConfirmadas(sala.ID_Sala)} style={{ cursor: 'pointer' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}


export default GesSalas;
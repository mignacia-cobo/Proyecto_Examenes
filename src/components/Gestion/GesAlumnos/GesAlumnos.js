import React, { useState, useEffect } from 'react';
import './GesAlumnos.css';
import { IoIosAlbums } from "react-icons/io";
import { fetchAlumnos,uploadFileAlumnos, confirmUploadAlumnos }  from '../../../services/api';

const FileUpload = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  //OBTENER ALUMNOS
  useEffect(() => {
    const loadAlumnos = async () => {
    try {
        const data = await fetchAlumnos();
        setAlumnos(data);
        setLoading(false);
    } catch (error) {
        console.error("Error al cargar los alumnos:", error);
        setLoading(false);
    }
    };
    loadAlumnos();
  }, []);
  if (loading) {
      return <p>Cargando Alumnos...</p>;
  }

  //CARGA MASIVA DE ALUMNOS (SOLO SI LA SECCIÓN ESTÁ REGISTRADA SE CREARÁN LOS ALUMNOS)
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  //CARGA EL ARCHIVO
  const handleUpload = async () => {
    if (!file) {
      alert('Por favor selecciona un archivo primero.');
      return;
    }
    try {
      const data = await uploadFileAlumnos(file);
      setPreviewData(data); // Mostrar datos previsualizados
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
    }
  };

  //CONFIRMA LA CARGA
  const handleConfirm = async () => {
    try {
      await confirmUploadAlumnos(previewData);
      alert('Datos cargados exitosamente.');
      setPreviewData([]); // Limpia la previsualización
      await reloadAlumnos(); // Recarga los datos de la tabla principal
    } catch (error) {
      console.error('Error al confirmar la carga:', error);
    }
  };

  // FUNCIÓN PARA RECARGAR ALUMNOS
  const reloadAlumnos = async () => {
    try {
      setLoading(true); // Muestra "Cargando" mientras actualiza
      const data = await fetchAlumnos();
      setAlumnos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al recargar los alumnos:', error);
      setLoading(false);
    }
  };

  //BUSCAR ALUMNO
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
    
  //FILTRAR ALUMNO
  const filteredAlumno = alumnos?.filter(alumno =>
  alumno.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
  alumno.Rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
  alumno.Email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <p className='titulo'>Gestión Alumnos</p>
      <div className='container-lateral'>
        <div className='search-section'>
          <h2>Buscar Alumno</h2>
          <div className='search-box'>
            <input
              type='search'
              placeholder='Buscar...'
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <h2>Subir Archivo</h2>
          <div className='search-box'>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Subir Archivo</button>
          </div>
          <div className='search-box'>
            {previewData.length > 0 && (
              <div className="search-box-table">
                <table style={{overflowY:'auto'}}>
                  <thead>
                    <tr>
                      <th>Rut</th>
                      <th>Nombre</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index}>
                    <td>{row.rut}</td>
                    <td>{row.nombre}</td>
                    <td>{row.email}</td>
                    {/* Otros datos */}
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {previewData.length > 0 && (
            <div className='details-section-content'>
              <button onClick={handleConfirm}>Confirmar Carga</button>
            </div>
          )}
        </div>
      </div>
      <div className='details-section'>
        <div className='details-section-table'>
          {filteredAlumno.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th colSpan={5}><h2>Alumnos Registrados</h2></th>
                </tr>
                <tr>
                  <th>Nombre</th>
                  <th>Rut</th>
                  <th>Correo</th>
                  <th>Usuario</th>
                  <th>-</th>
                </tr>
              </thead>
              <tbody>
              {filteredAlumno.map((alumno) => (
                <tr key={alumno.ID_Usuario}>
                  <td>{alumno.Nombre}</td>
                  <td>{alumno.Rut}</td>
                  <td>{alumno.Email}</td>
                  <td>{alumno.Username}</td>
                  <td><IoIosAlbums/></td>
                </tr>
              ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default FileUpload;

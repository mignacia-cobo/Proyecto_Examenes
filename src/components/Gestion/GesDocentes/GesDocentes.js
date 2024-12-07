import React, { useState, useEffect } from 'react';
import './GesDocentes.css';
import { IoIosAlbums } from "react-icons/io";
import { fetchDocentes,uploadFileDocentes, confirmUploadDocentes }  from '../../../services/api';

const FileUpload = () => {
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  //OBTENER DOCENTES
  useEffect(() => {
    const loadDocentes = async () => {
    try {
        const data = await fetchDocentes();
        setDocentes(data);
        setLoading(false);
    } catch (error) {
        console.error("Error al cargar los docentes:", error);
        setLoading(false);
    }
    };

    loadDocentes();
  }, []);

  if (loading) {
      return <p>Cargando Docentes...</p>;
  }

  //CARGA MASIVA DE DOCENTES
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
      const data = await uploadFileDocentes(file);
      setPreviewData(data); // Mostrar datos previsualizados
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
    }
  };
  //CONFIRMA LA CARGA
  const handleConfirm = async () => {
    try {
      await confirmUploadDocentes(previewData);
      alert('Datos cargados exitosamente.');
      setPreviewData([]); // Limpia la previsualización
      await reloadDocentes(); // Recarga los datos de la tabla principal
    } catch (error) {
      console.error('Error al confirmar la carga:', error);
    }
  };

  // FUNCIÓN PARA RECARGAR DOCENTES
  const reloadDocentes = async () => {
    try {
      setLoading(true); // Muestra "Cargando" mientras actualiza
      const data = await fetchDocentes();
      setDocentes(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al recargar los docentes:', error);
      setLoading(false);
    }
  };

  //BUSCAR DOCENTE
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
    
  //FILTRAR DOCENTE
  const filteredDocente = docentes?.filter(docente =>
  docente.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
  docente.Rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
  docente.Email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <p className='titulo'>Gestión Docentes</p>
      <div className='container-lateral'>
        <div className='search-section'>
          <h2>Buscar Docente</h2>
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
          {filteredDocente.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th colSpan={5}><h2>Docentes Registrados</h2></th>
                </tr>
                <tr>
                  <th>Nombre</th>
                  <th>Rut</th>
                  <th>Correo</th>
                  <th>Usuario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
              {filteredDocente.map((docente) => (
                <tr key={docente.ID_Usuario}>
                  <td>{docente.Nombre}</td>
                  <td>{docente.Rut}</td>
                  <td>{docente.Email}</td>
                  <td>{docente.Username}</td>
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

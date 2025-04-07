import React, { useState } from 'react';
import { FiEye } from "react-icons/fi";
import './GesInicial.css';
import { uploadFile, confirmUpload }  from '../../../services/api';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor selecciona un archivo primero.');
      return;
    }

    try {
      const data = await uploadFile(file);
      console.log('Datos cargados:', data);
      setPreviewData(data); // Mostrar datos previsualizados
      console.log('Datos previsualizados:', data);
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
    }
  };

  const handleConfirm = async () => {
    console.log('Datos a confirmar:', previewData);
    try {
      await confirmUpload(previewData);
      console.log('Datos confirmados:', previewData);
      alert('Datos cargados exitosamente.');
    } catch (error) {
      console.error('Error al confirmar la carga:', error);
    }
  };

  return (
    <>
        <p className='titulo'>Carga Inicial de Datos</p>
        <div className='container-lateral'>
            <div className='search-section'>
                <h2>Subir Archivo</h2>
                <div className='search-box'>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleUpload}>Subir Archivo</button>
                </div>
            </div>
        </div>
        <div className='details-section'>
            {previewData.length > 0 && (
                <div className='details-section-table'>
                    <div className='details-section-content'style={{overflowY:'auto'}}>
                        <table style={{overflowY:'auto'}}>
                            <thead>
                            <tr>
                              <th colSpan={13}><h2>Carga Masiva Inicial</h2></th>
                            </tr>
                            <tr>	
                                <th>Escuela</th>
                                <th>Carrera</th>
                                <th>Jornada</th>
                                <th>Nivel</th>
                                <th>Sección</th>
                                <th>Asignatura</th>
                                <th>Procesamiento</th>
                                <th>Plataforma</th>
                                <th>Inscritos</th>
                                <th>Módulos</th>
                                <th>Docente</th>
                                <th>S. Evaluativa</th>
                                <th>Ver</th>
                                {/* Otras columnas */}
                            </tr>
                            </thead>
                            <tbody>
                            {previewData.map((row, index) => (
                                <tr key={index}>
                                <td>{row.escuela}</td>
                                <td>{row.carrera}</td>
                                <td>{row.jornada}</td>
                                <td>{row.nivel}</td>
                                <td>{row.seccion}</td>
                                <td>{row.asignatura}</td>
                                <td>{row.tipoProcesamiento}</td>
                                <td>{row.plataformaProcesamiento}</td>
                                <td>{row.inscritos}</td>
                                <td>{row.tiempoAsignado}</td>
                                <td>{row.docente}</td>
                                <td>{row.situacionEvaluativa}</td>
                                <td><FiEye /></td>
                                {/* Otros datos */}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='details-section-content'>
                    <button onClick={handleConfirm}>Confirmar Carga</button>
                    </div>
                </div>
            )}
        </div>
    </>
  );
};

export default FileUpload;

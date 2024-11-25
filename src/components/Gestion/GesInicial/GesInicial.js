import React, { useState } from 'react';
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
      setPreviewData(data); // Mostrar datos previsualizados
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
    }
  };

  const handleConfirm = async () => {
    try {
      await confirmUpload(previewData);
      alert('Datos cargados exitosamente.');
    } catch (error) {
      console.error('Error al confirmar la carga:', error);
    }
  };

  return (
    <>
        <p className='titulo'>Cargar Archivo Excel</p>
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
                    <div className='details-section-content'>
                        <h3>Previsualización de Datos</h3>
                    </div>
                    <div className='details-section-content'style={{overflowY:'auto'}}>
                        <table style={{overflowY:'auto'}}>
                            <thead>
                            <tr>
                                <th>Escuela</th>
                                <th>Jornada</th>
                                <th>Asignatura</th>
                                {/* Otras columnas */}
                            </tr>
                            </thead>
                            <tbody>
                            {previewData.map((row, index) => (
                                <tr key={index}>
                                <td>{row.escuela}</td>
                                <td>{row.jornada}</td>
                                <td>{row.asignatura}</td>
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

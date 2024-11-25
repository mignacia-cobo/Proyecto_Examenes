import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import './GesModulos.css';
import { fetchModulos, eliminarModuloAPI, guardarModuloAPI } from '../../../services/api';


function GesModulos () {
    const [modulos, setModulos] = useState([]);
    const [modulosConfirmados, setModulosConfirmados] = useState([]);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [newModulo, setNewModulo] = useState({
        Numero: '',
        Hora_inicio: '00:00',
        Hora_final: '00:00',
        ID_Estado: 1,
    });
  

    //OBTENER MODULOS
    useEffect(() => {
        const getModulos = async () => {
            try {
                const result = await fetchModulos();
                setModulos(result);
                console.log('Modulos:', result);
            } catch (error) {
                console.error('Error al obtener los módulos:', error);
            }
        };
        getModulos();
    }, []);

    //ELIMINAR MODULOS 
    const eliminarModulo = async (id) => {
        try{
            const response = await eliminarModuloAPI(id);
            console.log('Módulo eliminado ID_Modulo:', id, response);
            setModulos(prevModulos => prevModulos.filter(modulo => modulo.ID_Modulo !== id));
            console.log('Modulos:', modulos);
            alert('Módulo eliminado');
        } catch (error) {
            console.error('Error al eliminar los módulos de la base de datos:', error);
        }
    };

    //EDITAR MODULO
    const editarModulo = (id) => {
        navigate(`/EditarModulo/${id}`);
    };
    
    //AGREGAR MODULO
    const guardarModulo = async () => {
        try {
            const response = await guardarModuloAPI(newModulo);
            console.log('Módulo guardado:', response);
            setModulos([...modulos, newModulo]);
            setNewModulo({
                Numero: '',
                Hora_inicio: '00:00',
                Hora_final: '00:00',
                ID_Estado: 1,
            });
            alert('Módulo agregado con éxito.');
        } catch (error) {
            console.error('Error al agregar el módulo:', error);
        }
    };
    // MANEJAR CARGA DE ARCHIVOS
    // Manejar la carga del archivo Excel y previsualizar los módulos
    const handleFileUploadModulos = (e) => {
        const file = e.target.files[0];
        if (!file) {
        alert("Por favor, selecciona un archivo válido.");
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
    
        // Validar que el archivo tenga el formato correcto
        const requiredColumns = ['Numero', 'Hora_Inicio', 'Hora_Final'];
        const missingColumns = requiredColumns.filter(col => !jsonData[0].hasOwnProperty(col));
    
        if (missingColumns.length > 0) {
            alert(`El archivo no tiene el formato correcto. Faltan las columnas: ${missingColumns.join(', ')}`);
            return;
        }
    
        // Convierte un valor decimal de hora a formato HH:mm:ss
        const convertirHoraExcel = (horaDecimal) => {
            const totalSegundos = Math.round(horaDecimal * 24 * 3600); // Total de segundos en el día
            const horas = Math.floor(totalSegundos / 3600); // Horas completas
            const minutos = Math.floor((totalSegundos % 3600) / 60); // Minutos restantes
        
            // Formatear a HH:mm:ss
            return [
            String(horas).padStart(2, '0'),
            String(minutos).padStart(2, '0'),
            ].join(':');
        };
  
        const modulosCargados = jsonData.map((row, index) => {
            return {
              Numero: row['Numero'],
              Hora_inicio: convertirHoraExcel(row['Hora_Inicio']), // Conversión
              Hora_final: convertirHoraExcel(row['Hora_Final']), // Conversión
              ID_Estado: 1 // Valor predeterminado
            };
        });
            console.log('Módulos cargados:', modulosCargados);
        setModulosConfirmados(modulosCargados);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleConfirmarModulos = async () => {
        try {
            // Recorrer los módulos confirmados y guardar uno por uno
            const resultados = [];
            for (const modulo of modulosConfirmados) {
                console.log('Enviando módulo al backend:', modulo);
                const response = await guardarModulo(modulo); // Llama a la función que guarda un módulo
                console.log('Respuesta del backend:', response);
                resultados.push(response);
            }
    
            // Actualizar el estado con los módulos guardados
            setModulos(resultados);
    
            // Mostrar una alerta al final, una vez que todos los módulos han sido procesados
            alert('Todos los módulos han sido confirmados con éxito.');
        } catch (error) {
            console.error('Error al guardar los módulos en la base de datos:', error);
            alert('Ocurrió un error al guardar los módulos. Por favor, intenta nuevamente.');
        }
    };
    
    //BUSQUEDA DE MODULOS
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    //FILTRAR MODULOS
    const filteredModulos = modulos.filter((modulo) =>
        modulo.Numero.toString().includes(searchTerm) ||
        modulo.Hora_inicio.toString().includes(searchTerm) ||
        modulo.Hora_final.toString().includes(searchTerm)
    );

  
    return (
        <>
            <p className="titulo">Gestión de Módulos</p>
            <div className='container-lateral'>
                <div className="search-section">
                <h2>Registrar Módulo</h2>
                <div className="search-box">
                    <input
                    type='number'
                    placeholder='Número de Módulo'
                    value={newModulo.Numero}
                    onChange={(e) => setNewModulo({ ...newModulo, Numero: e.target.value })}
                    />
                    <input
                    type='time'
                    placeholder='Hora Inicio'
                    value={newModulo.Hora_inicio}
                    onChange={(e) => setNewModulo({ ...newModulo, Hora_inicio: e.target.value })}
                    />
                    <input
                    type='time'
                    placeholder='Hora Final'
                    value={newModulo.Hora_final}
                    onChange={(e) => setNewModulo({ ...newModulo, Hora_final: e.target.value })}
                    />
                    <br></br>
                    <button onClick={guardarModulo}>Agregar Módulo</button>
                </div>
                <h2>Buscar Módulos</h2>
                <div className="search-box">
                    <input
                    type='search'
                    placeholder='Buscar...'
                    value={searchTerm}
                    onChange={handleSearch}
                    />
                </div>
                <h2>Carga Masiva de Módulos</h2>
                <div className='search-box'>
                    <input
                    className="file-input"
                    type="file"
                    onChange={handleFileUploadModulos}
                    accept=".xls, .xlsx"
                    id="file-upload"
                    style={{ display: 'none' }}
                    />
                    <button>
                        <label htmlFor="file-upload" className="custom-file-upload">Examinar</label>
                    </button>
                    {modulosConfirmados.length > 0 && (
                        <>
                            <div className="search-box-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Numero</th>
                                            <th>Inicio</th>
                                            <th>Fin</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modulosConfirmados.map((modulo) => (
                                            <tr key={modulo.ID_Modulo}>
                                            <td>{modulo.Numero}</td>
                                            <td>{modulo.Hora_inicio}</td>
                                            <td>{modulo.Hora_final}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button onClick={handleConfirmarModulos}>Cargar Módulos</button>
                        </>
                    )}
                </div>
                </div>
            </div>
            <div className="details-section">
                <div className="details-section-table">
                    {filteredModulos.length > 0 && (
                        <table>
                            <thead>
                                <tr>
                                    <th colSpan={5}><h2>Módulos Registrados</h2></th>
                                </tr>
                                <tr>
                                    <th>Numero</th>
                                    <th>Hora Inicio</th>
                                    <th>Hora Final</th>
                                    <th>Estado</th>
                                    <th>Editar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredModulos.map(modulo => (
                                    <tr key={modulo.ID_Modulo}>
                                        <td>{modulo.Numero}</td>
                                        <td>{modulo.Hora_inicio}</td>
                                        <td>{modulo.Hora_final}</td>
                                        <td>{modulo.Estado?.Nombre}</td>
                                        <td>
                                            <FaEdit onClick={() => editarModulo(modulo.ID_Modulo)} style={{ cursor: 'pointer' }} />
                                            <FaTrash onClick={() => eliminarModulo(modulo.ID_Modulo)} style={{ cursor: 'pointer' }} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    )};

export default GesModulos;

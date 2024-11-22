import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
//import * as XLSX from 'xlsx';
import './GesModulos.css';
import { fetchModulos, eliminarModuloAPI, guardarModuloAPI } from '../../../services/api';


function GesModulos () {
    const [modulos, setModulos] = useState([]);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [newModulo, setNewModulo] = useState({
        numero: '',
        hora_inicio: '00:00',
        hora_final: '00:00',
        estado: true,
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
            setModulos(prevModulos => prevModulos.filter(modulo => modulo.id !== id));
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
                numero: '',
                hora_inicio: '00:00',
                hora_final: '00:00',
            });
            alert('Módulo agregado con éxito.');
        } catch (error) {
            console.error('Error al agregar el módulo:', error);
        }
    };
    // MANEJAR CARGA DE ARCHIVOS
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        // Aquí puedes agregar la lógica para procesar el archivo
        console.log('Archivo cargado:', file);
    };
    
    //BUSQUEDA DE MODULOS
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    //FILTRAR MODULOS
    const filteredModulos = modulos.filter(modulo =>
        modulo.numero.toString().includes(searchTerm) ||
        modulo.hora_inicio.toString().includes(searchTerm) ||
        modulo.hora_final.toString().includes(searchTerm)
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
                    value={newModulo.numero}
                    onChange={(e) => setNewModulo({ ...newModulo, numero: e.target.value })}
                    />
                    <input
                    type='time'
                    placeholder='Hora Inicio'
                    value={newModulo.hora_inicio}
                    onChange={(e) => setNewModulo({ ...newModulo, hora_inicio: e.target.value })}
                    />
                    <input
                    type='time'
                    placeholder='Hora Final'
                    value={newModulo.hora_final}
                    onChange={(e) => setNewModulo({ ...newModulo, hora_final: e.target.value })}
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
                    onChange={handleFileUpload}
                    accept=".xls, .xlsx"
                    id="file-upload"
                    style={{ display: 'none' }}
                    />
                    <button>
                        <label htmlFor="file-upload" className="custom-file-upload">Examinar</label>
                    </button>
                    {modulos.length > 0 && (
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
                                        {modulos.map((modulo) => (
                                            <tr key={modulo.id}>
                                            <td>{modulo.numero}</td>
                                            <td>{modulo.hora_inicio}</td>
                                            <td>{modulo.hora_final}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button onClick={handleFileUpload}>Cargar Módulos</button>
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
                                    <tr key={modulo.id}>
                                        <td>{modulo.numero}</td>
                                        <td>{modulo.hora_inicio}</td>
                                        <td>{modulo.hora_final}</td>
                                        <td>{(modulo.estado).toString()}</td>
                                        <td>
                                            <FaEdit onClick={() => editarModulo(modulo.id)} style={{ cursor: 'pointer' }} />
                                            <FaTrash onClick={() => eliminarModulo(modulo.id)} style={{ cursor: 'pointer' }} />
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

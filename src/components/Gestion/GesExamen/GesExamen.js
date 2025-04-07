import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchExamenes }  from '../../../services/api';
import { IoIosAlbums } from "react-icons/io";

const GesExamen = () => {
    const [examenes, setExamenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadExamenes = async () => {
        try {
            const data = await fetchExamenes();
            setExamenes(data);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar los exámenes:", error);
            setLoading(false);
        }
        };
        loadExamenes();
    }, []);
    
    if (loading) {
        return <p>Cargando exámenes...</p>;
    }
    
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
      
    //FILTRAR EXAMEN
    const filteredExamene = examenes?.filter(examen =>
    examen.Nombre_Examen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    examen.Seccion?.Nombre_Seccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    examen.Estado.Nombre.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    
    return (
        <>
            <p className='titulo'>Gestión de Exámenes</p>
            <div className='container-lateral'>
                <div className="search-section">
                    <h2>Buscar Examen</h2>
                    <div className="search-box">
                        <input
                        type='search'
                        placeholder='Buscar...'
                        value={searchTerm}
                        onChange={handleSearch}
                        />
                    </div>
                </div>
            </div>
            <div className='details-section'>
                <div className='details-section-table'>
                    {filteredExamene.length > 0 && (
                    <table>
                        <thead>
                        <tr>
                            <th colSpan={7}><h2>Exámenes Registrados</h2></th>
                        </tr>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Sección</th>
                            <th>Módulos</th>
                            <th>Inscritos</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredExamene.map((examen) => (
                            <tr key={examen.ID_Examen}>
                            <td>{examen.ID_Examen}</td>
                            <td>{examen.Nombre_Examen}</td>
                            <td>{examen.Seccion?.Nombre_Seccion}</td>
                            <td>{examen.Cantidad_Modulos}</td>
                            <td>{examen.Inscritos}</td>
                            <td>{examen.Estado?.Nombre === 'Examen_Reservado'? 'Reservado':'Pendiente'}</td>
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

export default GesExamen;
import { useHistory } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

function GesSalas() {
  const history = useHistory();

  const handleEdit = (id) => {
    history.push(`/editar-sala/${id}`);
  };

  return (
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
        {salas.map((sala, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
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
  );
}


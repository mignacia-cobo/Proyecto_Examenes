const Sala = require('./Sala');

// Paso 1: Crear una instancia de Sala
async function testUpdateSala() {
  try {
    const nuevaSala = await Sala.create({
      ID_Sala: 'S001',
      Nombre: 'Sala de Conferencias',
      Capacidad: 50,
      Edificio_ID: 1
    });

    console.log('Sala creada:', nuevaSala.toJSON());

    // Paso 2: Actualizar la instancia
    nuevaSala.Nombre = 'Sala de Reuniones';
    nuevaSala.Capacidad = 100;

    // Paso 3: Guardar los cambios
    await nuevaSala.save();

    console.log('Sala actualizada:', nuevaSala.toJSON());

    // Paso 4: Verificar la actualización
    const salaActualizada = await Sala.findByPk('S001');
    console.log('Verificación de Sala actualizada:', salaActualizada.toJSON());
  } catch (error) {
    console.error('Error al actualizar la Sala:', error);
  }
}

testUpdateSala();
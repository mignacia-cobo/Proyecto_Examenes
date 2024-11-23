const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

// Definición de modelos

const Sede = sequelize.define('Sede', {
  ID_Sede: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre_Sede: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Sede',
  freezeTableName: true,
  timestamps: false
});


const Edificio = sequelize.define('Edificio', {
  ID_Edificio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre_Edificio: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ID_Sede: {
    type: DataTypes.INTEGER,
    references: {
      model: Sede,
      key: 'ID_Sede'
    }
  }
}, {
  tableName: 'Edificio',
  freezeTableName: true,
  timestamps: false
});

const Escuela = sequelize.define('Escuela', {
  ID_Escuela: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  Nombre: {
      type: DataTypes.STRING,
  },
  ID_Sede: {
      type: DataTypes.INTEGER,
      references: {
          model: 'Sede',
          key: 'ID_Sede'
      }
  },
  ID_Estado: {
      type: DataTypes.INTEGER,
      references: {
          model: 'Estado',
          key: 'ID_Estado'
      }
  }
}, {
  tableName: 'Escuela',
  freezeTableName: true,
  timestamps: true // columnas de timestamps
});


const Usuario = sequelize.define('Usuario', {
  ID_User: {
      type: DataTypes.INTEGER,
      primaryKey: true
  },
  Username: {
      type: DataTypes.STRING,
      unique: true
  },
  Password: {
      type: DataTypes.STRING
  },
  Nombre: {
      type: DataTypes.STRING
  },
  Rut: {
      type: DataTypes.STRING
  },
  Email: {
      type: DataTypes.STRING
  },
  ID_Escuela: {
      type: DataTypes.INTEGER,
  },
  ID_Rol: {
      type: DataTypes.INTEGER,
  },
  ID_Estado: {
      type: DataTypes.INTEGER,
      references: {
          model: 'Estado',
          key: 'ID_Estado'
      }
  }
}, {
  tableName: 'Usuario',
  freezeTableName: true,
  timestamps: true // columnas de timestamps
});

const Modulo = sequelize.define('Modulo', {
  ID_Modulo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Numero: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  Hora_final: {
    type: DataTypes.TIME,
    allowNull: false
  },
  ID_Estado: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Estado',
      key: 'ID_Estado'  
    }
  }
}, {
  tableName: 'Modulo',
  freezeTableName: true,
  timestamps: false // Si no tienes columnas de timestamps en tu tabla
});

const Carrera = sequelize.define('Carrera', {
  ID_Carrera: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  Nombre: {
      type: DataTypes.STRING,
      allowNull: false
  },
  ID_Escuela: {
      type: DataTypes.INTEGER,
      references: {
          model: 'Escuela',
          key: 'ID_Escuela'
      }
  },
  ID_Estado: {
      type: DataTypes.INTEGER,
      references: {
          model: 'Estado',
          key: 'ID_Estado'
      }
  }
}, {
  tableName: 'Carrera',
  freezeTableName: true,
  timestamps: true // columnas de timestamps
});


const Estado = sequelize.define('Estado', {
  ID_Estado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Estado',
  timestamps: true,// columnas de timestamps
  freezeTableName: true 
});


const Sala = sequelize.define('Sala', {
  ID_Sala: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Codigo_sala: {
    type: DataTypes.STRING
  },
  Nombre_sala: {
    type: DataTypes.STRING
  },
  Capacidad: {
    type: DataTypes.INTEGER
  },
  ID_Edificio: {
    type: DataTypes.INTEGER,
    references: {
      model: Edificio,
      key: 'ID_Edificio'
    }
  },
  ID_Estado:{
    type: DataTypes.INTEGER,
    references: {
      model: 'Estado',
      key: 'ID_Estado'
    }
  }
}, {
  tableName: 'Sala',
  timestamps: true, // columnas de timestamps
  freezeTableName: true
});

const Rol = sequelize.define('Rol', {
  ID_Rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ID_Estado:{
    type: DataTypes.INTEGER,
    references: {
      model: 'Estado',
      key: 'ID_Estado'  
    }
}
}, {
  tableName: 'Rol',
  timestamps: false,
  freezeTableName: true
});

// Definición de relaciones

// Sede y Escuela
Sede.hasMany(Escuela, { foreignKey: 'ID_Sede' });
Escuela.belongsTo(Sede, { foreignKey: 'ID_Sede' });

// Sede y Edificio
Sede.hasMany(Edificio, { foreignKey: 'ID_Sede' });
Edificio.belongsTo(Sede, { foreignKey: 'ID_Sede' });

// Escuela y Carrera
Escuela.hasMany(Carrera, { foreignKey: 'ID_Escuela' });
Carrera.belongsTo(Escuela, { foreignKey: 'ID_Escuela' });

// Escuela y Usuario
Escuela.hasMany(Usuario, { foreignKey: 'ID_Escuela' });
Usuario.belongsTo(Escuela, { foreignKey: 'ID_Escuela' });

// Edificio y Sala
Edificio.hasMany(Sala, { foreignKey: 'ID_Edificio' });
Sala.belongsTo(Edificio, { foreignKey: 'ID_Edificio' });

// Estado y Usuario
Estado.hasMany(Usuario, { foreignKey: 'ID_Estado' });
Usuario.belongsTo(Estado, { foreignKey: 'ID_Estado' });

// Estado y Escuela
Estado.hasMany(Escuela, { foreignKey: 'ID_Estado' });
Escuela.belongsTo(Estado, { foreignKey: 'ID_Estado' });

// Estado y Modulo
Estado.hasMany(Modulo, { foreignKey: 'ID_Estado' });
Modulo.belongsTo(Estado, { foreignKey: 'ID_Estado' });

// Estado y Carrera
Estado.hasMany(Carrera, { foreignKey: 'ID_Estado' });
Carrera.belongsTo(Estado, { foreignKey: 'ID_Estado' });

// Estado y Sala
Estado.hasMany(Sala, { foreignKey: 'ID_Estado' });
Sala.belongsTo(Estado, { foreignKey: 'ID_Estado' });

// Estado y Rol
Estado.hasMany(Rol, { foreignKey: 'ID_Estado' });
Rol.belongsTo(Estado, { foreignKey: 'ID_Estado' });

// Rol y Usuario
Rol.hasMany(Usuario, { foreignKey: 'ID_Rol' });
Usuario.belongsTo(Rol, { foreignKey: 'ID_Rol' });

module.exports = {
  Sede,
  Edificio,
  Escuela,
  Usuario,
  Modulo,
  Carrera,
  Estado,
  Sala,
  Rol,
  sequelize
};
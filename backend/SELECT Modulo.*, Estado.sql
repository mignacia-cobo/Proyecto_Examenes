SELECT Modulo.*, Estado.Nombre
FROM Modulo
LEFT JOIN Estado ON Modulo.ID_Estado = Estado.ID_Estado;}

SELECT * FROM Examen;

Si no se están mostrando los exámenes registrados, vamos a depurar el flujo completo, desde el backend hasta el frontend, para identificar dónde está el problema.
1. Verificar si los exámenes existen en la base de datos

Ejecuta el siguiente script para confirmar si hay registros en la tabla Examen:

SELECT * FROM Examen;

    Si no hay registros, asegúrate de tener datos en la tabla Examen. Inserta algunos datos de prueba si es necesario:

INSERT INTO Examen (Nombre_Examen, ID_Asignatura, ID_Estado) 
VALUES ('Examen Matemáticas', 1, 1), ('Examen Física', 1, 1);
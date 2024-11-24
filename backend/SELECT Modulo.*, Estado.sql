SELECT Modulo.*, Estado.Nombre
FROM Modulo
LEFT JOIN Estado ON Modulo.ID_Estado = Estado.ID_Estado;
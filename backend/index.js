const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');  // Importa cors
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());  // Permite todas las solicitudes de origen cruzado
/*app.use(cors({
    origin: 'http://localhost:3000', // Reemplaza con la URL de tu frontend
    methods: ['GET', 'POST'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
}));*/


// Middleware para parsear JSON
app.use(express.json());

// Configuración de SendGrid
const sendGridApiKey = process.env.SENDGRID_API_KEY;
if (!sendGridApiKey) {
    console.error('Falta la API Key de SendGrid en las variables de entorno');
    process.exit(1); // Termina el proceso si no se proporciona la clave API
}

sgMail.setApiKey(sendGridApiKey);
console.log('SendGrid API Key configurada correctamente.');

// Middleware para eliminar la cabecera 'Authorization' si está presente
app.use((req, res, next) => {
    console.log('Headers:', req.headers); // Imprime todas las cabeceras recibidas
    if (req.headers['authorization']) {
        console.log('Authorization header detected:', req.headers['authorization']);
        req.headers['authorization'] = 'Removed';
        console.log('Authorization header modified:', req.headers['authorization']);
    }
    next();
});

// Ruta para enviar correos
app.post('/send-email', (req, res) => {
    console.log('Headers:', req.headers); // Imprime todas las cabeceras recibidas
    console.log('Body:', req.body); // Imprime el cuerpo de la solicitud

    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
        return res.status(400).json({ message: 'Faltan parámetros en la solicitud' });
    }

    const msg = {
        to: to,
        from: 'ma.cobo@profesor.duoc.cl', // Asegúrate de que este correo esté verificado en SendGrid
        subject: subject,
        text: text,
    };

    sgMail
        .send(msg)
        .then(() => res.status(200).json({ message: 'Correo enviado con éxito' }))
        .catch((error) => {
            console.error('Error al enviar el correo:', error);
            res.status(500).json({
                message: 'Error al enviar el correo',
                error: error.toString(),
            });
        });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

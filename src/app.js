import express from 'express';
import nivelesRoutes from './rutas/nivelesUsuarios.routes.js'
import morgan from 'morgan'

const app = express()

app.use(express.json());
app.use(morgan("dev"));
app.use(nivelesRoutes);


export default app
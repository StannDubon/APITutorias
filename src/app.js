import express from 'express';
import nivelesRoutes from './rutas/nivelesUsuarios.routes.js'
import tiposTutoriaRoutes from './rutas/tipoTutoria.routes.js'
import usuariosRoutes from './rutas/usuarios.routes.js'
import tiposCarreraRoutes from './rutas/tiposCarrera.routes.js'
import horariosRoutes from './rutas/horarios.routes.js'
import diaSemanaRoutes from './rutas/dia_semana.routes.js'  
import morgan from 'morgan'

const app = express()

app.use(express.json());
app.use(morgan("dev"));
app.use(nivelesRoutes);
app.use(tiposTutoriaRoutes);
app.use(usuariosRoutes);
app.use(tiposCarreraRoutes);
app.use(horariosRoutes);
app.use(diaSemanaRoutes);


export default app
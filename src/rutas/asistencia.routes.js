import {Router } from "express";
import {getAsistencia,getAsistenciaById,updateAsistencia,crearAsistencia,deleteAsistencia, getAsistenciasByTutoria} from "../controladores/asistencia.js"
import { asistenciaTutoria } from "../middlewares/scheme/tutoriasScheme.js";
import { validate } from "../middlewares/validacion.js";
import {verificarToken, verificarNivel} from "../middlewares/authMiddleware.js"
const router = Router()

router.get("/GETasistencia", verificarToken, verificarNivel(['admin', 'profesor']), getAsistencia)
router.get("/GETasistencia/:id", verificarToken, verificarNivel(['admin', 'profesor']), getAsistenciaById)
router.put("/PUTasistencia/:id", verificarToken, verificarNivel(['admin', 'profesor']), validate(asistenciaTutoria),updateAsistencia)
router.post("/POSTasistencia", verificarToken, verificarNivel(['admin', 'profesor']),crearAsistencia)
router.delete("/DELETEasistencia/:id", verificarToken, verificarNivel(['admin', 'profesor']), deleteAsistencia)

router.get("/getAsistenciasByTutoria/:id", verificarToken, verificarNivel(['admin', 'profesor']), getAsistenciasByTutoria)

export default router

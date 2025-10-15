import {getTutoria,getTutoriaId,updateTutoria,insertTutoria,deleteTutoria} from "../controladores/tutorias.js"
import { Router } from "express";
import { crearTutoria, actualizarTutoria } from "../middlewares/scheme/tutoriasScheme.js";
import {validate} from "../middlewares/validacion.js"
import {verificarToken, verificarNivel} from "../middlewares/authMiddleware.js"

const router = Router()

router.get("/GETtutorias", verificarToken, verificarNivel(['admin', 'profesor', 'alumno']), getTutoria)
router.get("/GETtutorias/:id", verificarToken, verificarNivel(['admin', 'profesor', 'alumno']), getTutoriaId)
router.put("/PUTtutorias/:id", verificarToken, verificarNivel(['admin', 'profesor']), validate(actualizarTutoria),updateTutoria)
router.post("/POSTtutorias", verificarToken, verificarNivel(['admin', 'profesor']), validate(crearTutoria),insertTutoria)
router.delete("/DELETEtutorias/:id", verificarToken, verificarNivel(['admin', 'profesor']), deleteTutoria)

export default router

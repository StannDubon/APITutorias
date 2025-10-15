import {getTutoria,getTutoriaId,updateTutoria,insertTutoria,deleteTutoria} from "../controladores/tutorias.js"
import { Router } from "express";
import { crearTutoria, actualizarTutoria } from "../middlewares/scheme/tutoriasScheme.js";
import {validate} from "../middlewares/validacion.js"

const router = Router()

router.get("/GETtutorias", getTutoria)
router.get("/GETtutorias/:id", getTutoriaId)
router.put("/PUTtutorias/:id", validate(actualizarTutoria),updateTutoria)
router.post("/POSTtutorias", validate(crearTutoria),insertTutoria)
router.delete("/DELETEtutorias/:id", deleteTutoria)

export default router

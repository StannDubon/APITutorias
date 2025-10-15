import { Router } from "express";
import {getTiposTutoria, getTipoTutoriabyId , addTipoTutoria, updateTipoTutoria, deleteTipoTutoria} from "../controladores/tiposTutoria.js"
import {validate} from "../middlewares/validacion.js"
import {crearTipoTutoria} from "../middlewares/scheme/tutoriasScheme.js"    
import {verificarToken, verificarNivel} from "../middlewares/authMiddleware.js"
const router = Router()

router.get("/tiposTutoria", verificarToken, verificarNivel(['admin']), getTiposTutoria)

router.get("/tipoTutoria/:id", verificarToken, verificarNivel(['admin']), getTipoTutoriabyId)

router.post("/newTipoTutoria", verificarToken, verificarNivel(['admin']), validate(crearTipoTutoria), addTipoTutoria)

router.put("/actuTipoTutoria/:id", verificarToken, verificarNivel(['admin']), validate(crearTipoTutoria), updateTipoTutoria)

router.delete("/deleteTipoTutoria/:id", verificarToken, verificarNivel(['admin']), deleteTipoTutoria)

export default router;

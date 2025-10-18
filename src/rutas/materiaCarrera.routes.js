import {Router} from "express";
import {getMateriaCarrera, getMateriaCarreraById, updateMateriaCarrera, procedimientoAgregarMateriaCarrera, procedimientoEliminarMateriaDeCarrera, getVistaMateriaCarrera} from "../controladores/materias_carrera.js"
import { validate } from "../middlewares/validacion.js";
import { MateriaCarrera } from "../middlewares/scheme/materiasScheme.js";
import {verificarToken, verificarNivel} from "../middlewares/authMiddleware.js"
const router = Router()

router.get("/getMateriaCarrera", verificarToken, verificarNivel(['admin', 'profesor']), getMateriaCarrera)
router.get("/getMateriaCarreraById/:id", verificarToken, verificarNivel(['admin', 'profesor']), getMateriaCarreraById)
router.get("/getVistaMateriaCarrera", verificarToken, verificarNivel(['admin', 'profesor']), getVistaMateriaCarrera)
router.put("/updateMateriaCarrera/:id", verificarToken, verificarNivel(['admin']), validate(MateriaCarrera), updateMateriaCarrera)

router.post("/procedimientoAgregarMateriaCarrera", verificarToken, verificarNivel(['admin']), procedimientoAgregarMateriaCarrera)
router.post("/procedimientoEliminarMateriaDeCarrera", verificarToken, verificarNivel(['admin']) ,procedimientoEliminarMateriaDeCarrera)

export default router
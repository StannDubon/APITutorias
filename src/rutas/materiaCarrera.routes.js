import {Router} from "express";
import {getMateriaCarrera, getMateriaCarreraById, addMateriaCarrera, updateMateriaCarrera, deleteMateriaCarrera} from "../controladores/materias_carrera.js"
import { validate } from "../middlewares/validacion.js";
import { MateriaCarrera } from "../middlewares/scheme/materiasScheme.js";
import {verificarToken, verificarNivel} from "../middlewares/authMiddleware.js"
const router = Router()

router.get("/getMateriaCarrera", verificarToken, verificarNivel(['admin', 'profesor']), getMateriaCarrera)
router.get("/getMateriaCarreraById/:id", verificarToken, verificarNivel(['admin', 'profesor']), getMateriaCarreraById)
router.post("/addMateriaCarrera", verificarToken, verificarNivel(['admin']), validate(MateriaCarrera), addMateriaCarrera)
router.put("/updateMateriaCarrera/:id", verificarToken, verificarNivel(['admin']), validate(MateriaCarrera), updateMateriaCarrera)
router.delete("/deleteMateriaCarrera/:id", verificarToken, verificarNivel(['admin']), deleteMateriaCarrera)

export default router
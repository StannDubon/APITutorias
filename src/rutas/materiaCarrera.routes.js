import {Router} from "express";
import {getMateriaCarrera, getMateriaCarreraById, addMateriaCarrera, updateMateriaCarrera, deleteMateriaCarrera} from "../controladores/materias_carrera.js"
import { validate } from "../middlewares/validacion.js";
import { MateriaCarrera } from "../middlewares/scheme/materiasScheme.js";
const router = Router()

router.get("/getMateriaCarrera", getMateriaCarrera)
router.get("/getMateriaCarreraById/:id", getMateriaCarreraById)
router.post("/addMateriaCarrera", validate(MateriaCarrera), addMateriaCarrera)
router.put("/updateMateriaCarrera/:id", updateMateriaCarrera)
router.delete("/deleteMateriaCarrera/:id", deleteMateriaCarrera)

export default router
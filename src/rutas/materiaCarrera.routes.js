import {Router} from "express";
import {getMateriaCarrera, getMateriaCarreraById, addMateriaCarrera, updateMateriaCarrera, deleteMateriaCarrera} from "../controladores/materias_carrera.js"

const router = Router()

router.get("/getMateriaCarrera", getMateriaCarrera)
router.get("/getMateriaCarreraById/:id", getMateriaCarreraById)
router.post("/addMateriaCarrera", addMateriaCarrera)
router.put("/updateMateriaCarrera/:id", updateMateriaCarrera)
router.delete("/deleteMateriaCarrera/:id", deleteMateriaCarrera)

export default router
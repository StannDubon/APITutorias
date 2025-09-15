import {Router} from "express";
import {getMaterias, getMateriaById, addMateria, updateMateria, deleteMateria} from "../controladores/materias.js"

const router = Router()

router.get("/getMaterias", getMaterias)
router.get("/getMateriaById/:id", getMateriaById)
router.post("/addMateria", addMateria)
router.put("/updateMateria/:id", updateMateria)
router.delete("/deleteMateria/:id", deleteMateria)

export default router

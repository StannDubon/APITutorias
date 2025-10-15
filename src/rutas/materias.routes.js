import {Router} from "express";
import {getMaterias, getMateriaById, addMateria, updateMateria, deleteMateria} from "../controladores/materias.js"
import {Materia} from "../middlewares/scheme/materiasScheme.js"
import {validate} from "../middlewares/validacion.js"
const router = Router()

router.get("/getMaterias", getMaterias)
router.get("/getMateriaById/:id", getMateriaById)
router.post("/addMateria", validate(Materia), addMateria)
router.put("/updateMateria/:id", validate(Materia), updateMateria)
router.delete("/deleteMateria/:id", deleteMateria)

export default router

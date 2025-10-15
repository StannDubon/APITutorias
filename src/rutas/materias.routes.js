import {Router} from "express";
import {getMaterias, getMateriaById, addMateria, updateMateria, deleteMateria} from "../controladores/materias.js"
import {Materia} from "../middlewares/scheme/materiasScheme.js"
import {validate} from "../middlewares/validacion.js"
import {verificarToken, verificarNivel} from "../middlewares/authMiddleware.js"
const router = Router()

router.get("/getMaterias", verificarToken, verificarNivel(['admin', 'profesor']), getMaterias)
router.get("/getMateriaById/:id", verificarToken, verificarNivel(['admin', 'profesor']), getMateriaById)
router.post("/addMateria", verificarToken, verificarNivel(['admin']), validate(Materia), addMateria)
router.put("/updateMateria/:id", verificarToken, verificarNivel(['admin']), validate(Materia), updateMateria)
router.delete("/deleteMateria/:id", verificarToken, verificarNivel(['admin']), deleteMateria)

export default router

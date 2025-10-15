import { Router } from "express";
import {getCarreras, getCarrerasById, addCarrera, updateCarrera, deleteCarrera} from "../controladores/carreras.js"
import { validate } from "../middlewares/validacion.js";
import { Carrera } from "../middlewares/scheme/carreraScheme.js";
import {verificarToken, verificarNivel} from "../middlewares/authMiddleware.js"
const router = Router()

router.get("/getCarreras", verificarToken, verificarNivel(['admin', 'profesor']), getCarreras)

router.get("/getCarrerasById/:id", verificarToken, verificarNivel(['admin', 'profesor']), getCarrerasById)

router.post("/addCarrera", verificarToken, verificarNivel(['admin']), validate(Carrera), addCarrera)

router.put("/actuCarrera/:id", verificarToken, verificarNivel(['admin']), validate(Carrera), updateCarrera)

router.delete("/deleteCarrera/:id", verificarToken, verificarNivel(['admin']), deleteCarrera)

export default router;
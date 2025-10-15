import { Router } from "express";
import {getCarreras, getCarrerasById, addCarrera, updateCarrera, deleteCarrera} from "../controladores/carreras.js"
import { validate } from "../middlewares/validate.js";
import { Carrera } from "../middlewares/scheme/carreraScheme.js";

const router = Router()

router.get("/getCarreras", getCarreras)

router.get("/getCarrerasById/:id", getCarrerasById)

router.post("/addCarrera", validate(Carrera), addCarrera)

router.put("/actuCarrera/:id", validate(Carrera), updateCarrera)

router.delete("/deleteCarrera/:id", deleteCarrera)

export default router;
import { Router } from "express";
import {getCarreras, getCarrerasById, addCarrera, updateCarrera, deleteCarrera} from "../controladores/carreras.js"

const router = Router()

router.get("/getCarreras", getCarreras)

router.get("/getCarrerasById/:id", getCarrerasById)

router.post("/addCarrera", addCarrera)

router.put("/actuCarrera/:id", updateCarrera)

router.delete("/deleteCarrera/:id", deleteCarrera)

export default router;
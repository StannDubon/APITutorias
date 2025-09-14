import {Router} from "express";
import {getUsuarios, getUsuarioById, addUsuario, updateUsuario, deleteUsuario} from "../controladores/usuarios.js"

const router = Router()


router.get("/usuarios", getUsuarios)

router.get("/usuario/:id", getUsuarioById)

router.post("/newUsuario", addUsuario)

router.put("/actuUsuario/:id", updateUsuario)

router.delete("/deleteUsuario/:id", deleteUsuario)

export default router

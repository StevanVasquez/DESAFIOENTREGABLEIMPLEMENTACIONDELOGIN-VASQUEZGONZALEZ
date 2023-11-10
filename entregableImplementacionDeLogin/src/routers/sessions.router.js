import { Router } from "express";
import userModel from "../dao/models/users.model.js";
import productsmodel from "../dao/models/products.model.js";

const router = Router();

router.post("/register", async (req, res) => {
    try {
        const body = req.body;
        const { email } = req.body;
        const checkUser = await userModel.findOne({ email: email });
        if (checkUser) {
            console.log(checkUser);
            alert("Usuario existente");
            return res.redirect("/login");
        } else {
            const newUser = await userModel.create(body);
            req.session.user = { ...body };
            console.log(newUser);
            return res.render("login", { style: "styles.css" });
        }
    } catch (err) {
        console.log(err);
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = {
            first_name: "Admin CODERHOUSE",
            age: "-",
            email: "adminCoderhouse@coderhouse.com",
            password: "adminCoder45123$$",
            role: "admin",
        };
        if (email !== admin.email || password !== admin.password) {
            const findUser = await userModel.findOne({ email });
            if (!findUser) {
                return res.status(401).json({ message: "Usuario no registrado" });
            }
            if (findUser.password !== password) {
                return res.status(401).json({ message: "Password incorrecto" });
            }
            req.session.user = { ...findUser, password: "" };
            const { docs } = await productsmodel.paginate( {}, { lean: true } );
            return res.render("profile", { style: "styles.css", first_name: req.session?.user?.first_name || findUser.first_name,
            email: req.session?.user?.email || email, age: req.session?.user?.age || findUser.age, role: req.session?.user?.role 
            || findUser.role, products: docs });
        } else {
            res.render("profile", { style: "styles.css", first_name: admin.first_name, age: admin.age,
            email: req.session?.user?.email || email, role: admin.role });
        }
    } catch (err) {
        console.log(err);
    }
});
router.get("/logout", async (req, res) => {
    req.session.destroy((err) => {
    if (!err) return res.redirect("/login");
    return res.send({ message: "Logout error", body: err });
    });
});
export default router;
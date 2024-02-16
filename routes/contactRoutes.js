import express from "express";
import {getContacts, getContact, createContact, updateContact, deleteContact} from "../controllers/contactController.js";
import validateToken from "../middleware/validateTokenHandler.js";

const router = express.Router();

// router.route("/").get(getContacts);
// router.route("/:id").get(getContact);
// router.route("/").post(createContact);
// router.route("/:id").put(updateContact);
// router.route("/:id").delete(deleteContact);

router.use(validateToken); // using validation on all routes of contact

// Combining multiple http methods in a route
router.route("/").get(getContacts).post(createContact);
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

export default router;
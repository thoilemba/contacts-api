import expressAsyncHandler from "express-async-handler";
import Contact from "../models/contactModel.js";

// @desc Get all contacts
// @route GET /api/contacts
// @access private
const getContacts = expressAsyncHandler (async (req, res) => {
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).send(contacts);
});

// @desc Get contact by user id
// @route GET /api/contacts/:id
// @access private
const getContact = expressAsyncHandler (async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).send(contact);
});

// @desc Create new contact
// @route POST /api/contacts
// @access private
const createContact = expressAsyncHandler (async (req, res) => {
    console.log("Request body for Post request:", req.body);
    const {name, email, phone} = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const contact = await Contact.create({
        user_id: req.user.id,
        name,
        email,
        phone,
    })
    res.status(201).send(contact);
});

// @desc Update contact
// @route PUT /api/contacts:id
// @access private
const updateContact = expressAsyncHandler (async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error ("User don't have permission to update other user contacts");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}  
    );
    res.status(201).send(updatedContact);
});

// @desc Delete contacts
// @route DELETE /api/contacts:id
// @access private
const deleteContact = expressAsyncHandler (async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to delete other user contacts");
    }

    await Contact.deleteOne({_id: req.params.id});
    res.status(200).send(contact);
});

export {getContacts, getContact, createContact, updateContact, deleteContact};
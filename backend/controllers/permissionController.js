// controllers/permissionController.js

import Permission from "../models/Permission.js"; // Assuming you have a Permission model

export const createPermission = async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Permission name is required" });
    }

    try {
        const newPermission = new Permission({ name, description });
        await newPermission.save();
        res.status(201).json(newPermission);
    } catch (error) {
        res.status(500).json({ error: "Error creating permission", details: error });
    }
};

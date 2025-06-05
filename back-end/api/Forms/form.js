const pool = require("../../database");

exports.createForm = async (req, res) => {
    const { user_id } = req.params;
    const { form_description, form_type, form_status } = req.body;
    const files = req.files; // uploaded files

    if (!form_description || !form_type || !form_status) {
        return res.status(400).json({ status: "error", message: "Missing form data" });
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const formRes = await client.query(
            `INSERT INTO FORMS (user_id, form_description, form_type, form_status, created_at) 
             VALUES ($1, $2, $3, $4, NOW()) RETURNING id`,
            [user_id, form_description, form_type, form_status]
        );
        const formId = formRes.rows[0].id;

        // Save attachments (if any)
        if (Array.isArray(files) && files.length > 0) {
            for (let file of files) {
                await client.query(
                    `INSERT INTO ATTACHMENTS (form_id, filename, file_url) VALUES ($1, $2, $3)`,
                    [formId, file.originalname, `/uploads/${file.filename}`] // Adjust base path if needed
                );
            }
        }

        await client.query("COMMIT");
        res.status(201).json({ status: "success", message: "Form created", form_id: formId });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error creating form:", err.message);
        res.status(500).json({ status: "error", message: "Failed to create form" });
    } finally {
        client.release();
    }
};


exports.updateFormById = async (req, res) => {
    const { id } = req.params;
    const { form_description, form_type, form_status, form_reply } = req.body;

    if (!form_description || !form_type || !form_status) {
        return res.status(400).json({ status: "error", message: "Missing form data" });
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const result = await client.query(
            `UPDATE FORMS SET form_description = $1, form_type = $2, form_status = $3, form_reply = $4
             WHERE id = $5 RETURNING *`,
            [form_description, form_type, form_status,form_reply, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ status: "error", message: "Form not found" });
        }

        await client.query("COMMIT");
        res.status(200).json({ status: "success", message: "Form updated", form: result.rows[0] });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error updating form:", err.message);
        res.status(500).json({ status: "error", message: "Failed to update form" });
    } finally {
        client.release();
    }
}

exports.getAllForms = async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM FORMS");
        res.status(200).json({ status: "success", forms: result.rows });
    } catch (err) {
        console.error("Error fetching forms:", err.message);
        res.status(500).json({ status: "error", message: "Failed to fetch forms" });
    } finally {
        client.release();
    }
}
exports.getFormByUserId = async (req, res) => {
    const { user_id } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM FORMS WHERE user_id = $1", [user_id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ status: "error", message: "No forms found for this user" });
        }
        res.status(200).json({ status: "success", forms: result.rows });
    } catch (err) {
        console.error("Error fetching forms by user ID:", err.message);
        res.status(500).json({ status: "error", message: "Failed to fetch forms" });
    } finally {
        client.release();
    }
}

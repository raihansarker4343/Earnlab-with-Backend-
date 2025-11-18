// ... existing code ...

// Admin Survey Provider Management
app.get('/api/admin/survey-providers', adminAuthMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM survey_providers ORDER BY id');
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        console.error('Error fetching survey providers for admin:', error);
        res.status(500).json({ message: 'Server error fetching survey providers.' });
    }
});

app.patch('/api/admin/survey-providers/:id', adminAuthMiddleware, async (req, res) => {
    const { id } = req.params;
    const { isEnabled, logo, name } = req.body;
    
    try {
        const fields = [];
        const values = [];
        let queryIndex = 1;

        if (typeof isEnabled === 'boolean') {
            fields.push(`is_enabled = $${queryIndex++}`);
            values.push(isEnabled);
        }
        if (logo) {
            fields.push(`logo = $${queryIndex++}`);
            values.push(logo);
        }
        if (name) {
            fields.push(`name = $${queryIndex++}`);
            values.push(name);
        }

        if (fields.length === 0) {
             return res.status(400).json({ message: 'No fields to update.' });
        }

        values.push(id);
        const query = `UPDATE survey_providers SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING *`;

        const result = await pool.query(query, values);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Survey provider not found.' });
        res.json(snakeToCamel(result.rows[0]));
    } catch (error) {
        console.error('Error updating survey provider:', error);
        res.status(500).json({ message: 'Server error updating survey provider.' });
    }
});

// Admin Offer Wall Management
app.get('/api/admin/offer-walls', adminAuthMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM offer_walls ORDER BY id');
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        console.error('Error fetching offer walls for admin:', error);
        res.status(500).json({ message: 'Server error fetching offer walls.' });
    }
});

app.patch('/api/admin/offer-walls/:id', adminAuthMiddleware, async (req, res) => {
    const { id } = req.params;
    const { isEnabled, logo, name } = req.body;
    
    try {
        const fields = [];
        const values = [];
        let queryIndex = 1;

        if (typeof isEnabled === 'boolean') {
            fields.push(`is_enabled = $${queryIndex++}`);
            values.push(isEnabled);
        }
        if (logo) {
            fields.push(`logo = $${queryIndex++}`);
            values.push(logo);
        }
        if (name) {
            fields.push(`name = $${queryIndex++}`);
            values.push(name);
        }

        if (fields.length === 0) {
             return res.status(400).json({ message: 'No fields to update.' });
        }

        values.push(id);
        const query = `UPDATE offer_walls SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING *`;

        const result = await pool.query(query, values);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Offer wall not found.' });
        res.json(snakeToCamel(result.rows[0]));
    } catch (error) {
        console.error('Error updating offer wall:', error);
        res.status(500).json({ message: 'Server error updating offer wall.' });
    }
});

// ... existing code ...
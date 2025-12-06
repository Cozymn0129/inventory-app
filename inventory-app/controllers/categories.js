const db = require('../db');

exports.list = async (req, res) => {
    try {
        const sort = req.query.sort || 'id_asc';
        let orderBy = 'id ASC'; // default

        switch (sort) {
            case 'id_desc':
                orderBy = 'id DESC';
                break;
            case 'name':
                orderBy = 'name ASC';
                break;
            case 'name_desc':
                orderBy = 'name DESC';
                break;
        }
        const result = await db.query(`SELECT * FROM categories ORDER BY ${orderBy}`);
        res.render('categories/index', { categories: result.rows, page: { title: 'Category List - Inventory App' }, sort });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'Failed to load items', error: err });
    }
};

exports.newForm = (req, res) => {
    try {
        res.render('categories/new', { page: { title: 'New Category - Inventory App' } });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'Failed to display newForm', error: err });
    }
};

exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        await db.query('INSERT INTO categories (name) VALUES ($1)', [name]);
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'Failed to display new Create form', error: err });
    }
};

exports.editForm = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
        const category = result.rows[0];
        res.render('categories/edit', { category, page: { title: 'Edit Category - Inventory App' } });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'Failed to display Edit form' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        await db.query('UPDATE categories SET name = $1 WHERE id = $2', [name, id]);
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        res.send('Failed to update Category');
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM categories WHERE id = $1', [id]);
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        res.send('Failed to delete Category');
    }
};

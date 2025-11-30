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
        res.render('categories/index', { categories: result.rows, page: 'categories', sort });
    } catch (err) {
        console.error(err);
        res.send('Failed to display Categories List');
    }
};

exports.newForm = (req, res) => {
    try {
        res.render('categories/new', { page: 'categories' });
    } catch (err) {
        console.error(err);
        res.send('Failed to display New Form');
    }
};

exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        await db.query('INSERT INTO categories (name) VALUES ($1)', [name]);
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        res.send('Failed to create New Category');
    }
};

exports.editForm = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
        const category = result.rows[0];
        res.render('categories/edit', { category, page: 'categories' });
    } catch (err) {
        console.error(err);
        res.send('Failed to display Edit Form');
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
        res.send('Failed to update');
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM categories WHERE id = $1', [id]);
        res.redirect('/categories', { page: 'categories' });
    } catch (err) {
        console.error(err);
        res.send('Failed to delete');
    }
};

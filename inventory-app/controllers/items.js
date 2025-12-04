const db = require('../db');

exports.list = async (req, res) => {
    try {
        const selectedCategory = req.query.category;
        let itemsQuery = `SELECT i.*, c.name AS category_name FROM items i LEFT JOIN categories c ON i.category_id = c.id`;
        const params = [];

        if (selectedCategory && selectedCategory !== 'all') {
            itemsQuery += ` WHERE c.name = $1`;
            params.push(selectedCategory);
        }

        itemsQuery += ' ORDER BY i.id';
        const itemResult = await db.query(itemsQuery, params);

        const categoriesResult = await db.query('SELECT name FROM categories ORDER BY name');
        const categoryNames = categoriesResult.rows.map(row => row.name);
        res.render('items/index', { items: itemResult.rows, categoryNames, page: 'items', selectedCategory: selectedCategory || 'all' });
    } catch (err) {
        console.error(err);
        res.stauts(500).render('error', { message: 'Failed to display Item List', error: err });
    }
};

exports.show = async (req, res) => {
    const id = req.params.id;
    const result = await db.query('SELECT i.*, c.name AS category_name FROM items i LEFT JOIN categories c ON i.category_id = c.id WHERE i.id = $1', [id]);
    if (!result.rows[0]) return res.status(400).send('Not found');
    res.render('items/show', { item: result.rows[0], category_name: result.rows[0].category_name ,page: 'items' });
};

exports.newForm = async(req, res) => {
    try {
        const categories = (await db.query('SELECT * FROM categories ORDER BY name')).rows;
        res.render('items/new', { categories, page: 'items' });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'Failed to display New Form', error: err });
    }
};

exports.create = async (req, res) => {
    try {
        const { name, description, quantity, price, category_id } = req.body;
        await db.query(
            'INSERT INTO items (name, description, quantity, price, category_id) VALUES ($1, $2, $3, $4, $5)',
            [name, description, quantity || 0, price || null, category_id || null]
        );
        res.redirect('/items');
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'Failed to create New Item', error: err });
    } 
};

exports.editForm = async (req, res) => {
    try {
        const id = req.params.id;
        const item = (await db.query('SELECT * FROM items WHERE id = $1', [id])).rows[0];
        const cats = (await db.query('SELECT * FROM categories ORDER BY name')).rows;
        res.render('items/edit', { item, categories: cats, page: 'items' });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'Failed to display Edit Form', error: err });
    }
};

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description, quantity, price, category_id } = req.body;
        await db.query(
            `UPDATE items SET name=$1, description=$2, quantity=$3, price=$4, category_id=$5 WHERE id=$6`,
            [name, description, quantity || 0, price || null, category_id || null, id]
        );
        res.redirect(`/items/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'Failed to update', error: err });
    }
};

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        // admin password check
        const adminPassword = process.env.ADMIN_PASSWORD;
        const { admin_password } = req.body;
        if (admin_password!== adminPassword) {
            return res.status(403).send('Admin password is incorrect');
        }
        const result = await db.query('DELETE FROM items WHERE id=$1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).render('error', { message: 'Item not found', error: null });
        }
    res.redirect('/items');
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'Failed to delete item', error: err });
    } 
};

// エラー確認用
exports.testError = async (req, res) => {
    try {
        // あえて存在しない関数を呼ぶ
        nonExistentFunction();
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'This is a test error', error: err });
    }
};

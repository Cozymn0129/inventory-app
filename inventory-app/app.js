require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const port = process.env.PORT || 3000;
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(expressLayouts);

// rooting
const categoriesRouter = require('./routes/categories');
const itemsRouter = require('./routes/items');
app.use('/categories', categoriesRouter);
app.use('/items', itemsRouter);

app.get('/', (req, res) => {
    res.render('empty', { page: 'home' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

app.use((req, res, next) => {
    res.status(404).render('error', { message: 'Page not found', error: null });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Something went wrong', error: err });
});


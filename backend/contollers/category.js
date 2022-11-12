const Category = require('../models/category');

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, cate) => {
        if(err)
            return res.status(400).json({
                error: "No category was found in DB"
            });
        req.category = cate;//give any name(like for user we gave profile)
        next();
    });
};

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, category) => {
        if(err)
            return res.status(400).json({
                error: "Not able to save category in DB"
            });
        res.json({category});//if we write in curly braces we get category: ... (key value) else we get simply data
    });
};

exports.getCategory = (req, res) => {
    res.json(req.category);
}

exports.getAllCategories = (_req, res) => {
    Category.find().exec((err, items) => {
        if(err)
            return res.status(400).json({
                error: "No category found"
            });
        res.json(items);
    });
};

exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;

    category.save((err, updatedCategory) => {
        if(err)
            return res.status(400).json({
                error: "Failed to update category"
            });
        res.json(updatedCategory);
    });
};

exports.deleteCategory = (req, res) => {
    const category = req.category;

    category.remove((err, category) => {
        if(err)
            return res.status(400).json({
                error: "Failed to delete this category"
            });
        res.json({
            category: category,
            message: "Successfully deleted"
        });//or write `${category} successfully deleted`
    });
};
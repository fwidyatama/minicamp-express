const filterResult = (model, populate) => async (req, res, next) => {

    let query = '';
    //copy of req query
    const reqQuery = { ...req.query };

    //exclude field
    const excludeFields = ['select', 'sort', 'limit', 'page'];
    excludeFields.forEach((el) => delete reqQuery[el]);

    //replace operator with $
    let queryString = JSON.stringify(reqQuery)
    queryString = queryString.replace(/\b(gte|gt|lte|lt|in)\b/g, match => `$${match}`);
    queryString = JSON.parse(queryString);

    console.log(queryString);

    //execute query
    query = model.find(queryString);

    if (populate) {
        query = query.populate(populate);
    }

    //select field
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //sorting data
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }
    else {
        query = query.sort('-createdAt');
    }

    //pagination and limit data
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    //startindex
    const skipData = (page - 1) * limit;
    //endindex
    const limitData = page * limit;
    const totalData = await model.countDocuments();

    query = query.skip(skipData).limit(limit);

    const results = await query;

    const pagination = {};
    //pagination field
    if (limitData < totalData) {
        pagination.next = {
            page: page + 1,
        }
    }

    if (skipData > 0) {
        pagination.next = {
            page: page + 1,
        }
        pagination.prev = {
            page: page - 1,
        }
    }

    res.filteredResult = {
        count: totalData,
        success: true,
        pagination: pagination,
        data: results
    }

    next();
}

module.exports = filterResult;
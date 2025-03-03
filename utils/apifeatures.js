
class apifeatures {
    constructor(query, queryStr) {

        this.query = query;
        this.queryStr = queryStr;

    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                name: {
                    $regex: this.queryStr.keyword,
                    $options: 'i'
                }
            }
            : {}

        //console.log(keyword)
        this.query = this.query.find({ ...keyword });

        return this;
    }


    filter() {
        const queryCopy = { ...this.queryStr } // here creating actual copy of query.Str
        //console.log(queryCopy)
        //removing fields from Category

        const removefield = ['keyword', 'page', 'limit'];
        removefield.forEach((key) => { delete queryCopy[key] });

        //console.log(queryCopy)


        //here filter for price and rating use this filter 
        //but we need to add $ sign before operator
        //console.log(queryCopy)

        let queryString = JSON.stringify(queryCopy)
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)
        // this.query = this.query.find(queryCopy);

        this.query = this.query.find(JSON.parse(queryString));
        //console.log(queryString)
        return this;
    }

    pagination(resultPerPage) {

        const currentPage = Number(this.queryStr.page) || 1;//50-10  to find current page

        const skip = resultPerPage * (currentPage - 1);  // skip products

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;

    }

}

module.exports = apifeatures;
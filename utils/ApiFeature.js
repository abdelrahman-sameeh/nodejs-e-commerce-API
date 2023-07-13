class ApiFeature {
   constructor(mongooseQuery, queryString) {
      this.mongooseQuery = mongooseQuery;
      this.queryString = queryString;
   }


   // code word ---------------------------->>
   // // @desc  filter data by fields
   filter() {
      const queryStringObj = { ...this.queryString }
      const excludeFields = ['limit', 'sort', 'page', 'fields', 'keyword']
      excludeFields.forEach(field => delete queryStringObj[field])

      /* 
         if query string contains ( gte|gt|lse|ls ) => ( greater than or equal , , , )
         convert this to {fieldName : { $gte: value } }
         ex =====>  get all product that price is gte 50
         ans ====>  {price: {$gte: 50}}
      */
      let queryStringFilter = JSON.stringify(queryStringObj)
      queryStringFilter = JSON.parse(queryStringFilter.replace(/\b(gte|gt|lte|lt)\b/gi, (match) => `$${match}`))

      this.mongooseQuery = this.mongooseQuery.find(queryStringFilter)

      return this;
   }

   sort() {
      if (this.queryString.sort) {
         let sort = this.queryString.sort
         sort = sort.replace(/,/g, ' ')
         this.mongooseQuery = this.mongooseQuery.sort(sort)
      } else {
         this.mongooseQuery = this.mongooseQuery.sort('-createdAt')
      }
      return this;
   }

   limitFields() {
      if (this.queryString.fields) {
         let fields = this.queryString.fields.replace(/,/g, ' ')
         this.mongooseQuery = this.mongooseQuery.select(fields)
      } else {
         this.mongooseQuery = this.mongooseQuery.select('-__v')
      }
      return this;
   }


   search(targetName) {
      if (this.queryString.keyword) {

         let query = {};
         if (targetName === 'product') {
            query.$or = [
               { title: { $regex: this.queryString.keyword, $options: 'i' } },
               { description: { $regex: this.queryString.keyword, $options: 'i' } }
            ]
         } else {
            query = { name: { $regex: this.queryString.keyword, $options: 'i' } }
         }

         this.mongooseQuery = this.mongooseQuery.find(query)
      }
      return this;
   }


   pagination(countDocuments) {
      const page = Math.floor(+this.queryString.page) || 1;
      const limit = Math.floor(+this.queryString.limit) || 50
      const skip = (page - 1) * limit
      const endIndex = page * limit

      // pagination result
      const pagination = {}
      pagination.currentPage = page
      pagination.limit = limit
      pagination.numberOfPages = Math.ceil(countDocuments / limit)
      // have another documents
      if (countDocuments > endIndex) {
         pagination.nextPage = page + 1
      }

      pagination.previousPage = skip > 0 ? page - 1 : 0

      this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit)
      this.paginationResults = pagination

      return this;
   }

}

module.exports = ApiFeature
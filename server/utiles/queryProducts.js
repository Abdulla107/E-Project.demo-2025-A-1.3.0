class queryProducts {
  products = [];
  query = {};

  constructor(products, query) {
    this.products = products;
    this.query = query;
  }

  categoryQuery = () => {
    this.products = this.query.category
      ? this.products.filter(p => p.category === this.query.category)
      : this.products;
    return this;
  }

  ratingQuery = () => {
    this.products = this.query.rating
      ? this.products.filter(p =>
          parseInt(this.query.rating) <= p.rating &&
          p.rating < parseInt(this.query.rating) + 1
        )
      : this.products;
    return this;
  }

  priceQuery = () => {
    const low = parseFloat(this.query.lowPrice) || 0;
    const high = parseFloat(this.query.highPrice) || Infinity;
    this.products = this.products.filter(p =>
      p.price >= low && p.price <= high
    );
    return this;
  }

searchQuery = () => {
  const searchValue = this.query.searchValue?.trim().toUpperCase();

  if (!searchValue) return this;

  this.products = this.products.filter(p =>
    p.name?.toUpperCase().includes(searchValue)
  );

  return this;
}




  sortByPrice = () => {
    if (this.query.sortPrice === 'low-to-high') {
      this.products.sort((a, b) => a.price - b.price);
    } else if (this.query.sortPrice === 'high-to-low') {
      this.products.sort((a, b) => b.price - a.price);
    }
    return this;
  }

paginate = () => {
  let page = parseInt(this.query.pageNumber) || 1;
  const parPage = parseInt(this.query.parPage) || 12;
  const total = this.products.length;

  const totalPages = Math.ceil(total / parPage);

  if (page > totalPages) {
    page = totalPages; 
  }
  if (page < 1) page = 1;

  const start = (page - 1) * parPage;
  const end = start + parPage;
  this.products = this.products.slice(start, end);

  return this;
}



  getProducts = () => {
    return this.products;
  }

  countProducts = () => {
    return this.products.length;
  }
}

module.exports = queryProducts;

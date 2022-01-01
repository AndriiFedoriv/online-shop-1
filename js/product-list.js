class ProductList {
  constructor(cart) {
    this.cart = cart;
    this.container = document.querySelector('.products-container');
    this.productService = new ProductsService();
    this.sortDirection = 'ascending';
    this.productService
      .getProducts()
      .then(() => this.renderProducts())
      .then(() => this.addEventListeners()); 
    document.querySelector('.search').addEventListener('keydown', async () => {
      await this.renderProducts();
      this.addEventListeners();
    });   
  }
  async renderProducts() {
    const searchInput = document.querySelector('.search');
    let productListDomString = '';
    const products = await this.productService.getProducts();
    [...products]
      .filter( product => product.title.includes(searchInput.value) )
      .sort( (a, b) => this.sortDirection === 'ascending' 
                         ? a.price - b.price
                         : b.price - a.price)
      .forEach(product => {
      productListDomString += `<div class="card w-100% text-dark bg-light">
                  <div class="card product">
                   <div class="card-body">
                      <h5 class="card-title">${product.title}</h4>
                      <p class="card-text text-truncate">${product.description}</p>
                      <div class="d-grid gap-2 d-md-flex justify-content-md-start">
                        <button class="btn btn-light" data-bs-toggle="modal"
                          data-bs-target="#productInfoModal" data-id="${product.id}">Детально
                        </button>
                        <button class="btn btn-outline-success buy" data-id="${product.id}">
                          ${product.price} грн. В кощик
                        </button>
                      </div>
                    </div>
                  </div>
                </div>`;
    });
    this.container.innerHTML = productListDomString;
  }
  async addEventListeners() {
    document
      .querySelectorAll('.product .btn-info')
      .forEach(button =>
        button.addEventListener('click', event =>
          this.handleProductInfoClick(event)
        )
      );
    document
      .querySelectorAll(
        '.card.product button.buy, #productInfoModal button.buy'
      )
      .forEach(button =>
        button.addEventListener('click', event =>
          this.handleProductBuyClick(event)
        )
      );
    document.querySelector('.sort-asc').addEventListener('click', async () => {
        this.sortDirection = 'ascending';
        await this.renderProducts();
        this.addEventListeners();
    });
    document.querySelector('.sort-desc').addEventListener('click', async () => {
        this.sortDirection = 'descending';
        await this.renderProducts();
        this.addEventListeners();
    });
  }
  async handleProductInfoClick(event) {
    const button = event.target; // Button that triggered the modal
    const id = button.dataset.id; // Extract info from data-* attributes
    const product = await this.productService.getProductById(id);
    const modal = document.querySelector('#productInfoModal');
    const productImg1 = modal.querySelector('.modal-body .image-one');
    productImg1.setAttribute('src', product.additionalImages[0]);
    productImg1.setAttribute('alt', product.additionalImages[0]);
    const productImg2 = modal.querySelector('.modal-body .image-two');
    productImg2.setAttribute('src', product.additionalImages[1]);
    productImg2.setAttribute('alt', product.additionalImages[1]);
    modal.querySelector('.modal-body .card-title').innerText = product.title;
    modal.querySelector('.modal-body .card-text').innerText =
      product.description;
    const btnBuy = modal.querySelector('button.buy');
    btnBuy.innerText = `${product.price} - Buy`;
    btnBuy.dataset.id = id;
  }
  handleProductBuyClick(event) {
    const button = event.target;
    const id = button.dataset.id;
    this.cart.addProduct(id);
    window.showAlert('Product added to cart');
  }
}

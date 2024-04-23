import { useEffect, useState } from "react";
import "./ProductFilters.css";

function ProductFilters() {
  // Business logic
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productList, setProductList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  //fetching data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products?limit=24");
        const json = await response.json();
        setProductList(json.products);
        setFilteredProducts(json.products);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //initializing and handling the cart
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : {};
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(product) {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
  }

  function removeFromCart(product) {
    const updatedCart = [...cart];
    updatedCart.splice(product, 1);
    setCart(updatedCart);
  }

  function calculateTotal() {
    let totalPrice = 0;
    for (let i = 0; i < cart.length; i++) {
      totalPrice += cart[i].price;
    }
    return totalPrice;
  }

  //search products
  function filterByValue(array, string) {
    return array.filter((o) =>
      o.title.toLowerCase().includes(string.toLowerCase())
    );
  }

  function handleFilter(e) {
    const searchInput = e.target.value;
    const matchedProducts = filterByValue(productList, searchInput);
    setFilteredProducts(matchedProducts);
  }

  //sort products
  function sortAlphabetically() {
    const copiedList = [...productList];
    const sortedAlpha = copiedList.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    setFilteredProducts(sortedAlpha);
  }

  function sortPricesLowToHigh() {
    const copiedList = [...productList];
    const sortedPriceLowHigh = copiedList.sort(
      (a, b) => parseFloat(a.price) - parseFloat(b.price)
    );

    setFilteredProducts(sortedPriceLowHigh);
  }

  function sortPricesHighToLow() {
    const copiedList = [...productList];
    const sortedPriceHighLow = copiedList.sort(
      (a, b) => parseFloat(b.price) - parseFloat(a.price)
    );

    setFilteredProducts(sortedPriceHighLow);
  }

  //filter products by category
  function filterProducts(category) {
    const copiedList = [...productList];
    const filteredCategory = copiedList.filter((product) => {
      return product.category === category;
    });

    setFilteredProducts(filteredCategory);
  }

  //end of business logic

  if (loading) {
    return <div className="p-5">Loading...</div>;
  }

  if (error) {
    return <div className="p-5">Error: {error.message}</div>;
  }

  return (
    <div className="list-wrapper d-flex">
      <div
        className="product-list p-4 col-md-9 col-12"
        style={{ overflowY: "auto", maxHeight: "100vh" }}
      >
        <h1>List of Products</h1>
        <div className="d-flex flex-wrap">
          <input
            type="text"
            className="mx-5"
            placeholder="Search products..."
            onChange={(e) => handleFilter(e)}
          />

          <div className="dropdown mx-5">
            <a
              className="btn btn-primary dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Sort
            </a>

            <ul className="dropdown-menu">
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => sortAlphabetically()}
                  style={{ cursor: "pointer" }}
                >
                  Alphabetically
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => sortPricesLowToHigh()}
                  style={{ cursor: "pointer" }}
                >
                  Price (lowest-highest)
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => sortPricesHighToLow()}
                  style={{ cursor: "pointer" }}
                >
                  Price (highest-lowest)
                </a>
              </li>
            </ul>
          </div>

          <div className="dropdown mx-5">
            <a
              className="btn btn-primary dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Filter by Category
            </a>

            <ul className="dropdown-menu">
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => filterProducts("smartphones")}
                  style={{ cursor: "pointer" }}
                >
                  Smartphones
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => filterProducts("laptops")}
                  style={{ cursor: "pointer" }}
                >
                  Laptops
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => filterProducts("fragrances")}
                  style={{ cursor: "pointer" }}
                >
                  Fragrances
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => filterProducts("groceries")}
                  style={{ cursor: "pointer" }}
                >
                  Groceries
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="all-products d-flex flex-wrap">
          {filteredProducts.map((product) => {
            return (
              <div
                key={product.id}
                className="card m-3"
                style={{ width: "18rem" }}
              >
                <img
                  src={product.thumbnail}
                  className="card-img-top pt-3"
                  style={{ height: "200px" }}
                  alt={product.title}
                />
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text">{product.description}</p>
                  </div>
                  <p className="d-flex justify-content-between pt-3">
                    <span className="fw-bolder">{product.price} €</span>
                    <button
                      className="btn btn-primary"
                      onClick={() => addToCart(product)}
                    >
                      Add to cart
                    </button>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="chosen-products p-4 col-md-3 col-12"
        style={{ overflowY: "auto", maxHeight: "100vh" }}
      >
        <h1>Your Cart</h1>
        <table className="table-wrapper">
          <tr>
            <th>Image</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Remove</th>
          </tr>
          {cart.map((product) => {
            return (
              <tr>
                <td>
                  <img src={product.thumbnail} style={{ height: "50px" }} />
                </td>
                <td>{product.title}</td>
                <td>{product.price} €</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => removeFromCart(product)}
                  >
                    X
                  </button>
                </td>
              </tr>
            );
          })}
          <tr>
            <td></td>
            <td>TOTAL:</td>
            <td>{calculateTotal()} €</td>
            <td></td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export { ProductFilters };

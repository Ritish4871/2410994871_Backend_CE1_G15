const products = [
    {
        id: 1,
        name: "Laptop Stand",
        category: "Tech",
        price: 899,
        image: "LaptopStand.webp",
        description: "A stand for a comfortable desk setup."
    },
    {
        id: 2,
        name: "Bluetooth Speaker",
        category: "Tech",
        price: 1199,
        image: "BluetoothSpeaker.webp",
        description: "A small speaker for everyday use."
    },
    {
        id: 3,
        name: "Reusable Water Bottle",
        category: "Home",
        price: 399,
        image: "ReusableWaterBottle.webp",
        description: "A bottle to carry to class or work."
    },
    {
        id: 4,
        name: "Canvas Backpack",
        category: "Fashion",
        price: 999,
        image: "CanvasBackpack.webp",
        description: "A useful bag for daily essentials."
    },
    {
        id: 5,
        name: "Cotton T-Shirt",
        category: "Fashion",
        price: 499,
        image: "CottonTshirt.webp",
        description: "A simple T-shirt for everyday wear."
    },
    {
        id: 6,
        name: "Desk Organizer",
        category: "Home",
        price: 349,
        image: "DeskOrganizer.webp",
        description: "Keep pens and small items together."
    },
    {
        id: 7,
        name: "Notebook Set",
        category: "Stationery",
        price: 199,
        image: "NoteBookSet.webp",
        description: "A set of notebooks for taking notes."
    },
    {
        id: 8,
        name: "Running Shoes",
        category: "Fashion",
        price: 1899,
        image: "RunningShoes.webp",
        description: "Comfortable shoes for daily walking."
    }
];

// The cart stores product IDs and their quantities.
let cart = [];
let appliedCoupon = "";

// Find page elements using their IDs.
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const cartItems = document.getElementById("cartItems");
const couponInput = document.getElementById("couponInput");
const couponMessage = document.getElementById("couponMessage");
const checkoutButton = document.getElementById("checkoutButton");
const checkoutSection = document.getElementById("checkoutSection");
const checkoutForm = document.getElementById("checkoutForm");
const notice = document.getElementById("notice");

// Add the rupee sign and commas to a price.
function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

// Find one product by its ID.
function findProduct(productId) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            return products[i];
        }
    }

    return null;
}

// Display products according to search, category and sorting.
function displayProducts() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const sortOption = sortSelect.value;

    let visibleProducts = [];

    // Add matching products to a new array.
    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        const nameMatches = product.name.toLowerCase().includes(searchText);

        const categoryMatches =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        if (nameMatches && categoryMatches) {
            visibleProducts.push(product);
        }
    }

    // Sort products if the user selects a sorting option.
    if (sortOption === "low") {
        visibleProducts.sort(function (a, b) {
            return a.price - b.price;
        });
    } else if (sortOption === "high") {
        visibleProducts.sort(function (a, b) {
            return b.price - a.price;
        });
    } else if (sortOption === "name") {
        visibleProducts.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
    }

    // Clear the old product cards before displaying results.
    productGrid.innerHTML = "";

    for (let i = 0; i < visibleProducts.length; i++) {
        const product = visibleProducts[i];

        productGrid.innerHTML += `
            <div class="product-card">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    class="product-image"
                >

                <h3>${product.name}</h3>

                <span class="product-category">${product.category}</span>

                <p class="product-description">${product.description}</p>

                <p class="product-price">${formatPrice(product.price)}</p>

                <button class="button add-button"
                    onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
    }

    document.getElementById("productCount").textContent =
        visibleProducts.length +
        (visibleProducts.length === 1 ? " product" : " products");

    document.getElementById("noResults").hidden =
        visibleProducts.length !== 0;
}

// Add a product to the cart or increase its quantity.
function addToCart(productId) {
    let found = false;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].quantity++;
            found = true;
            break;
        }
    }

    if (found === false) {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    displayCart();
}

// Change the quantity of an item in the cart.
function changeQuantity(productId, change) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].quantity = cart[i].quantity + change;

            // Remove the item if its quantity becomes zero.
            if (cart[i].quantity <= 0) {
                cart.splice(i, 1);
            }

            break;
        }
    }

    displayCart();
}

// Remove a product from the cart completely.
function removeFromCart(productId) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart.splice(i, 1);
            break;
        }
    }

    displayCart();
}

// Count all items, including their quantities.
function getCartCount() {
    let count = 0;

    for (let i = 0; i < cart.length; i++) {
        count = count + cart[i].quantity;
    }

    return count;
}

// Calculate the subtotal before applying a discount.
function getSubtotal() {
    let subtotal = 0;

    for (let i = 0; i < cart.length; i++) {
        const product = findProduct(cart[i].id);

        subtotal = subtotal + product.price * cart[i].quantity;
    }

    return subtotal;
}

// Calculate the discount based on the applied coupon.
function getDiscount(subtotal) {
    if (appliedCoupon === "SAVE10") {
        return Math.round(subtotal * 0.10);
    }

    if (appliedCoupon === "FLAT100" && subtotal >= 1000) {
        return 100;
    }

    return 0;
}

// Display cart items and update all prices.
function displayCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty.</p>';

        appliedCoupon = "";
        couponInput.value = "";

        couponMessage.textContent = "Use SAVE10 or FLAT100.";
        couponMessage.className = "coupon-message";
    } else {
        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            const product = findProduct(item.id);

            cartItems.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-top">
                        <div>
                            <p class="cart-item-name">${product.name}</p>

                            <span class="cart-item-price">
                                ${formatPrice(product.price)} each
                            </span>
                        </div>

                        <button class="remove-button"
                            onclick="removeFromCart(${product.id})">
                            Remove
                        </button>
                    </div>

                    <div class="cart-item-bottom">
                        <div class="quantity-control">
                            <button
                                onclick="changeQuantity(${product.id}, -1)"
                                aria-label="Decrease quantity">
                                -
                            </button>

                            <span>${item.quantity}</span>

                            <button
                                onclick="changeQuantity(${product.id}, 1)"
                                aria-label="Increase quantity">
                                +
                            </button>
                        </div>

                        <span class="line-total">
                            ${formatPrice(product.price * item.quantity)}
                        </span>
                    </div>
                </div>
            `;
        }
    }

    const itemCount = getCartCount();
    const subtotal = getSubtotal();
    const discount = getDiscount(subtotal);
    const total = subtotal - discount;

    // Update the cart count.
    document.getElementById("headerCartCount").textContent = itemCount;
    document.getElementById("cartTitleCount").textContent = itemCount;

    // Update the cart prices.
    document.getElementById("subtotalAmount").textContent =
        formatPrice(subtotal);

    document.getElementById("discountAmount").textContent =
        "- " + formatPrice(discount);

    document.getElementById("totalAmount").textContent =
        formatPrice(total);

    // Update the checkout summary.
    document.getElementById("checkoutItemCount").textContent = itemCount;

    document.getElementById("checkoutSubtotal").textContent =
        formatPrice(subtotal);

    document.getElementById("checkoutDiscount").textContent =
        "- " + formatPrice(discount);

    document.getElementById("checkoutTotal").textContent =
        formatPrice(total);

    checkoutButton.disabled = cart.length === 0;

    if (appliedCoupon === "FLAT100" &&
        subtotal < 1000 &&
        cart.length > 0) {
        couponMessage.textContent =
            "FLAT100 needs a subtotal of at least ₹1,000.";

        couponMessage.className = "coupon-message error";
    }
}

// Check the coupon code and apply the discount.
function applyCoupon() {
    const code = couponInput.value.trim().toUpperCase();
    const subtotal = getSubtotal();

    if (cart.length === 0) {
        couponMessage.textContent =
            "Add a product before applying a coupon.";

        couponMessage.className = "coupon-message error";
        return;
    }

    if (code === "SAVE10") {
        appliedCoupon = "SAVE10";

        couponMessage.textContent =
            "SAVE10 applied. You saved 10%.";

        couponMessage.className = "coupon-message success";
    } else if (code === "FLAT100") {
        if (subtotal >= 1000) {
            appliedCoupon = "FLAT100";

            couponMessage.textContent =
                "FLAT100 applied. You saved ₹100.";

            couponMessage.className = "coupon-message success";
        } else {
            couponMessage.textContent =
                "Add products worth at least ₹1,000 to use FLAT100.";

            couponMessage.className = "coupon-message error";
            return;
        }
    } else {
        couponMessage.textContent =
            "Invalid coupon. Try SAVE10 or FLAT100.";

        couponMessage.className = "coupon-message error";
        return;
    }

    displayCart();
}

// Update the product list when a filter changes.
searchInput.addEventListener("input", displayProducts);
categoryFilter.addEventListener("change", displayProducts);
sortSelect.addEventListener("change", displayProducts);

// Apply the coupon when the Apply button is clicked.
document.getElementById("applyCouponButton").addEventListener(
    "click",
    applyCoupon
);

// Also apply the coupon when Enter is pressed.
couponInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        applyCoupon();
    }
});

// Show the checkout form when the cart is not empty.
checkoutButton.addEventListener("click", function () {
    if (cart.length > 0) {
        checkoutSection.hidden = false;

        checkoutSection.scrollIntoView({
            behavior: "smooth"
        });
    }
});

// Return to the cart from the checkout section.
document.getElementById("backToCartButton").addEventListener(
    "click",
    function () {
        checkoutSection.hidden = true;

        document.getElementById("cart").scrollIntoView({
            behavior: "smooth"
        });
    }
);

// Submit the demo order.
// No real payment is processed.
checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (cart.length === 0) {
        return;
    }

    const customerName =
        document.getElementById("customerName").value.trim();

    const orderTotal =
        document.getElementById("totalAmount").textContent;

    notice.textContent =
        "Thank you, " + customerName +
        ". Your demo order worth " + orderTotal +
        " has been placed. No payment was taken.";

    notice.hidden = false;

    // Clear the cart after the demo order.
    cart = [];
    appliedCoupon = "";

    checkoutForm.reset();
    checkoutSection.hidden = true;

    displayCart();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Display products and the empty cart when the page opens.
displayProducts();
displayCart();
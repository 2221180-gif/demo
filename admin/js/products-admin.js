// Check authentication
if (localStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
});

// Modal functionality
const modal = document.getElementById('productModal');
const closeBtn = document.querySelector('.close');
const addProductBtn = document.getElementById('addProductBtn');

addProductBtn.addEventListener('click', () => openModal());
closeBtn.addEventListener('click', () => closeModal());

function openModal(product = null) {
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('productForm');
    
    if (product) {
        title.textContent = 'Edit Product';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productImage').value = product.image;
    } else {
        title.textContent = 'Add New Product';
        form.reset();
    }
    
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

// Load products
async function loadProducts() {
    try {
        const response = await fetch('../backend/api/products.php');
        const products = await response.json();
        
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}"></td>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn-edit" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Product form submission
document.getElementById('productForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const productData = {
        id: document.getElementById('productId').value,
        name: document.getElementById('productName').value,
        price: document.getElementById('productPrice').value,
        stock: document.getElementById('productStock').value,
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value
    };
    
    try {
        const url = productData.id ? '../backend/api/admin/products.php' : '../backend/api/admin/products.php';
        const method = productData.id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            closeModal();
            loadProducts();
        }
    } catch (error) {
        console.error('Error saving product:', error);
    }
});

// Edit and delete functions
function editProduct(id) {
    // In a real app, you'd fetch the product details
    const product = {
        id: id,
        name: 'Product Name', // You'd get this from your data
        price: 19.99,
        stock: 50,
        description: 'Product description',
        image: 'image.jpg'
    };
    openModal(product);
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        // Simulate delete operation
        console.log('Delete product:', id);
        loadProducts(); // Reload to reflect changes
    }
}

// Initial load
loadProducts();
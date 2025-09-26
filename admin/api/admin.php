<?php include("db.php"); ?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard</title>
  <style>
    body { font-family: Arial, sans-serif; background:#f9fafb; margin:0; }
    header { background:#111; color:#fff; padding:1rem; display:flex; justify-content:space-between; align-items:center; }
    .container { max-width:1000px; margin:auto; padding:2rem; }
    h2 { margin-bottom:1rem; }
    form { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:2rem; }
    input { padding:10px; border:1px solid #ccc; border-radius:6px; }
    button { padding:10px; border:none; border-radius:6px; cursor:pointer; }
    .btn-add { background:#111; color:#fff; }
    .btn-delete { background:red; color:#fff; }
    table { width:100%; border-collapse:collapse; margin-top:1rem; }
    table, th, td { border:1px solid #ccc; }
    th, td { padding:10px; text-align:center; }
    img { max-width:50px; border-radius:6px; }
  </style>
</head>
<body>
  <header>
    <h1>Admin Dashboard</h1>
    <nav>
      <a href="orders.php" style="color:#facc15; margin-right:1rem;">View Orders</a>
      <a href="logout.php" style="background:#facc15; padding:0.5rem 1rem; border:none; border-radius:6px; cursor:pointer; text-decoration:none;">Logout</a>
    </nav>
  </header>
  
  <div class="container">
    <h2>Manage Products</h2>
    
    <!-- Add Product -->
    <form action="admin.php" method="POST">
      <input type="text" name="name" placeholder="Product Name" required>
      <input type="number" name="price" placeholder="Price" required>
      <input type="number" name="stock" placeholder="Stock" required>
      <input type="text" name="image" placeholder="Image URL" required>
      <button type="submit" name="add" class="btn-add">Add Product</button>
    </form>

    <?php
    // Add Product
    if(isset($_POST['add'])){
        $name = $_POST['name'];
        $price = $_POST['price'];
        $stock = $_POST['stock'];
        $image = $_POST['image'];

        $sql = "INSERT INTO products (name, price, stock, image) VALUES ('$name','$price','$stock','$image')";
        if($conn->query($sql)){
            echo "<p style='color:green;'>Product added successfully!</p>";
        } else {
            echo "<p style='color:red;'>Error: ".$conn->error."</p>";
        }
    }

    // Delete Product
    if(isset($_GET['delete'])){
        $id = $_GET['delete'];
        $conn->query("DELETE FROM products WHERE id=$id");
        header("Location: admin.php"); // refresh after delete
        exit;
    }

    // Fetch Products
    $result = $conn->query("SELECT * FROM products");
    ?>

    <table>
      <thead>
        <tr><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Action</th></tr>
      </thead>
      <tbody>
        <?php while($row = $result->fetch_assoc()): ?>
          <tr>
            <td><img src="<?= $row['image'] ?>" alt="<?= $row['name'] ?>"></td>
            <td><?= $row['name'] ?></td>
            <td>৳<?= $row['price'] ?></td>
            <td><?= $row['stock'] ?></td>
            <td><a href="admin.php?delete=<?= $row['id'] ?>" class="btn-delete">Delete</a></td>
          </tr>
        <?php endwhile; ?>
      </tbody>
    </table>
  </div>
</body>
</html>

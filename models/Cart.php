<?php
class Cart {
    private $conn;
    private $table_name = "cart";

    public $id;
    public $user_id;
    public $product_id;
    public $quantity;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function addToCart() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET user_id=:user_id, product_id=:product_id, quantity=:quantity, created_at=:created_at";

        $stmt = $this->conn->prepare($query);

        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->product_id = htmlspecialchars(strip_tags($this->product_id));
        $this->quantity = htmlspecialchars(strip_tags($this->quantity));
        $this->created_at = date('Y-m-d H:i:s');

        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":product_id", $this->product_id);
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":created_at", $this->created_at);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function getCartItems($user_id) {
        $query = "SELECT c.id, c.quantity, p.name, p.price, p.image 
                  FROM " . $this->table_name . " c 
                  JOIN products p ON c.product_id = p.id 
                  WHERE c.user_id = ? 
                  ORDER BY c.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $user_id);
        $stmt->execute();

        return $stmt;
    }

    public function updateQuantity() {
        $query = "UPDATE " . $this->table_name . " 
                  SET quantity = :quantity 
                  WHERE id = :id AND user_id = :user_id";

        $stmt = $this->conn->prepare($query);

        $this->quantity = htmlspecialchars(strip_tags($this->quantity));
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));

        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":user_id", $this->user_id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function removeFromCart() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE id = ? AND user_id = ?";

        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));

        $stmt->bindParam(1, $this->id);
        $stmt->bindParam(2, $this->user_id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function clearCart($user_id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE user_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $user_id);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
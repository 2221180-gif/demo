<?php
class Cart {
    private $conn;
    private $table_name = "cart";

    public $id;
    public $product_id;
    public $quantity;
    public $session_id;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function addToCart() {
        $query = "INSERT INTO " . $this->table_name . " 
                 SET product_id=:product_id, quantity=:quantity, session_id=:session_id";
        
        $stmt = $this->conn->prepare($query);
        
        $this->product_id = htmlspecialchars(strip_tags($this->product_id));
        $this->quantity = htmlspecialchars(strip_tags($this->quantity));
        $this->session_id = htmlspecialchars(strip_tags($this->session_id));
        
        $stmt->bindParam(":product_id", $this->product_id);
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":session_id", $this->session_id);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function getCartItems() {
        $query = "SELECT c.*, p.name, p.price, p.image_url 
                 FROM " . $this->table_name . " c 
                 LEFT JOIN products p ON c.product_id = p.id 
                 WHERE c.session_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->session_id);
        $stmt->execute();
        return $stmt;
    }

    public function updateQuantity() {
        $query = "UPDATE " . $this->table_name . " 
                 SET quantity = :quantity 
                 WHERE id = :id AND session_id = :session_id";
        
        $stmt = $this->conn->prepare($query);
        
        $this->quantity = htmlspecialchars(strip_tags($this->quantity));
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->session_id = htmlspecialchars(strip_tags($this->session_id));
        
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":session_id", $this->session_id);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function removeFromCart() {
        $query = "DELETE FROM " . $this->table_name . " 
                 WHERE id = ? AND session_id = ?";
        
        $stmt = $this->conn->prepare($query);
        
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->session_id = htmlspecialchars(strip_tags($this->session_id));
        
        $stmt->bindParam(1, $this->id);
        $stmt->bindParam(2, $this->session_id);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
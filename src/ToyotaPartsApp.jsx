import { useState } from "react";
import "./ToyotaPartsApp.css";

import { MOCK_PARTS } from "./data/mockParts";
import { CartIcon } from "./components/Icons";
import LoginScreen from "./components/LoginScreen";
import Header from "./components/Header";
import PartDetail from "./components/PartDetail";
import PartsSearch from "./components/PartsSearch";
import CartModal from "./components/CartModal";

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [parts, setParts] = useState(MOCK_PARTS);
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const handleSave = (updated) => {
    setParts((prev) =>
      prev.map((p) =>
        p.id === updated.id
          ? {
              ...updated,
              price: parseFloat(updated.price),
              stock: parseInt(updated.stock),
            }
          : p,
      ),
    );
    setSelected({
      ...updated,
      price: parseFloat(updated.price),
      stock: parseInt(updated.stock),
    });
  };

  const addToCart = (part, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === part.id);
      if (existing) {
        return prev.map((i) =>
          i.id === part.id ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { ...part, qty }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  if (!user) return <LoginScreen onLogin={setUser} />;

  return (
    <div className="app">
      <Header
        user={user}
        onLogout={() => {
          setUser(null);
          setSelected(null);
          setCart([]);
        }}
      />
      <main className="main">
        {selected ? (
          <PartDetail
            part={selected}
            user={user}
            onBack={() => setSelected(null)}
            onSave={handleSave}
            onAddToCart={addToCart}
          />
        ) : (
          <PartsSearch
            parts={parts}
            onSelectPart={setSelected}
            onAddToCart={addToCart}
          />
        )}
      </main>

      {/* Floating Cart Button */}
      <button
        className="cartFab"
        onClick={() => setShowCart(true)}
      >
        <CartIcon />
        {cart.length > 0 && (
          <span className="cartBadge">
            {cart.reduce((sum, i) => sum + i.qty, 0)}
          </span>
        )}
      </button>

      {/* Cart Modal */}
      {showCart && (
        <CartModal
          cart={cart}
          onClose={() => setShowCart(false)}
          onRemove={removeFromCart}
          onUpdateQty={updateQty}
          user={user}
        />
      )}
    </div>
  );
}

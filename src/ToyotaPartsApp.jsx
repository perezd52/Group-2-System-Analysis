import { useCallback, useEffect, useState } from "react";
import "./ToyotaPartsApp.css";

import { supabase } from "./utils/supabase";
import { CartIcon } from "./components/Icons";
import LoginScreen from "./components/LoginScreen";
import Header from "./components/Header";
import PartDetail from "./components/PartDetail";
import PartsSearch from "./components/PartsSearch";
import CartModal from "./components/CartModal";

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [parts, setParts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const normalizePart = (p) => ({
    id: p.id,
    name: p.name,
    category: p.category || "Uncategorized",
    price: parseFloat(p.price),
    stock: Number.isFinite(Number(p.stock)) ? parseInt(p.stock, 10) : 0,
    location: p.location || "",
    compatibleModels: p.compatible_models || "",
    description: p.description || "",
  });

  const fetchParts = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    const { data, error } = await supabase
      .from("parts")
      .select("id, name, category, price, stock, location, compatible_models, description")
      .order("id", { ascending: true });

    if (error) {
      setLoadError(error.message || "Failed to load parts.");
      setLoading(false);
      return;
    }

    setParts((data || []).map(normalizePart));
    setLoading(false);
  }, []);

  const handleLogin = async (loggedInUser) => {
    setUser(loggedInUser);
    await fetchParts();
  };

  useEffect(() => {
    const restoreSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data?.session?.user) {
        return;
      }

      const sessionUser = data.session.user;
      setUser({
        name: sessionUser.user_metadata?.name || sessionUser.email,
        workerId: sessionUser.user_metadata?.workerId || sessionUser.email,
        role: sessionUser.user_metadata?.role || "employee",
        email: sessionUser.email,
      });

      await fetchParts();
    };

    restoreSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT" || !session?.user) {
          setUser(null);
          setParts([]);
          setSelected(null);
          setCart([]);
          return;
        }

        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          const sessionUser = session.user;
          setUser({
            name: sessionUser.user_metadata?.name || sessionUser.email,
            workerId: sessionUser.user_metadata?.workerId || sessionUser.email,
            role: sessionUser.user_metadata?.role || "employee",
            email: sessionUser.email,
          });
          await fetchParts();
        }
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, [fetchParts]);

  const handleSave = async (updated) => {
    const payload = {
      name: updated.name,
      category: updated.category,
      price: parseFloat(updated.price),
      stock: parseInt(updated.stock, 10),
      location: updated.location,
      compatible_models: updated.compatibleModels,
      description: updated.description,
    };

    const { data, error } = await supabase
      .from("parts")
      .update(payload)
      .eq("id", updated.id)
      .select("id, name, category, price, stock, location, compatible_models, description")
      .single();

    if (error) {
      setLoadError(error.message || "Failed to save part.");
      return;
    }

    const normalized = normalizePart(data);

    setParts((prev) => prev.map((p) => (p.id === normalized.id ? normalized : p)));
    setSelected(normalized);
  };

  const handleCreatePart = async (newPart) => {
    const payload = {
      id: newPart.id,
      name: newPart.name,
      category: newPart.category,
      price: parseFloat(newPart.price),
      stock: parseInt(newPart.stock, 10),
      location: newPart.location,
      compatible_models: newPart.compatibleModels,
      description: newPart.description,
    };

    const { data, error } = await supabase
      .from("parts")
      .insert(payload)
      .select("id, name, category, price, stock, location, compatible_models, description")
      .single();

    if (error) {
      setLoadError(error.message || "Failed to create part.");
      return;
    }

    const normalized = normalizePart(data);
    setParts((prev) => [...prev, normalized].sort((a, b) => a.id.localeCompare(b.id)));
  };

  const handleDeletePart = async (id) => {
    const { error } = await supabase.from("parts").delete().eq("id", id);

    if (error) {
      setLoadError(error.message || "Failed to delete part.");
      return;
    }

    setParts((prev) => prev.filter((p) => p.id !== id));
    if (selected?.id === id) {
      setSelected(null);
    }
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

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="app">
      <Header
        user={user}
        onLogout={async () => {
          await supabase.auth.signOut();
          setUser(null);
          setSelected(null);
          setCart([]);
          setParts([]);
        }}
      />
      <main className="main">
        {loading ? (
          <div className="emptyState">Loading parts...</div>
        ) : loadError ? (
          <div className="emptyState">Error loading parts: {loadError}</div>
        ) : selected ? (
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
            user={user}
            onSelectPart={setSelected}
            onAddToCart={addToCart}
            onCreatePart={handleCreatePart}
            onDeletePart={handleDeletePart}
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

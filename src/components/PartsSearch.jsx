import { useState } from "react";
import { CATEGORIES } from "../data/mockParts";
import { CartIcon, SearchIcon } from "./Icons";

// ── Parts Search ──────────────────────────────────────────────────────────────
export default function PartsSearch({
  parts,
  user,
  onSelectPart,
  onAddToCart,
  onCreatePart,
  onDeletePart,
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const [qtyMap, setQtyMap] = useState({});
  const [newPart, setNewPart] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    stock: "",
    location: "",
    compatibleModels: "",
    description: "",
  });

  const getQty = (id) => qtyMap[id] || 1;

  const handleAddToCart = (p) => {
    onAddToCart(p, getQty(p.id));
    setQtyMap((prev) => ({ ...prev, [p.id]: 1 }));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newPart.id || !newPart.name) return;
    onCreatePart(newPart);
    setNewPart({
      id: "",
      name: "",
      category: "",
      price: "",
      stock: "",
      location: "",
      compatibleModels: "",
      description: "",
    });
  };

  const filtered = parts.filter((p) => {
    const q = query.toLowerCase();
    const matchQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.compatibleModels.toLowerCase().includes(q);
    const matchCat = category === "All" || p.category === category;
    return matchQuery && matchCat;
  });

  return (
    <div className="searchWrap">
      <div className="searchBar">
        <div className="searchInputWrap">
          <span className="searchIcon">
            <SearchIcon />
          </span>
          <input
            className="searchInput"
            placeholder="Search by name, part number, or vehicle model…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="catRow">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`catBtn ${category === c ? "active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {user?.role === "manager" && (
        <form
          className="detailCard"
          style={{ marginBottom: 16 }}
          onSubmit={handleCreateSubmit}
        >
          <h3 style={{ marginBottom: 12 }}>Create Part</h3>
          <div className="detailGrid">
            <input className="fieldInput" placeholder="Part ID" value={newPart.id} onChange={(e) => setNewPart((p) => ({ ...p, id: e.target.value }))} />
            <input className="fieldInput" placeholder="Name" value={newPart.name} onChange={(e) => setNewPart((p) => ({ ...p, name: e.target.value }))} />
            <input className="fieldInput" placeholder="Category" value={newPart.category} onChange={(e) => setNewPart((p) => ({ ...p, category: e.target.value }))} />
            <input className="fieldInput" placeholder="Price" type="number" step="0.01" value={newPart.price} onChange={(e) => setNewPart((p) => ({ ...p, price: e.target.value }))} />
            <input className="fieldInput" placeholder="Stock" type="number" min="0" value={newPart.stock} onChange={(e) => setNewPart((p) => ({ ...p, stock: e.target.value }))} />
            <input className="fieldInput" placeholder="Location" value={newPart.location} onChange={(e) => setNewPart((p) => ({ ...p, location: e.target.value }))} />
            <input className="fieldInput" placeholder="Compatible Models" value={newPart.compatibleModels} onChange={(e) => setNewPart((p) => ({ ...p, compatibleModels: e.target.value }))} />
          </div>
          <textarea
            className="fieldTextarea"
            style={{ marginTop: 10 }}
            placeholder="Description"
            value={newPart.description}
            onChange={(e) => setNewPart((p) => ({ ...p, description: e.target.value }))}
          />
          <div className="editActions">
            <button className="saveBtn" type="submit">Create Part</button>
          </div>
        </form>
      )}

      <div className="resultsInfo">
        {filtered.length} part{filtered.length !== 1 ? "s" : ""} found
        {query && (
          <>
            {" "}
            for <strong>"{query}"</strong>
          </>
        )}
      </div>

      <div className="table">
        <div className="tableHeader">
          <span>Part #</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span></span>
        </div>
        {filtered.length === 0 ? (
          <div className="emptyState">No parts match your search.</div>
        ) : (
          filtered.map((p) => {
            const stockColor =
              p.stock === 0 ? "#ef4444" : p.stock < 10 ? "#f59e0b" : "#22c55e";
            return (
              <div
                key={p.id}
                className="tableRow"
                onClick={() => onSelectPart(p)}
              >
                <span className="partId">{p.id}</span>
                <span className="partName">{p.name}</span>
                <span>
                  <span className="catTag">{p.category}</span>
                </span>
                <span className="price">${parseFloat(p.price).toFixed(2)}</span>
                <span
                  style={{ color: stockColor, fontWeight: 600, fontSize: 13 }}
                >
                  {p.stock === 0 ? "Out of Stock" : `${p.stock} units`}
                </span>
                <span className="rowCartControls">
                  <div className="qtyRow">
                    <button
                      className="qtyBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQtyMap((prev) => ({
                          ...prev,
                          [p.id]: Math.max(1, getQty(p.id) - 1),
                        }));
                      }}
                    >
                      −
                    </button>
                    <span className="qtyVal">{getQty(p.id)}</span>
                    <button
                      className="qtyBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQtyMap((prev) => ({
                          ...prev,
                          [p.id]: getQty(p.id) + 1,
                        }));
                      }}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="rowCartBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(p);
                    }}
                    disabled={p.stock === 0}
                  >
                    <CartIcon />
                  </button>
                  {user?.role === "manager" && (
                    <button
                      className="removeBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePart(p.id);
                      }}
                      title="Delete part"
                    >
                      ✕
                    </button>
                  )}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

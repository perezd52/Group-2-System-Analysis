import { useState } from "react";
import {
  BackIcon,
  CartIcon,
  CheckIcon,
  EditIcon,
  LockIcon,
} from "./Icons";

// ── Detail Field ──────────────────────────────────────────────────────────────
function DetailField({ label, value }) {
  return (
    <div className="fieldBlock">
      <div className="fieldLabel">{label}</div>
      <div className="fieldValue">{value}</div>
    </div>
  );
}

// ── Part Detail ───────────────────────────────────────────────────────────────
export default function PartDetail({ part, user, onBack, onSave, onAddToCart }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...part });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const stockColor =
    form.stock === 0 ? "#ef4444" : form.stock < 10 ? "#f59e0b" : "#22c55e";

  return (
    <div className="detailWrap">
      <button
        className="backBtn"
        onClick={onBack}
      >
        <BackIcon /> <span style={{ marginLeft: 6 }}>Back to Results</span>
      </button>

      <div className="detailCard">
        <div className="detailHeader">
          <div>
            <div className="detailId">{form.id}</div>
            <h2 className="detailName">{form.name}</h2>
            <span className="catTag">{form.category}</span>
          </div>
          {user.role === "manager" && !editing && (
            <button
              className="editBtn"
              onClick={() => setEditing(true)}
            >
              <EditIcon /> Edit Part
            </button>
          )}
          {!editing && (
            <button
              className="addToCartBtn"
              onClick={() => onAddToCart(form)}
            >
              <CartIcon /> Add to Cart
            </button>
          )}
          {saved && (
            <div className="savedBadge">
              <CheckIcon /> Saved
            </div>
          )}
        </div>

        <div className="detailGrid">
          <DetailField
            label="Price"
            value={
              editing ? (
                <input
                  className="fieldInput"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                />
              ) : (
                `$${parseFloat(form.price).toFixed(2)}`
              )
            }
          />
          <DetailField
            label="Stock"
            value={
              editing ? (
                <input
                  className="fieldInput"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, stock: e.target.value }))
                  }
                />
              ) : (
                <span style={{ color: stockColor, fontWeight: 700 }}>
                  {form.stock} units
                </span>
              )
            }
          />
          <DetailField
            label="Bin Location"
            value={
              editing ? (
                <input
                  className="fieldInput"
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                />
              ) : (
                form.location
              )
            }
          />
          <DetailField
            label="Compatible Models"
            value={
              editing ? (
                <input
                  className="fieldInput"
                  value={form.compatibleModels}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, compatibleModels: e.target.value }))
                  }
                />
              ) : (
                form.compatibleModels
              )
            }
          />
        </div>

        <div className="descBlock">
          <div className="fieldLabel">Description</div>
          {editing ? (
            <textarea
              className="fieldTextarea"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          ) : (
            <p className="descText">{form.description}</p>
          )}
        </div>

        {editing && (
          <div className="editActions">
            <button
              className="cancelBtn"
              onClick={() => {
                setForm({ ...part });
                setEditing(false);
              }}
            >
              Cancel
            </button>
            <button
              className="saveBtn"
              onClick={handleSave}
            >
              <CheckIcon /> Save Changes
            </button>
          </div>
        )}

        {user.role === "employee" && (
          <div className="readonlyNote">
            <LockIcon /> View only — contact a manager to update part info or
            inventory.
          </div>
        )}
      </div>
    </div>
  );
}

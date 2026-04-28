import { useState } from "react";
import "./ToyotaPartsApp.css";

// ── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_PARTS = [
  {
    id: "TOY-0421",
    name: "Oil Filter",
    category: "Engine",
    price: 12.99,
    stock: 48,
    location: "A-12",
    compatibleModels: "Camry, Corolla, RAV4",
    description: "OEM Toyota oil filter for 4-cylinder engines.",
  },
  {
    id: "TOY-1187",
    name: "Brake Pad Set (Front)",
    category: "Brakes",
    price: 54.99,
    stock: 22,
    location: "B-04",
    compatibleModels: "Camry 2018-2024, Avalon",
    description: "Ceramic front brake pads, low-dust formula.",
  },
  {
    id: "TOY-2034",
    name: "Air Filter",
    category: "Engine",
    price: 19.49,
    stock: 5,
    location: "A-09",
    compatibleModels: "Tacoma, Tundra, 4Runner",
    description: "High-flow OEM air filter for V6 engines.",
  },
  {
    id: "TOY-3310",
    name: "Cabin Air Filter",
    category: "HVAC",
    price: 21.99,
    stock: 31,
    location: "C-01",
    compatibleModels: "Prius, Corolla, Yaris",
    description: "Activated carbon cabin air filter.",
  },
  {
    id: "TOY-4455",
    name: "Spark Plug (x4)",
    category: "Ignition",
    price: 38.0,
    stock: 0,
    location: "A-17",
    compatibleModels: "Corolla 2015-2022",
    description: "Iridium spark plugs, set of 4.",
  },
  {
    id: "TOY-5520",
    name: "Transmission Fluid",
    category: "Fluids",
    price: 16.75,
    stock: 14,
    location: "D-03",
    compatibleModels: "All models (ATF WS)",
    description: "Toyota WS automatic transmission fluid, 1 qt.",
  },
  {
    id: "TOY-6601",
    name: "Wiper Blade (Driver)",
    category: "Exterior",
    price: 28.5,
    stock: 60,
    location: "E-08",
    compatibleModels: "Camry, RAV4, Highlander",
    description: "OEM beam wiper blade, 26-inch.",
  },
  {
    id: "TOY-7788",
    name: "Rear Shock Absorber",
    category: "Suspension",
    price: 89.99,
    stock: 8,
    location: "B-11",
    compatibleModels: "Tacoma 2016-2023",
    description: "KYB Gas-a-Just rear shock absorber.",
  },
];

const CATEGORIES = [
  "All",
  "Engine",
  "Brakes",
  "HVAC",
  "Ignition",
  "Fluids",
  "Exterior",
  "Suspension",
];

// ── Icons (inline SVG) ───────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle
      cx="11"
      cy="11"
      r="8"
    />
    <line
      x1="21"
      y1="21"
      x2="16.65"
      y2="16.65"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const BackIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line
      x1="19"
      y1="12"
      x2="5"
      y2="12"
    />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const LockIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect
      x="3"
      y="11"
      width="18"
      height="11"
      rx="2"
      ry="2"
    />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle
      cx="12"
      cy="7"
      r="4"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CartIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle
      cx="9"
      cy="21"
      r="1"
    />
    <circle
      cx="20"
      cy="21"
      r="1"
    />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

// ── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [screen, setScreen] = useState("signin");
  const [workerId, setWorkerId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [form, setForm] = useState({
    name: "",
    workerId: "",
    password: "",
    confirm: "",
    role: "employee",
  });
  const [error, setError] = useState("");
  const [signupError, setSignupError] = useState("");

  const handleLogin = () => {
    if (!workerId.trim() || !password.trim()) {
      setError("Please enter your Worker ID and password.");
      return;
    }
    onLogin({ name: workerId, role });
  };

  const handleSignup = () => {
    if (!form.name || !form.workerId || !form.password || !form.confirm) {
      setSignupError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setSignupError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setSignupError("Password must be at least 6 characters.");
      return;
    }
    setScreen("success");
  };

  if (screen === "success")
    return (
      <div className="loginWrap">
        <div className="loginCard">
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div className="successRing">
              <CheckIcon />
            </div>
            <h2
              className="loginTitle"
              style={{ marginBottom: 6 }}
            >
              Account created!
            </h2>
            <p style={{ color: "#7a7f94", fontSize: 14, marginBottom: 24 }}>
              Welcome, {form.name}! Your {form.role} account ({form.workerId})
              is ready.
            </p>
            <button
              className="loginBtn"
              onClick={() => setScreen("signin")}
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );

  if (screen === "signup")
    return (
      <div className="loginWrap">
        <div className="loginCard">
          <button
            className="backLink"
            onClick={() => setScreen("signin")}
          >
            <BackIcon /> <span style={{ marginLeft: 6 }}>Back to sign in</span>
          </button>
          <h1
            className="loginTitle"
            style={{ textAlign: "left", marginBottom: 4 }}
          >
            Create account
          </h1>
          <p
            className="loginSubtitle"
            style={{ textAlign: "left", marginBottom: 24 }}
          >
            Umansky Toyota — Parts Dept.
          </p>

          <div className="loginForm">
            <label className="label">Full Name</label>
            <input
              className="input"
              placeholder="First and last name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />

            <label
              className="label"
              style={{ marginTop: 16 }}
            >
              Worker ID
            </label>
            <input
              className="input"
              placeholder="e.g. EMP-1042"
              value={form.workerId}
              onChange={(e) =>
                setForm((f) => ({ ...f, workerId: e.target.value }))
              }
            />

            <label
              className="label"
              style={{ marginTop: 16 }}
            >
              Password
            </label>
            <input
              className="input"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
            />

            <label
              className="label"
              style={{ marginTop: 16 }}
            >
              Confirm Password
            </label>
            <input
              className="input"
              type="password"
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={(e) =>
                setForm((f) => ({ ...f, confirm: e.target.value }))
              }
            />

            <label
              className="label"
              style={{ marginTop: 16 }}
            >
              Role
            </label>
            <div className="roleRow">
              {["employee", "manager"].map((r) => (
                <button
                  key={r}
                  className={`roleBtn ${form.role === r ? "active" : ""}`}
                  onClick={() => setForm((f) => ({ ...f, role: r }))}
                >
                  {r === "manager" ? <LockIcon /> : <UserIcon />}
                  <span style={{ marginLeft: 6, textTransform: "capitalize" }}>
                    {r}
                  </span>
                </button>
              ))}
            </div>

            {signupError && <p className="errorMsg">{signupError}</p>}
            <button
              className="loginBtn"
              onClick={handleSignup}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="loginWrap">
      <div className="loginCard">
        <div className="loginLogo">
          <img
            src="/ToyotaLogo.png"
            alt="Toyota"
            style={{ width: 56, height: 56, objectFit: "contain" }}
          />
        </div>
        <h1 className="loginTitle">Umansky Toyota</h1>
        <p className="loginSubtitle">Parts Department System</p>

        <div className="loginForm">
          <label className="label">Worker ID</label>
          <input
            className="input"
            placeholder="e.g. EMP-1042"
            value={workerId}
            onChange={(e) => {
              setWorkerId(e.target.value);
              setError("");
            }}
          />

          <label
            className="label"
            style={{ marginTop: 16 }}
          >
            Password
          </label>
          <input
            className="input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <label
            className="label"
            style={{ marginTop: 18 }}
          >
            Sign in as
          </label>
          <div className="roleRow">
            {["employee", "manager"].map((r) => (
              <button
                key={r}
                className={`roleBtn ${role === r ? "active" : ""}`}
                onClick={() => setRole(r)}
              >
                {r === "manager" ? <LockIcon /> : <UserIcon />}
                <span style={{ marginLeft: 6, textTransform: "capitalize" }}>
                  {r}
                </span>
              </button>
            ))}
          </div>

          {error && <p className="errorMsg">{error}</p>}
          <button
            className="loginBtn"
            onClick={handleLogin}
          >
            Sign In
          </button>

          <div className="divider">
            <hr className="dividerLine" />
            <span className="dividerText">or</span>
            <hr className="dividerLine" />
          </div>
          <button
            className="ghostBtn"
            onClick={() => setScreen("signup")}
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Header ───────────────────────────────────────────────────────────────────
function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="headerLeft">
        <img
          src="/ToyotaLogo.png"
          alt="Toyota"
          style={{ width: 34, height: 34, objectFit: "contain" }}
        />
        <div>
          <div className="headerTitle">Umansky Toyota</div>
          <div className="headerSub">Parts Department</div>
        </div>
      </div>
      <div className="headerRight">
        <div className="userBadge">
          <div
            className={`rolePill ${user.role === "manager" ? "rolePillManager" : ""}`}
          >
            {user.role === "manager" ? <LockIcon /> : <UserIcon />}
            <span style={{ marginLeft: 4, textTransform: "capitalize" }}>
              {user.role}
            </span>
          </div>
          <span className="userName">{user.name}</span>
        </div>
        <button
          className="logoutBtn"
          onClick={onLogout}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

// ── Part Detail ───────────────────────────────────────────────────────────────
function PartDetail({ part, user, onBack, onSave, onAddToCart }) {
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

// ── Detail Field ──────────────────────────────────────────────────────────────
function DetailField({ label, value }) {
  return (
    <div className="fieldBlock">
      <div className="fieldLabel">{label}</div>
      <div className="fieldValue">{value}</div>
    </div>
  );
}

// ── Parts Search ──────────────────────────────────────────────────────────────
function PartsSearch({ user, parts, onSelectPart, onAddToCart }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const [qtyMap, setQtyMap] = useState({});

  const getQty = (id) => qtyMap[id] || 1;

  const handleAddToCart = (p) => {
    onAddToCart(p, getQty(p.id));
    setQtyMap((prev) => ({ ...prev, [p.id]: 1 }));
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
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

//Cart Modal
function CartModal({ cart, onClose, onRemove, onUpdateQty, user }) {
  const total = cart.reduce((sum, i) => sum + parseFloat(i.price) * i.qty, 0);
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrint = () => window.print();

  return (
    <div
      className="modalOverlay"
      onClick={onClose}
    >
      <div
        className="modalCard"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modalHeader">
          <div>
            <h2 className="modalTitle">Quote Cart</h2>
            <p className="modalSub">
              {cart.length} item{cart.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            className="modalClose"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cartEmpty">
            <CartIcon />
            <p>Your cart is empty.</p>
            <p style={{ fontSize: 13 }}>
              Add parts from the search or part detail page.
            </p>
          </div>
        ) : (
          <>
            <div className="cartItems">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="cartItem"
                >
                  <div className="cartItemInfo">
                    <span className="cartItemId">{item.id}</span>
                    <span className="cartItemName">{item.name}</span>
                    <span className="cartItemLocation">
                      Bin: {item.location}
                    </span>
                  </div>
                  <div className="cartItemControls">
                    <div className="qtyRow">
                      <button
                        className="qtyBtn"
                        onClick={() => onUpdateQty(item.id, item.qty - 1)}
                      >
                        −
                      </button>
                      <span className="qtyVal">{item.qty}</span>
                      <button
                        className="qtyBtn"
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <span className="cartItemPrice">
                      ${(parseFloat(item.price) * item.qty).toFixed(2)}
                    </span>
                    <button
                      className="removeBtn"
                      onClick={() => onRemove(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cartTotal">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {/* Print-only quote */}
            <div className="printQuote">
              <div className="printHeader">
                <h2>Umansky Toyota — Parts Department</h2>
                <p>Quote generated: {date}</p>
                <p>
                  Prepared by: {user.name} ({user.role})
                </p>
              </div>
              <table className="printTable">
                <thead>
                  <tr>
                    <th>Part #</th>
                    <th>Name</th>
                    <th>Bin</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.location}</td>
                      <td>{item.qty}</td>
                      <td>${parseFloat(item.price).toFixed(2)}</td>
                      <td>${(parseFloat(item.price) * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5">
                      <strong>Total</strong>
                    </td>
                    <td>
                      <strong>${total.toFixed(2)}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="cartActions">
              <button
                className="clearCartBtn"
                onClick={() => cart.forEach((i) => onRemove(i.id))}
              >
                Clear Cart
              </button>
              <button
                className="printBtn"
                onClick={handlePrint}
              >
                Print Quote
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

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
            user={user}
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

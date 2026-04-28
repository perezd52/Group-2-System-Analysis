import { LockIcon, UserIcon } from "./Icons";

// ── Header ───────────────────────────────────────────────────────────────────
export default function Header({ user, onLogout }) {
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

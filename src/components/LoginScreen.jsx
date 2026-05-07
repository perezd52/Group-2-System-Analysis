import { useState } from "react";
import { supabase } from "../utils/supabase";
import { BackIcon, CheckIcon, LockIcon, UserIcon } from "./Icons";

const workerIdToEmail = (workerId) =>
  `${workerId.trim().toLowerCase()}@umanskytoyota.com`;

// ── Login Screen ─────────────────────────────────────────────────────────────
export default function LoginScreen({ onLogin }) {
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

  const handleLogin = async () => {
    if (!workerId.trim() || !password.trim()) {
      setError("Please enter your Worker ID and password.");
      return;
    }

    const email = workerIdToEmail(workerId);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message || "Sign in failed.");
      return;
    }

    const roleFromMeta = data?.user?.user_metadata?.role || "employee";
    const nameFromMeta = data?.user?.user_metadata?.name || workerId;

    onLogin({
      name: nameFromMeta,
      workerId,
      role: roleFromMeta,
      email,
    });
  };

  const handleSignup = async () => {
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

    const email = workerIdToEmail(form.workerId);

    const { error: signupErr } = await supabase.auth.signUp({
      email,
      password: form.password,
      options: {
        data: {
          name: form.name,
          workerId: form.workerId,
          role: form.role,
        },
      },
    });

    if (signupErr) {
      setSignupError(signupErr.message || "Signup failed.");
      return;
    }

    setSignupError("");
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

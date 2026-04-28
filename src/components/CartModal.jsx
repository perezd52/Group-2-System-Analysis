import { CartIcon } from "./Icons";

//Cart Modal
export default function CartModal({ cart, onClose, onRemove, onUpdateQty, user }) {
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

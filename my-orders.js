const qs = selector => document.querySelector(selector);
const money = value => `$${Number(value || 0).toLocaleString("zh-TW")}`;

function normalizeName_(name) {
  return String(name || "").trim().toLowerCase().replace(/\s+/g, "");
}

function getAvailable(order) {
  if (!order.paid) return 0;
  return Math.max(0, Number(order.purchased || 0) - Number(order.pending || 0) - Number(order.used || 0) - Number(order.refunded || 0));
}

function orderGrandTotal(order) {
  if (order.grandTotal !== undefined && order.grandTotal !== null && order.grandTotal !== "") return Number(order.grandTotal);
  return Math.max(0, Number(order.total || 0) + (order.addOns || []).reduce((sum, item) => sum + Number(item.price || 0), 0) - Number(order.discountAmount || 0));
}

function showToast(message) {
  const toast = qs("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function renderMatchedOrders(matchedOrders) {
  const listEl = qs("#orders-list");
  listEl.innerHTML = matchedOrders.length ? matchedOrders.map(order => {
    const available = getAvailable(order);
    return `<article class="order-card">
      <div class="order-head">
        <div><small>${order.id}</small><h3>${order.projectId || ""}｜${order.title || order.projectOriginal || ""}</h3><p>✈ ${order.route || ""}</p></div>
        <span class="status-pill">${order.paymentStatus || order.status || ""}</span>
      </div>
      <div class="order-content">
        <div>
          <div class="credit-stats">
            <div><small>購買</small><strong>${order.purchased ?? 0}</strong></div>
            <div><small>處理中</small><strong>${order.pending ?? 0}</strong></div>
            <div><small>已出票</small><strong>${order.used ?? 0}</strong></div>
            <div class="available"><small>可使用</small><strong>${available}</strong></div>
          </div>
        </div>
        <aside class="order-side">
          <div class="expiry-box"><small>訂單金額</small><strong>${money(orderGrandTotal(order))}</strong></div>
          <div class="expiry-box"><small>使用期限</small><strong>${order.expiry || "－"}</strong></div>
          <button class="redeem-btn" data-redeem-order="${order.id}" ${available === 0 && order.paid ? "disabled" : ""}>${order.paid ? "申請使用／出票" : "付款確認後即可使用"}</button>
        </aside>
      </div>
    </article>`;
  }).join("") : `<div class="empty-state">查無符合的訂單，請確認 LINE 名稱是否與預訂時填寫的一致，或聯繫客服協助核對。</div>`;

  const summaryAvailable = matchedOrders.reduce((sum, order) => sum + getAvailable(order), 0);
  const summaryReserved = matchedOrders.filter(order => !order.paid).reduce((sum, order) => sum + Number(order.purchased || 0), 0);
  const summaryPending = matchedOrders.reduce((sum, order) => sum + Number(order.pending || 0), 0);
  const summaryUsed = matchedOrders.reduce((sum, order) => sum + Number(order.used || 0), 0);
  qs("#summary-available").textContent = summaryAvailable;
  qs("#summary-reserved").textContent = summaryReserved;
  qs("#summary-pending").textContent = summaryPending;
  qs("#summary-used").textContent = summaryUsed;
}

async function runLookup(rawInput) {
  const statusEl = qs("#lookup-status");
  const resultEl = qs("#lookup-result");
  const input = normalizeName_(rawInput);
  if (!input) return;

  statusEl.style.display = "block";
  resultEl.style.display = "none";
  statusEl.textContent = "查詢中，請稍候…";

  if (window.PMRStore) {
    await window.PMRStore.syncFromSheet();
  }

  const orders = window.PMRStore ? window.PMRStore.getOrders() : [];
  const matched = orders.filter(order => {
    return normalizeName_(order.lineDisplayName) === input || normalizeName_(order.customerName) === input;
  });

  statusEl.style.display = "none";
  resultEl.style.display = "block";
  renderMatchedOrders(matched);
}

qs("#lookup-form").addEventListener("submit", event => {
  event.preventDefault();
  runLookup(qs("#lookup-input").value);
});

document.addEventListener("click", event => {
  const redeemButton = event.target.closest("[data-redeem-order]");
  if (redeemButton) {
    window.open("https://meiching23.github.io/ticket-registration/?v=5", "_blank", "noopener");
  }
});

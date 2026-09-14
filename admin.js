let orders = window.PMRStore.getOrders();
let projects = window.PMRStore.getProjects();
let customers = window.PMRStore.getCustomers();
let selectedOrderId = null;
let selectedCustomerId = null;
const today = "2026-09-13";

const qs = selector => document.querySelector(selector);
const qsa = selector => [...document.querySelectorAll(selector)];
const money = value => `$${Number(value || 0).toLocaleString("zh-TW")}`;
const numberValue = value => Number(value || 0);
const available = order => Math.max(0, numberValue(order.purchased) - numberValue(order.pending) - numberValue(order.used) - numberValue(order.refunded));
const addOnSale = order => (order.addOns || []).reduce((sum, item) => sum + numberValue(item.price), 0);
const addOnCost = order => (order.addOns || []).reduce((sum, item) => sum + numberValue(item.cost), 0);
const grandTotal = order => Number.isFinite(Number(order.grandTotal)) ? numberValue(order.grandTotal) : numberValue(order.total) + addOnSale(order);

function stageFor(order) {
  if (["等待客服確認", "等待付款"].includes(order.status)) return order.status;
  if (["準備出票", "已完成"].includes(order.status)) return order.status;
  return "補件處理中";
}

function statusClass(order) {
  return ["等待客服確認", "等待付款"].includes(order.status) ? "waiting" : "";
}

function renderKpis() {
  qs("#kpi-followups").textContent = orders.filter(order => order.nextActionDate && order.nextActionDate <= today && order.status !== "已完成").length;
  qs("#kpi-payments").textContent = orders.filter(order => order.paymentStatus !== "已確認" && !["已退款"].includes(order.paymentStatus)).length;
  qs("#kpi-docs").textContent = orders.filter(order => order.paid && order.docsStatus !== "資料已齊" && order.status !== "已完成").length;
  qs("#kpi-ticketing").textContent = orders.filter(order => ["準備出票"].includes(order.status) || order.ticketStatus === "準備出票").length;
  qs("#nav-order-count").textContent = orders.length;
  qs("#nav-customer-count").textContent = customers.filter(customer => customer.status !== "已刪除").length;
}

function renderCustomers() {
  const keyword = qs("#customer-search").value.trim().toLowerCase();
  const filter = qs("#customer-filter").value;
  const visible = customers.filter(customer => {
    const haystack = `${customer.id} ${customer.realName} ${customer.displayName} ${customer.lineUserId} ${customer.phone}`.toLowerCase();
    return (!keyword || haystack.includes(keyword)) && (filter === "all" || customer.status === filter);
  });
  qs("#customers-table").innerHTML = visible.map(customer => {
    const customerOrders = orders.filter(order => order.customerId === customer.id);
    const credits = customerOrders.reduce((sum, order) => sum + available(order), 0);
    return `<tr data-customer-id="${customer.id}"><td><strong>${customer.realName || "已匿名化"}</strong><small>${customer.id}</small></td><td><strong>${customer.displayName || "未綁定"}</strong><small>${customer.lineUserId || "沒有有效 LINE ID"}</small></td><td><strong>${customer.phone || "—"}</strong><small>${customer.note || "無備註"}</small></td><td class="credit-cell"><b>${customerOrders.length}</b> 筆訂單<small>${credits} 張可用</small></td><td><span class="cell-status ${customer.status === "正常" ? "" : "waiting"}">${customer.status}</span></td><td><strong>${customer.linkedAt || "—"}</strong><small>${customer.previousLineIds?.length || 0} 個歷史帳號</small></td></tr>`;
  }).join("") || `<tr><td colspan="6"><strong>找不到符合條件的客戶</strong></td></tr>`;
}

function orderFinancial(order) {
  const recognized = order.paymentStatus === "已確認";
  if (!recognized) return { revenue: 0, cost: 0, service: 0, addOnSale: 0, addOnCost: 0, addOnMargin: 0, intro: 0, source: 0, gross: 0, unallocated: 0 };
  const extrasSale = addOnSale(order);
  const extrasCost = addOnCost(order);
  const hasRecordedGrandTotal = Number.isFinite(Number(order.grandTotal));
  const recordedPayment = numberValue(order.paymentAmount);
  const revenue = recordedPayment ? recordedPayment + (hasRecordedGrandTotal ? 0 : extrasSale) : grandTotal(order);
  const cost = numberValue(order.cost);
  const service = numberValue(order.serviceFee);
  const intro = numberValue(order.introducerProfit);
  const source = numberValue(order.sourceProfit);
  const addOnMargin = extrasSale - extrasCost;
  const gross = revenue - cost - service - extrasCost;
  return { revenue, cost, service, addOnSale: extrasSale, addOnCost: extrasCost, addOnMargin, intro, source, gross, unallocated: gross - intro - source };
}

function groupAmounts(rows, keyGetter, valueGetter) {
  return rows.reduce((result, row) => {
    const key = keyGetter(row);
    const value = valueGetter(row);
    if (key && value) result[key] = (result[key] || 0) + value;
    return result;
  }, {});
}

function renderReports() {
  const month = qs("#report-month").value;
  const monthOrders = orders.filter(order => (order.createdAt || "").replaceAll("/", "-").slice(0, 7) === month);
  const paidOrders = monthOrders.filter(order => order.paymentStatus === "已確認");
  const financials = paidOrders.map(order => ({ order, values: orderFinancial(order) }));
  const totals = financials.reduce((sum, row) => Object.fromEntries(Object.keys(sum).map(key => [key, sum[key] + row.values[key]])), { revenue: 0, cost: 0, service: 0, addOnSale: 0, addOnCost: 0, addOnMargin: 0, intro: 0, source: 0, gross: 0, unallocated: 0 });
  qs("#report-kpis").innerHTML = [
    ["已確認實收", totals.revenue], ["機票與專案成本", totals.cost], ["客服應付", totals.service], ["本月毛利", totals.gross]
  ].map(([label, value]) => `<article><span>${label}</span><strong>${money(value)}</strong><small>${paidOrders.length} 筆已確認訂單</small></article>`).join("");

  const staff = groupAmounts(financials, row => row.order.assignedTo, row => row.values.service);
  const introducers = groupAmounts(financials, row => row.order.introducer, row => row.values.intro);
  const payoutRows = [
    ...Object.entries(staff).map(([name, amount]) => [name, "客服費", amount]),
    ...Object.entries(introducers).map(([name, amount]) => [name, "介紹人分潤", amount]),
    ...(totals.source ? [["傑評／資源方", "資源方分潤", totals.source]] : [])
  ];
  qs("#payout-summary").innerHTML = payoutRows.map(([name, type, amount]) => `<div><span><strong>${name}</strong><small>${type}</small></span><b>${money(amount)}</b></div>`).join("") || `<p>這個月份尚無應付資料。</p>`;
  qs("#profit-summary").innerHTML = [
    ["已確認實收", totals.revenue], ["方案成本", -totals.cost], ["客服費", -totals.service], ["加購收入", totals.addOnSale], ["加購成本", -totals.addOnCost], ["介紹人分潤", -totals.intro], ["資源方分潤", -totals.source], ["未分配差額", totals.unallocated]
  ].map(([label, value], index, all) => `<div class="${index === all.length - 1 ? "is-total" : ""}"><span>${label}</span><strong>${value < 0 ? `(${money(Math.abs(value))})` : money(value)}</strong></div>`).join("");
  qs("#report-order-count").textContent = `${monthOrders.length} 筆訂單，${paidOrders.length} 筆計入結算`;
  qs("#report-orders-table").innerHTML = monthOrders.map(order => {
    const values = orderFinancial(order);
    const excluded = order.paymentStatus !== "已確認";
    return `<tr data-order-id="${order.id}" class="${excluded ? "is-excluded" : ""}"><td><strong>${order.id}</strong><small>${order.lineDisplayName || order.customerName}・${excluded ? "未計入" : "已計入"}</small></td><td>${money(values.revenue)}</td><td>${money(values.cost)}</td><td>${money(values.service)}</td><td>${money(values.addOnMargin)}</td><td>${money(values.intro)}</td><td>${money(values.source)}</td><td><strong>${money(values.unallocated)}</strong></td></tr>`;
  }).join("") || `<tr><td colspan="8"><strong>這個月份尚無訂單</strong></td></tr>`;
}

function renderPipeline() {
  const stages = ["等待客服確認", "等待付款", "補件處理中", "準備出票"];
  qs("#pipeline").innerHTML = stages.map(stage => {
    const stageOrders = orders.filter(order => stageFor(order) === stage);
    return `<div class="pipeline-column"><div class="pipeline-title"><span>${stage}</span><b>${stageOrders.length}</b></div>${stageOrders.map(order => `<div class="pipeline-card" data-order-id="${order.id}"><strong>${order.lineDisplayName || order.customerName}</strong><span>${order.projectId}・${order.id.slice(-3)}</span></div>`).join("") || `<div class="pipeline-card"><span>目前沒有訂單</span></div>`}</div>`;
  }).join("");
}

function renderPriority() {
  const sorted = [...orders].filter(order => order.status !== "已完成").sort((a, b) => (a.nextActionDate || "9999").localeCompare(b.nextActionDate || "9999")).slice(0, 5);
  qs("#priority-list").innerHTML = sorted.map(order => `<div class="priority-item" data-order-id="${order.id}"><b>${(order.lineDisplayName || order.customerName || "客").slice(0, 1)}</b><div><strong>${order.lineDisplayName || order.customerName}・${order.status}</strong><span>${order.nextActionDate || "未排日期"}｜${order.assignedTo || "待分派"}</span></div></div>`).join("");
}

function renderOrders() {
  const keyword = qs("#order-search").value.trim().toLowerCase();
  const filter = qs("#order-filter").value;
  const visible = orders.filter(order => {
    const haystack = `${order.id} ${order.lineDisplayName} ${order.customerName} ${order.phone} ${order.projectId} ${order.title}`.toLowerCase();
    return (!keyword || haystack.includes(keyword)) && (filter === "all" || order.status === filter);
  });
  qs("#orders-table").innerHTML = visible.map(order => `<tr data-order-id="${order.id}">
    <td><strong>${order.lineDisplayName || order.customerName}</strong><small>${order.id}</small></td>
    <td><strong>${order.projectId}</strong><small>${order.title}</small></td>
    <td><span class="cell-status ${statusClass(order)}">${order.paymentStatus}</span><small>${money(order.paymentAmount)} / ${money(grandTotal(order))}</small></td>
    <td class="credit-cell"><b>${available(order)}</b> 可用<small>購 ${order.purchased}・處理 ${order.pending}・已用 ${order.used}</small></td>
    <td><strong>${order.docsStatus}</strong><small>${order.ticketStatus}</small></td>
    <td><strong>${order.assignedTo || "待分派"}</strong><small>${order.introducer ? `介紹：${order.introducer}` : "無介紹人"}</small></td>
    <td><strong>${order.nextActionDate || "未排日期"}</strong><small><span class="cell-status ${statusClass(order)}">${order.status}</span></small></td>
  </tr>`).join("") || `<tr><td colspan="7"><strong>找不到符合條件的訂單</strong></td></tr>`;
}

function renderProjects() {
  qs("#project-count").textContent = projects.length;
  qs("#project-stock").textContent = projects.reduce((sum, project) => sum + numberValue(project.stock), 0);
  qs("#projects-table").innerHTML = projects.map(project => `<tr data-project-id="${project.id}">
    <td><strong>${project.id}｜${project.title}</strong><small>${project.route}</small></td>
    <td><select class="inline-select" data-project-field="status"><option ${project.status === "公開" ? "selected" : ""}>公開</option><option ${project.status === "代碼限定" ? "selected" : ""}>代碼限定</option><option ${project.status === "下架" ? "selected" : ""}>下架</option></select></td>
    <td><div class="money-inputs"><label>售<input class="inline-input" data-project-field="price" type="number" value="${project.price}"></label><label>本<input class="inline-input" data-project-field="unitCost" type="number" value="${project.unitCost}"></label></div></td>
    <td><div class="money-inputs"><label>售<input class="inline-input" data-project-field="businessPrice" type="number" value="${project.businessPrice || 0}"></label><label>本<input class="inline-input" data-project-field="businessCost" type="number" value="${project.businessCost || 0}"></label></div></td>
    <td><input class="inline-input small" data-project-field="credits" type="number" value="${project.credits}"></td>
    <td><input class="inline-input small" data-project-field="stock" type="number" value="${project.stock}"></td>
    <td><input class="inline-input date" data-project-field="expiry" value="${project.expiry}"></td>
    <td><textarea class="inline-textarea" data-project-field="special">${project.special}</textarea><button class="save-row" data-save-project="${project.id}">儲存</button></td>
  </tr>`).join("");
}

function renderAll() {
  renderKpis();
  renderPipeline();
  renderPriority();
  renderOrders();
  renderCustomers();
  renderProjects();
  renderReports();
}

function switchView(view) {
  qsa(".ops-view").forEach(panel => panel.classList.toggle("is-active", panel.id === `${view}-view`));
  qsa("[data-view]").forEach(button => button.classList.toggle("is-active", button.dataset.view === view));
  const titles = { dashboard: "今天的營運狀態", orders: "訂單管理", customers: "客戶管理", projects: "專案管理", reports: "月報與分潤", integrations: "串接中心" };
  qs("#page-title").textContent = titles[view];
  qs(".sidebar").classList.remove("is-open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function populateOrderForm(order) {
  selectedOrderId = order.id;
  const form = qs("#order-form");
  qs("#drawer-order-id").textContent = order.id;
  qs("#drawer-customer").innerHTML = `<span class="customer-avatar">${(order.lineDisplayName || order.customerName || "客").slice(0, 1)}</span><div><strong>${order.lineDisplayName || "尚未綁定 LINE"}・${order.customerName || "未填姓名"}</strong><small>${order.phone || "未填電話"}｜${order.projectId} ${order.title}</small></div>`;
  const fields = ["status", "assignedTo", "paymentStatus", "docsStatus", "ticketStatus", "nextActionDate", "purchased", "pending", "used", "refunded", "total", "grandTotal", "paymentAmount", "cost", "serviceFee", "introducer", "introducerProfit", "sourceProfit", "internalNotes"];
  fields.forEach(name => { if (form.elements[name]) form.elements[name].value = order[name] ?? ""; });
  form.elements.grandTotal.value = grandTotal(order);
  form.elements.grandTotal.readOnly = true;
  const tickets = order.ticketSelections || [];
  const businessCount = tickets.filter(ticket => ticket.cabin === "business").length;
  const starluxCount = tickets.filter(ticket => ticket.starlux).length;
  qs("#ticket-selection-summary").innerHTML = tickets.length
    ? `<span>經濟艙 ${tickets.length - businessCount} 張</span><span>商務艙 ${businessCount} 張</span><span>指定星宇 ${starluxCount} 張</span>`
    : `<span>舊訂單：尚無逐張選項資料</span>`;
  const checkoutAddOns = (order.addOns || []).map((item, index) => ({ item, index })).filter(({ item }) => item.source === "checkout");
  qs("#checkout-addons-editor").innerHTML = checkoutAddOns.length
    ? checkoutAddOns.map(({ item, index }) => `<div class="checkout-addon-row"><span><strong>${item.name}</strong><small>${item.costStatus === "待客服填入" ? "請填入實際成本" : "已記錄成本"}</small></span><b>${money(item.price)}</b><label>成本<input type="number" min="0" value="${numberValue(item.cost)}" data-checkout-addon-cost="${index}"></label></div>`).join("")
    : `<div class="checkout-addons-empty">這筆訂單沒有由客戶勾選的加購。</div>`;
  const addOn = (order.addOns || []).find(item => item.source !== "checkout") || {};
  form.elements.addOnName.value = addOn.name || "";
  form.elements.addOnPrice.value = addOn.price || 0;
  form.elements.addOnCost.value = addOn.cost || 0;
  qs("#drawer-activity").innerHTML = (order.activity || []).slice().reverse().map(item => `<div>${item.text}<small>${item.at}</small></div>`).join("") || `<div>尚無操作紀錄</div>`;
  updateProfitPreview();
}

function updateProfitPreview() {
  const form = qs("#order-form");
  const checkoutCosts = qsa("[data-checkout-addon-cost]").reduce((sum, input) => sum + numberValue(input.value), 0);
  const manualSale = numberValue(form.elements.addOnPrice.value);
  const manualCost = numberValue(form.elements.addOnCost.value);
  const calculatedGrandTotal = numberValue(form.elements.total.value)
    + (orders.find(item => item.id === selectedOrderId)?.addOns || []).filter(item => item.source === "checkout").reduce((sum, item) => sum + numberValue(item.price), 0)
    + manualSale;
  form.elements.grandTotal.value = calculatedGrandTotal;
  const revenue = numberValue(form.elements.paymentAmount.value) || numberValue(form.elements.grandTotal.value);
  const cost = numberValue(form.elements.cost.value);
  const service = numberValue(form.elements.serviceFee.value);
  const gross = revenue - cost - service - checkoutCosts - manualCost;
  const allocated = numberValue(form.elements.introducerProfit.value) + numberValue(form.elements.sourceProfit.value);
  const gap = gross - allocated;
  qs("#profit-preview").innerHTML = `<div><small>訂單毛利</small><strong>${money(gross)}</strong></div><div><small>已分配</small><strong>${money(allocated)}</strong></div><div class="${gap >= 0 ? "positive" : ""}"><small>尚未分配／差額</small><strong>${money(gap)}</strong></div>`;
}

function openOrder(orderId) {
  const order = orders.find(item => item.id === orderId);
  if (!order) return;
  populateOrderForm(order);
  qs("#order-drawer").classList.add("is-open");
  qs("#drawer-backdrop").classList.add("is-open");
  qs("#order-drawer").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeOrder() {
  qs("#order-drawer").classList.remove("is-open");
  qs("#drawer-backdrop").classList.remove("is-open");
  qs("#order-drawer").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function populateCustomerForm(customer) {
  selectedCustomerId = customer.id;
  const form = qs("#customer-form");
  qs("#drawer-customer-id").textContent = `${customer.id}｜${customer.realName || "已匿名化"}`;
  ["realName", "phone", "displayName", "status", "lineUserId", "note"].forEach(name => { form.elements[name].value = customer[name] ?? ""; });
  qs("#previous-line-ids").innerHTML = customer.previousLineIds?.length ? `<strong>歷史 LINE ID</strong>${customer.previousLineIds.map(id => `<span>${id}</span>`).join("")}` : `<small>尚無換綁紀錄</small>`;
}

function openCustomer(customerId) {
  const customer = customers.find(item => item.id === customerId);
  if (!customer) return;
  populateCustomerForm(customer);
  qs("#customer-drawer").classList.add("is-open");
  qs("#drawer-backdrop").classList.add("is-open");
  qs("#customer-drawer").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCustomer() {
  qs("#customer-drawer").classList.remove("is-open");
  qs("#drawer-backdrop").classList.remove("is-open");
  qs("#customer-drawer").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function syncCustomerToOrders(customer) {
  orders.filter(order => order.customerId === customer.id).forEach(order => {
    order.lineUserId = customer.lineUserId;
    order.lineDisplayName = customer.displayName;
    order.customerName = customer.realName;
    order.phone = customer.phone;
  });
  window.PMRStore.saveOrders(orders);
}

function saveCustomer(event) {
  event.preventDefault();
  const customer = customers.find(item => item.id === selectedCustomerId);
  if (!customer) return;
  const form = event.currentTarget;
  const oldLineId = customer.lineUserId;
  const newLineId = form.elements.lineUserId.value.trim();
  ["realName", "phone", "displayName", "status", "note"].forEach(name => { customer[name] = form.elements[name].value.trim(); });
  if (newLineId !== oldLineId) {
    customer.previousLineIds = [...new Set([...(customer.previousLineIds || []), oldLineId].filter(Boolean))];
    customer.lineUserId = newLineId;
    customer.status = "待新帳號驗證";
    customer.linkedAt = new Date().toLocaleDateString("zh-TW");
  }
  window.PMRStore.saveCustomers(customers);
  syncCustomerToOrders(customer);
  renderAll();
  closeCustomer();
  toast(newLineId !== oldLineId ? "已保留舊 LINE 紀錄，新帳號等待驗證" : "客戶資料已儲存");
}

function createCustomer() {
  const number = Math.max(0, ...customers.map(customer => Number(customer.id.replace(/\D/g, "")) || 0)) + 1;
  const customer = { id: `CUS-${String(number).padStart(4, "0")}`, realName: "", displayName: "新客戶", lineUserId: "", phone: "", status: "待新帳號驗證", linkedAt: "", previousLineIds: [], note: "" };
  customers.unshift(customer);
  window.PMRStore.saveCustomers(customers);
  renderAll();
  openCustomer(customer.id);
}

function archiveCustomer() {
  const customer = customers.find(item => item.id === selectedCustomerId);
  if (!customer) return;
  customer.status = "已封存";
  window.PMRStore.saveCustomers(customers);
  renderAll();
  closeCustomer();
  toast("客戶已封存，歷史訂單與額度仍保留");
}

function anonymizeCustomer() {
  const customer = customers.find(item => item.id === selectedCustomerId);
  if (!customer || !window.confirm("確定刪除這位客戶的個人資料？訂單與財務數字會匿名保留。")) return;
  customer.previousLineIds = [...new Set([...(customer.previousLineIds || []), customer.lineUserId].filter(Boolean))];
  customer.realName = "已刪除客戶";
  customer.displayName = "已刪除";
  customer.lineUserId = "";
  customer.phone = "";
  customer.note = "個人資料已匿名化";
  customer.status = "已刪除";
  window.PMRStore.saveCustomers(customers);
  syncCustomerToOrders(customer);
  renderAll();
  closeCustomer();
  toast("個人資料已刪除；財務與稽核紀錄已匿名保留");
}

function toast(message) {
  const element = qs("#admin-toast");
  element.textContent = message;
  element.classList.add("is-visible");
  clearTimeout(window.adminToastTimer);
  window.adminToastTimer = setTimeout(() => element.classList.remove("is-visible"), 2500);
}

function saveSelectedOrder(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const order = orders.find(item => item.id === selectedOrderId);
  if (!order) return;
  ["status", "assignedTo", "paymentStatus", "docsStatus", "ticketStatus", "nextActionDate", "introducer", "internalNotes"].forEach(name => { order[name] = form.elements[name].value; });
  ["purchased", "pending", "used", "refunded", "total", "paymentAmount", "cost", "serviceFee", "introducerProfit", "sourceProfit"].forEach(name => { order[name] = numberValue(form.elements[name].value); });
  order.paid = order.paymentStatus === "已確認";
  order.statusType = order.status === "已完成" ? "completed" : "active";
  qsa("[data-checkout-addon-cost]").forEach(input => {
    const addOn = order.addOns?.[Number(input.dataset.checkoutAddonCost)];
    if (!addOn) return;
    addOn.cost = numberValue(input.value);
    addOn.costStatus = "已填入";
  });
  const checkoutAddOns = (order.addOns || []).filter(item => item.source === "checkout");
  const manualAddOn = form.elements.addOnName.value.trim()
    ? [{ name: form.elements.addOnName.value.trim(), price: numberValue(form.elements.addOnPrice.value), cost: numberValue(form.elements.addOnCost.value), source: "manual" }]
    : [];
  order.addOns = [...checkoutAddOns, ...manualAddOn];
  order.grandTotal = order.total + addOnSale(order);
  const time = new Date().toLocaleString("zh-TW", { hour12: false });
  order.activity = [...(order.activity || []), { at: time, text: `客服更新狀態為「${order.status}」` }];
  window.PMRStore.saveOrders(orders);
  renderAll();
  closeOrder();
  toast("已儲存，客戶前台重新整理後會同步更新");
}

function createOrder() {
  const next = String(orders.length + 30).padStart(3, "0");
  const order = {
    id: `PMR-260914-${next}`, customerId: "", lineUserId: "", lineDisplayName: "新客戶", customerName: "", phone: "", projectId: "待選專案", title: "尚未選擇專案", route: "", purchased: 1, pending: 0, used: 0, refunded: 0, paid: false, paymentStatus: "待客服確認", paymentAmount: 0, total: 0, grandTotal: 0, cost: 0, serviceFee: 0, introducer: "", introducerProfit: 0, sourceProfit: 0, docsStatus: "尚未補件", ticketStatus: "尚未出票", assignedTo: "待分派", nextActionDate: "2026-09-14", expiry: "2027/12/31", status: "等待客服確認", statusType: "active", internalNotes: "", ticketSelections: [], addOns: [], createdAt: "2026/09/14", activity: [{ at: "2026/09/14", text: "客服手動建立訂單" }]
  };
  orders.unshift(order);
  window.PMRStore.saveOrders(orders);
  renderAll();
  openOrder(order.id);
}

function createProject() {
  const ids = new Set(projects.map(project => project.id));
  const letters = "DEFGHIJKLMNOPQRSTUVWXYZ";
  const id = [...letters].map(letter => `0914${letter}`).find(code => !ids.has(code)) || `0914X${projects.length}`;
  projects.unshift({ id, title: "客服私人專案", route: "指定目的地", status: "代碼限定", price: 0, businessPrice: 0, unitCost: 0, businessCost: 0, credits: 1, stock: 1, expiry: "2027/12/31", special: "請填寫此專案的完整使用條件" });
  window.PMRStore.saveProjects(projects);
  renderProjects();
  toast(`已建立 ${id}，請在表格內完成設定`);
}

function saveProject(projectId) {
  const row = qs(`[data-project-id="${projectId}"]`);
  const project = projects.find(item => item.id === projectId);
  if (!row || !project) return;
  row.querySelectorAll("[data-project-field]").forEach(input => {
    const field = input.dataset.projectField;
    project[field] = ["price", "businessPrice", "unitCost", "businessCost", "credits", "stock"].includes(field) ? numberValue(input.value) : input.value;
  });
  window.PMRStore.saveProjects(projects);
  renderProjects();
  toast(`${projectId} 已儲存（展示資料）`);
}

document.addEventListener("click", event => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) switchView(viewButton.dataset.view);
  const goButton = event.target.closest("[data-go-view]");
  if (goButton) switchView(goButton.dataset.goView);
  const orderTarget = event.target.closest("[data-order-id]");
  if (orderTarget) openOrder(orderTarget.dataset.orderId);
  const customerTarget = event.target.closest("[data-customer-id]");
  if (customerTarget) openCustomer(customerTarget.dataset.customerId);
  const saveProjectButton = event.target.closest("[data-save-project]");
  if (saveProjectButton) saveProject(saveProjectButton.dataset.saveProject);
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "close-drawer") closeOrder();
  if (action === "close-customer-drawer") closeCustomer();
  if (action === "new-order") createOrder();
  if (action === "new-customer") createCustomer();
  if (action === "archive-customer") archiveCustomer();
  if (action === "anonymize-customer") anonymizeCustomer();
  if (action === "new-project") createProject();
  if (action === "toggle-menu") qs(".sidebar").classList.toggle("is-open");
});

qs("#drawer-backdrop").addEventListener("click", () => { closeOrder(); closeCustomer(); });
qs("#order-form").addEventListener("submit", saveSelectedOrder);
qs("#customer-form").addEventListener("submit", saveCustomer);
qs("#order-form").addEventListener("input", updateProfitPreview);
qs("#order-search").addEventListener("input", renderOrders);
qs("#order-filter").addEventListener("change", renderOrders);
qs("#customer-search").addEventListener("input", renderCustomers);
qs("#customer-filter").addEventListener("change", renderCustomers);
qs("#report-month").addEventListener("change", renderReports);
document.addEventListener("keydown", event => { if (event.key === "Escape") { closeOrder(); closeCustomer(); } });

window.addEventListener("storage", event => {
  if (event.key !== window.PMRStore.keys.orders) return;
  orders = window.PMRStore.getOrders();
  renderAll();
});

window.addEventListener("storage", event => {
  if (event.key !== window.PMRStore.keys.customers) return;
  customers = window.PMRStore.getCustomers();
  renderAll();
});

renderAll();

(function () {
  const ORDERS_KEY = "pmr-demo-orders-v2";
  const PROJECTS_KEY = "pmr-demo-admin-projects-v1";
  const CUSTOMERS_KEY = "pmr-demo-customers-v1";
  const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbw53exYwFxChR-iroPiEKaCqeeKIrK1XRLqpdFskAclIXtUXUVlUVV6s7qXrUam-SJF/exec";

  const defaultOrders = [];

  const defaultProjects = [
    { id: "0914A", title: "泰國繽紛三城隨心遊", route: "曼谷・清邁・普吉島", status: "公開", price: 32888, unitCost: 20000, credits: 4, stock: 8, expiry: "2029/12/31", special: "兌換時再選目的地；四張可分次使用；不含不同點進出" },
    { id: "0914B", title: "北歐水岸雙城質感漫旅", route: "阿姆斯特丹・哥本哈根", status: "公開", price: 79888, unitCost: 44000, credits: 4, stock: 4, expiry: "2030/12/31", special: "支援不同點進出；傳統航空直飛或轉機皆可" },
    { id: "0914C", title: "澳紐單人限量輕旅行", route: "墨爾本・奧克蘭", status: "公開", price: 14888, unitCost: 9900, credits: 1, stock: 7, expiry: "2027/12/31", special: "單張拆售；目的地二選一；不含不同點進出" },
    { id: "0913D", title: "PMR 私享單張方案", route: "指定短線航點", status: "代碼限定", price: 8888, unitCost: 5500, credits: 1, stock: 4, expiry: "2027/12/31", special: "指定客戶限定；目的地由客服個別確認" }
  ];

  const defaultCustomers = [];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function read(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : clone(fallback);
    } catch (_error) {
      return clone(fallback);
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("pmr-data-updated", { detail: { key } }));
    return value;
  }


  const demoOrders = new Set(["PMR-260913-018","PMR-260914-021","PMR-260914-022","PMR-260912-014","PMR-260926-034"]);
  const demoCustomers = new Set(["CUS-0001","CUS-0002","CUS-0003","CUS-0004"]);

  function mapPaymentStatus_(raw) {
    return (raw === "已確認" || raw === "已核帳") ? "已確認" : "待核帳";
  }

  // Normalizes a customer name into a stable key so repeat customers
  // (same name across multiple synced bookings) share one customer record.
  function slugName_(name) {
    return String(name || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");
  }

  // One-time migration: merges any already-synced per-order customer
  // records (id pattern "J168-CUSTOMER-<orderId>") that share the same
  // real name into a single canonical "J168-NAME-<slug>" customer record,
  // and repoints every affected order's customerId at that canonical id.
  // Guarded by a localStorage flag so it only ever runs once per browser.
  const CONSOLIDATE_FLAG = "pmr-customer-name-consolidated-v1";
  function consolidateCustomersByName_() {
    if (localStorage.getItem(CONSOLIDATE_FLAG)) return false;

    const orders = read(ORDERS_KEY, defaultOrders);
    const customers = read(CUSTOMERS_KEY, defaultCustomers);
    let changed = false;

    const byNameKey = new Map();
    const idRemap = new Map();

    for (const customer of customers) {
      if (!/^J168-CUSTOMER-/.test(customer.id)) continue;
      const nameKey = slugName_(customer.realName || customer.displayName);
      if (!nameKey) continue;
      const canonicalId = "J168-NAME-" + nameKey;
      if (!byNameKey.has(nameKey)) {
        byNameKey.set(nameKey, { ...customer, id: canonicalId });
      }
      idRemap.set(customer.id, canonicalId);
    }

    if (idRemap.size === 0) {
      localStorage.setItem(CONSOLIDATE_FLAG, "1");
      return false;
    }

    const keptCustomers = customers
      .filter(c => !idRemap.has(c.id))
      .concat(Array.from(byNameKey.values()));

    for (const order of orders) {
      if (idRemap.has(order.customerId)) {
        order.customerId = idRemap.get(order.customerId);
        changed = true;
      }
    }

    if (changed) {
      write(CUSTOMERS_KEY, keptCustomers);
      write(ORDERS_KEY, orders);
    }
    localStorage.setItem(CONSOLIDATE_FLAG, "1");
    return changed;
  }

  // Live sync: pulls the "預訂" tab of the PMR J168 雲端資料庫 Google Sheet
  // (via its Apps Script Web App) and adds any booking not already stored
  // locally. Existing orders are never overwritten, so admin edits made in
  // admin.html always win over the sheet.
  async function syncFromSheet_() {
    if (!SHEET_API_URL) return false;
    let data;
    try {
      const response = await fetch(SHEET_API_URL, { cache: "no-store" });
      data = await response.json();
    } catch (_error) {
      return false;
    }
    if (!data || data.ok === false || !Array.isArray(data.bookings)) return false;

    let changed = consolidateCustomersByName_();

    const orders = read(ORDERS_KEY, defaultOrders).filter(o => !demoOrders.has(o.id));
    const customers = read(CUSTOMERS_KEY, defaultCustomers).filter(c => !demoCustomers.has(c.id));

    for (const b of data.bookings) {
      if (!b || !b.id || orders.some(o => o.id === b.id)) continue;
      changed = true;
      const nameKey = slugName_(b.customer);
      const customerId = nameKey ? "J168-NAME-" + nameKey : "J168-CUSTOMER-" + b.id;
      if (!customers.some(c => c.id === customerId)) {
        customers.push({
          id: customerId, realName: b.customer || "", displayName: b.lineName || b.customer || "",
          phone: "", lineUserId: "", status: "待手機核對", linkedAt: "", previousLineIds: [],
          note: "來源預訂未提供手機；請核對後填入，不依姓名自動合併。"
        });
      }
      const project = b.project || "";
      orders.push({
        id: b.id, customerId, customerName: b.customer || "", lineDisplayName: b.lineName || b.customer || "",
        lineUserId: "", phone: "", projectId: (project.match(/\b\d{4}[A-Z]\b/) || ["原始預訂"])[0],
        title: project.split("\n")[0], projectOriginal: project, route: "", purchased: Number(b.quantity || 0),
        pending: null, used: b.used === null || b.used === undefined ? null : Number(b.used), refunded: null,
        paid: mapPaymentStatus_(b.paymentStatus) === "已確認", paymentStatus: mapPaymentStatus_(b.paymentStatus),
        reportedPayment: b.reportedPayment === undefined ? null : b.reportedPayment, paymentAmount: null, total: null, grandTotal: null,
        cost: null, serviceFee: null, introducer: b.introducer || "", introducerProfit: null, sourceProfit: null,
        docsStatus: "資料待逐組核對", ticketStatus: "待確認", assignedTo: b.staff || "J168", nextActionDate: "",
        expiry: "", status: "資料待核對", statusType: "active", internalNotes: b.notes || "",
        addOns: [], createdAt: b.createdAt || "", imported: true, cabin: b.cabin || "", starlux: b.starlux || "",
        activity: [{ at: b.createdAt || "", text: "由 Google 試算表（PMR J168 雲端資料庫）同步匯入" }]
      });
    }

    if (changed) {
      write(ORDERS_KEY, orders);
      write(CUSTOMERS_KEY, customers);
    }
    return changed;
  }

  // Write-back: pushes one order's key fields to the "預訂" sheet tab via
  // the Apps Script Web App's doPost handler (action: "upsertOrder").
  // Uses text/plain content-type so the browser doesn't send a CORS
  // preflight (Apps Script Web Apps don't handle OPTIONS).
  async function pushOrderToSheet_(order) {
    if (!SHEET_API_URL || !order || !order.id) return false;
    try {
      const response = await fetch(SHEET_API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "upsertOrder",
          order: {
            id: order.id,
            assignedTo: order.assignedTo,
            customerName: order.customerName,
            title: order.title,
            projectOriginal: order.projectOriginal,
            purchased: order.purchased,
            cabin: order.cabin,
            starlux: order.starlux,
            reportedPayment: order.reportedPayment,
            paymentAmount: order.paymentAmount,
            paymentStatus: order.paymentStatus,
            used: order.used,
            createdAt: order.createdAt,
            lineDisplayName: order.lineDisplayName,
            introducer: order.introducer,
            internalNotes: order.internalNotes
          }
        })
      });
      const data = await response.json().catch(() => null);
      return !!(data && data.ok);
    } catch (_error) {
      return false;
    }
  }

  window.PMRStore = {
    keys: { orders: ORDERS_KEY, projects: PROJECTS_KEY, customers: CUSTOMERS_KEY },
    getOrders() {
      const customerIdByLine = Object.fromEntries(defaultCustomers.map(customer => [customer.lineUserId, customer.id]));
      return read(ORDERS_KEY, defaultOrders).map(order => ({ ...order, customerId: order.customerId || customerIdByLine[order.lineUserId] || "" }));
    },
    saveOrders(orders) { return write(ORDERS_KEY, orders); },
    upsertOrder(order) {
      const orders = read(ORDERS_KEY, defaultOrders);
      const index = orders.findIndex(item => item.id === order.id);
      if (index >= 0) orders[index] = clone(order);
      else orders.unshift(clone(order));
      return write(ORDERS_KEY, orders);
    },
    getProjects() { return read(PROJECTS_KEY, defaultProjects); },
    saveProjects(projects) { return write(PROJECTS_KEY, projects); },
    getCustomers() { return read(CUSTOMERS_KEY, defaultCustomers); },
    saveCustomers(customers) { return write(CUSTOMERS_KEY, customers); },
    upsertCustomer(customer) {
      const customers = read(CUSTOMERS_KEY, defaultCustomers);
      const index = customers.findIndex(item => item.id === customer.id);
      if (index >= 0) customers[index] = clone(customer);
      else customers.unshift(clone(customer));
      return write(CUSTOMERS_KEY, customers);
    },
    syncFromSheet: syncFromSheet_,
    pushOrderToSheet: pushOrderToSheet_,
    reset() {
      localStorage.removeItem(ORDERS_KEY);
      localStorage.removeItem(PROJECTS_KEY);
      localStorage.removeItem(CUSTOMERS_KEY);
      window.dispatchEvent(new CustomEvent("pmr-data-updated"));
    }
  };

  // Kick off a background sync every time the page loads.
  syncFromSheet_();
})();

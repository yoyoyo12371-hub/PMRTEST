(function () {
  const ORDERS_KEY = "pmr-demo-orders-v2";
  const PROJECTS_KEY = "pmr-demo-admin-projects-v1";
  const CUSTOMERS_KEY = "pmr-demo-customers-v1";

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
  if (!localStorage.getItem("pmr-real-orders-migration-v1")) {
    const snapshot = read("pmr-j168-dataset-v1", {bookings: []});
    const retained = read(ORDERS_KEY, []).filter(o => !demoOrders.has(o.id));
    const people = read(CUSTOMERS_KEY, []).filter(c => !demoCustomers.has(c.id));
    for (const b of snapshot.bookings || []) {
      if (retained.some(o => o.id === b.id)) continue;
      const customerId = "J168-CUSTOMER-" + b.id;
      if (!people.some(c => c.id === customerId)) people.push({
        id: customerId, realName: b.customer, displayName: b.lineName || b.customer,
        phone: "", lineUserId: "", status: "待手機核對", linkedAt: "", previousLineIds: [],
        note: "來源預訂未提供手機；請核對後填入，不依姓名自動合併。"
      });
      retained.push({
        id:b.id, customerId, customerName:b.customer, lineDisplayName:b.lineName || b.customer,
        lineUserId:"", phone:"", projectId:(b.project.match(/\b\d{4}[A-Z]\b/) || ["原始預訂"])[0],
        title:b.project.split("\n")[0], projectOriginal:b.project, route:"", purchased:b.quantity,
        pending:null, used:null, refunded:null, paid:false, paymentStatus:"待核帳",
        reportedPayment:b.reportedPayment, paymentAmount:null, total:null, grandTotal:null,
        cost:null, serviceFee:null, introducer:b.introducer || "", introducerProfit:null, sourceProfit:null,
        docsStatus:"資料待逐組核對", ticketStatus:"待確認", assignedTo:"J168", nextActionDate:"",
        expiry:"", status:"資料待核對", statusType:"active", internalNotes:b.notes || "",
        addOns:[], createdAt:b.createdAt, imported:true, cabin:b.cabin, starlux:b.starlux,
        activity:[{at:b.createdAt,text:"由 J168 預訂資料匯入；付款及出票狀態待核對"}]
      });
    }
    localStorage.setItem(ORDERS_KEY, JSON.stringify(retained));
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(people));
    if ((snapshot.bookings || []).length) localStorage.setItem("pmr-real-orders-migration-v1","done");
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
    reset() {
      localStorage.removeItem(ORDERS_KEY);
      localStorage.removeItem(PROJECTS_KEY);
      localStorage.removeItem(CUSTOMERS_KEY);
      window.dispatchEvent(new CustomEvent("pmr-data-updated"));
    }
  };
})();

(function () {
  const ORDERS_KEY = "pmr-demo-orders-v2";
  const PROJECTS_KEY = "pmr-demo-admin-projects-v1";
  const CUSTOMERS_KEY = "pmr-demo-customers-v1";

  const defaultOrders = [
    {
      id: "PMR-260913-018",
      customerId: "CUS-0001",
      lineUserId: "demo-yvonne",
      lineDisplayName: "Yvonne",
      customerName: "王小姐",
      phone: "0912-345-678",
      projectId: "0913A",
      title: "日韓潮流四城隨心飛",
      route: "東京・大阪・首爾・釜山",
      purchased: 8,
      pending: 1,
      used: 2,
      refunded: 0,
      paid: true,
      paymentStatus: "已確認",
      paymentAmount: 65776,
      total: 65776,
      cost: 40000,
      serviceFee: 4000,
      introducer: "旅行好友",
      introducerProfit: 10888,
      sourceProfit: 10888,
      docsStatus: "缺 1 份護照",
      ticketStatus: "尚未出票",
      assignedTo: "Mina",
      nextActionDate: "2026-09-15",
      expiry: "2029/12/31",
      status: "資料補件中",
      statusType: "active",
      internalNotes: "客人預計冬季出發，需確認其中兩張的使用月份。",
      addOns: [{ name: "四人房升級", price: 5000, cost: 2800 }],
      createdAt: "2026/09/13",
      activity: [
        { at: "2026/09/13 18:40", text: "款項已核對，8 張額度生效" },
        { at: "2026/09/13 19:05", text: "收到 2 份護照，建立 1 張兌換申請" }
      ]
    },
    {
      id: "PMR-260914-021",
      customerId: "CUS-0002",
      lineUserId: "demo-eric",
      lineDisplayName: "豆豆黃 Eric",
      customerName: "黃先生",
      phone: "0900-123-456",
      projectId: "0914B",
      title: "北歐水岸雙城質感漫旅",
      route: "阿姆斯特丹・哥本哈根",
      purchased: 4,
      pending: 0,
      used: 0,
      refunded: 0,
      paid: false,
      paymentStatus: "待匯款",
      paymentAmount: 0,
      total: 79888,
      cost: 44000,
      serviceFee: 2000,
      introducer: "",
      introducerProfit: 0,
      sourceProfit: 33888,
      docsStatus: "尚未補件",
      ticketStatus: "尚未出票",
      assignedTo: "Ary",
      nextActionDate: "2026-09-14",
      expiry: "2030/12/31",
      status: "等待付款",
      statusType: "active",
      internalNotes: "已提供專屬匯款資訊，明日中午前追蹤。",
      addOns: [],
      createdAt: "2026/09/14",
      activity: [{ at: "2026/09/14 09:18", text: "由 LINE 官方帳號建立訂單" }]
    },
    {
      id: "PMR-260914-022",
      customerId: "CUS-0003",
      lineUserId: "demo-alma",
      lineDisplayName: "Alma",
      customerName: "林小姐",
      phone: "0988-000-112",
      projectId: "0914C",
      title: "澳紐單人限量輕旅行",
      route: "墨爾本・奧克蘭",
      purchased: 2,
      pending: 2,
      used: 0,
      refunded: 0,
      paid: true,
      paymentStatus: "已確認",
      paymentAmount: 29776,
      total: 29776,
      cost: 19800,
      serviceFee: 1000,
      introducer: "Penny",
      introducerProfit: 4488,
      sourceProfit: 4488,
      docsStatus: "航班待補",
      ticketStatus: "待選航班",
      assignedTo: "Mina",
      nextActionDate: "2026-09-16",
      expiry: "2027/12/31",
      status: "許願航班待補",
      statusType: "active",
      internalNotes: "兩位同行，護照已齊，等待三組航班截圖。",
      addOns: [{ name: "機場接送", price: 2000, cost: 1000 }],
      createdAt: "2026/09/14",
      activity: [{ at: "2026/09/14 11:30", text: "收到兩位旅客護照" }]
    },
    {
      id: "PMR-260912-014",
      customerId: "CUS-0004",
      lineUserId: "demo-penny",
      lineDisplayName: "璦 penny",
      customerName: "陳小姐",
      phone: "0966-321-000",
      projectId: "0912B",
      title: "英法雙城經典假期",
      route: "倫敦・巴黎",
      purchased: 4,
      pending: 4,
      used: 0,
      refunded: 0,
      paid: true,
      paymentStatus: "已確認",
      paymentAmount: 76999,
      total: 76999,
      cost: 44000,
      serviceFee: 2000,
      introducer: "Ary",
      introducerProfit: 15499,
      sourceProfit: 15499,
      docsStatus: "資料已齊",
      ticketStatus: "準備出票",
      assignedTo: "Ary",
      nextActionDate: "2026-09-15",
      expiry: "2029/12/31",
      status: "準備出票",
      statusType: "active",
      internalNotes: "四人同行，倫敦進巴黎出，已確認專案支援不同點進出。",
      addOns: [],
      createdAt: "2026/09/12",
      activity: [{ at: "2026/09/13 20:12", text: "護照、日期與三組航班皆已確認" }]
    }
  ];

  const defaultProjects = [
    { id: "0914A", title: "泰國繽紛三城隨心遊", route: "曼谷・清邁・普吉島", status: "公開", price: 32888, unitCost: 20000, credits: 4, stock: 8, expiry: "2029/12/31", special: "兌換時再選目的地；四張可分次使用；不含不同點進出" },
    { id: "0914B", title: "北歐水岸雙城質感漫旅", route: "阿姆斯特丹・哥本哈根", status: "公開", price: 79888, unitCost: 44000, credits: 4, stock: 4, expiry: "2030/12/31", special: "支援不同點進出；傳統航空直飛或轉機皆可" },
    { id: "0914C", title: "澳紐單人限量輕旅行", route: "墨爾本・奧克蘭", status: "公開", price: 14888, unitCost: 9900, credits: 1, stock: 7, expiry: "2027/12/31", special: "單張拆售；目的地二選一；不含不同點進出" },
    { id: "0913D", title: "PMR 私享單張方案", route: "指定短線航點", status: "代碼限定", price: 8888, unitCost: 5500, credits: 1, stock: 4, expiry: "2027/12/31", special: "指定客戶限定；目的地由客服個別確認" }
  ];

  const defaultCustomers = [
    { id: "CUS-0001", realName: "王小姐", displayName: "Yvonne", lineUserId: "demo-yvonne", phone: "0912-345-678", status: "正常", linkedAt: "2026/09/13", previousLineIds: [], note: "主要示範客戶" },
    { id: "CUS-0002", realName: "黃先生", displayName: "豆豆黃 Eric", lineUserId: "demo-eric", phone: "0900-123-456", status: "正常", linkedAt: "2026/09/14", previousLineIds: [], note: "" },
    { id: "CUS-0003", realName: "林小姐", displayName: "Alma", lineUserId: "demo-alma", phone: "0988-000-112", status: "正常", linkedAt: "2026/09/14", previousLineIds: [], note: "" },
    { id: "CUS-0004", realName: "陳小姐", displayName: "璦 penny", lineUserId: "demo-penny", phone: "0966-321-000", status: "正常", linkedAt: "2026/09/12", previousLineIds: [], note: "" }
  ];

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

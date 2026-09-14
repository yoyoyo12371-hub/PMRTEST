const projects = [
  {
    id: "0914A",
    category: "short",
    categoryLabel: "亞洲短線",
    title: "泰國繽紛三城隨心遊",
    route: "曼谷・清邁・普吉島",
    price: 32888,
    businessPrice: 76888,
    unitCost: 20000,
    businessCost: 48000,
    unit: "組",
    credits: 4,
    expiry: "2029/12/31",
    remaining: 8,
    symbol: "☀",
    highlight: "泰國三座熱門城市可於兌換時任選，四張額度可分次安排。",
    conditions: ["兌換時再選目的地", "四張可分次使用", "傳統航空直飛或轉機皆可", "此專案不含不同點進出"]
  },
  {
    id: "0914B",
    category: "europe",
    categoryLabel: "歐洲線",
    title: "北歐水岸雙城質感漫旅",
    route: "阿姆斯特丹・哥本哈根",
    price: 79888,
    businessPrice: 198888,
    unitCost: 44000,
    businessCost: 114000,
    unit: "組",
    credits: 4,
    expiry: "2030/12/31",
    remaining: 4,
    symbol: "♜",
    highlight: "可安排阿姆斯特丹進、哥本哈根出，適合一次完成北歐雙城旅行。",
    conditions: ["支援不同點進出", "四張可分次使用", "兌換時再確認城市", "傳統航空直飛或轉機皆可"]
  },
  {
    id: "0914C",
    category: "longhaul",
    categoryLabel: "澳紐長程",
    title: "澳紐單人限量輕旅行",
    route: "墨爾本・奧克蘭",
    price: 14888,
    businessPrice: 39888,
    unitCost: 9900,
    businessCost: 25000,
    unit: "張",
    credits: 1,
    expiry: "2027/12/31",
    remaining: 7,
    symbol: "✦",
    highlight: "不必湊組數，單人也能先收藏澳紐長程旅遊額度。",
    conditions: ["單張拆售", "墨爾本或奧克蘭擇一", "剩餘 7 張", "此專案不含不同點進出"]
  }
];

const archivedProjects = [
  {
    id: "0913A", category: "short", categoryLabel: "最近五日", title: "日韓潮流四城隨心飛",
    route: "東京・大阪・首爾・釜山", price: 32888, businessPrice: 76888, unitCost: 20000, businessCost: 48000, unit: "組", credits: 4,
    expiry: "2029/12/31", remaining: 3, symbol: "◉", archived: true,
    highlight: "四座日韓城市可任選；本專案允許同一組分次兌換，但每次限單一目的地。",
    conditions: ["兌換時再選目的地", "四張可分次使用", "每次兌換限單一目的地", "不含不同點進出"]
  },
  {
    id: "0912B", category: "europe", categoryLabel: "最近五日", title: "英法雙城經典假期",
    route: "倫敦・巴黎", price: 76999, businessPrice: 188999, unitCost: 44000, businessCost: 114000, unit: "組", credits: 4,
    expiry: "2029/12/31", remaining: 2, symbol: "♙", archived: true,
    highlight: "可選倫敦或巴黎單點往返，也可申請倫敦進、巴黎出。",
    conditions: ["支援不同點進出", "四張可分次使用", "傳統航空為主", "實際航班依兌換結果為準"]
  },
  {
    id: "0911C", category: "longhaul", categoryLabel: "最近五日", title: "美西雙城自由行",
    route: "洛杉磯・西雅圖", price: 29799, businessPrice: 69999, unitCost: 19800, businessCost: 50000, unit: "組", credits: 2,
    expiry: "2028/12/31", remaining: 4, symbol: "✧", archived: true,
    highlight: "兩人一組的長程方案，適合雙人同行；本案僅提供單點來回。",
    conditions: ["兩人一組", "洛杉磯或西雅圖擇一", "不可不同點進出", "可後補護照與航班"]
  },
  {
    id: "0910A", category: "short", categoryLabel: "最近五日", title: "越南海岸雙城漫遊",
    route: "峴港・胡志明", price: 16888, businessPrice: 38888, unitCost: 11000, businessCost: 25000, unit: "組", credits: 2,
    expiry: "2028/12/31", remaining: 5, symbol: "≈", archived: true,
    highlight: "兩張可分開使用，峴港與胡志明不必在同一次旅程兌換。",
    conditions: ["兩張可分次使用", "兌換時再選城市", "每張限單一城市來回", "不含不同點進出"]
  },
  {
    id: "0909A", category: "short", categoryLabel: "最近五日", title: "九州沖繩單張特惠",
    route: "福岡・熊本・沖繩", price: 8999, businessPrice: 19999, unitCost: 5500, businessCost: 12500, unit: "張", credits: 1,
    expiry: "2027/12/31", remaining: 6, symbol: "◌", archived: true,
    highlight: "舊專案仍可用代碼叫出，單張購買、不需配對成組。",
    conditions: ["單張拆售", "三個目的地擇一", "剩餘 6 張", "不含不同點進出"]
  },
  {
    id: "0913D", category: "private", categoryLabel: "私人專案", title: "PMR 私享單張方案",
    route: "指定短線航點", price: 8888, businessPrice: 18888, unitCost: 5500, businessCost: 12500, unit: "張", credits: 1,
    expiry: "2027/12/31", remaining: 4, symbol: "◆", archived: true, private: true,
    highlight: "由客服為指定客人建立的臨時單張專案，輸入代碼後才會顯示。",
    conditions: ["限收到代碼的指定客人", "單張使用", "目的地由客服個別確認", "不含不同點進出"]
  }
];

const allProjects = [...projects, ...archivedProjects];

const storedProjectMap = new Map((window.PMRStore?.getProjects?.() || []).map(project => [project.id, project]));
allProjects.forEach(project => {
  const stored = storedProjectMap.get(project.id);
  if (stored) {
    Object.assign(project, stored);
    project.remaining = stored.stock ?? project.remaining;
  }
});

const faqCategories = [
  {
    id: "price", icon: "💰", title: "價格與票務",
    items: [
      ["價格是含稅來回票嗎？還有其他費用嗎？", "專案標示價格皆為含稅來回基本票價。只有您主動選擇的星宇、商務艙或其他明確標示的加購服務才會另外計費，不會收取未事先說明的費用。"],
      ["為什麼價格比航空公司官網便宜？", "我們透過特約商業管道與合作票務取得優惠專案票。由於是特殊購票管道，專案價格僅限詢問當日有效。"],
      ["今天詢問的價格可以保留到明天嗎？", "不一定。每日專案價格與機位皆可能調整，須以當日查詢與客服確認結果為準。"],
      ["小孩或嬰兒也是一樣價格嗎？", "是的，特惠專案採相同價格。由於通常在出發前兩週開票，若屆時兒童機位售罄將無法補位，建議直接為兒童購買一張標準票。"],
      ["可以只買單程嗎？", "不可以，本優惠專案僅提供來回機票。"],
      ["為什麼我和朋友同一天詢問，價格會不一樣？", "機票採動態浮動價格，即使航空公司官網也可能因查詢時間、剩餘機位或航班不同而出現價差。"],
      ["過年、連假或寒暑假也有優惠嗎？", "熱門時段需先查詢實際日期與機位狀況，最後以客服當下確認的專案報價為準。"]
    ]
  },
  {
    id: "flight", icon: "🛫", title: "航班與航空",
    items: [
      ["機票從哪個機場出發？", "優惠機票原則上由桃園國際機場（TPE）出發與返回；特殊專案若有不同，會在專案內容中明確標示。"],
      ["可以指定航空公司或航班時間嗎？", "可以。您可提供 3 個偏好航班時間或截圖，我們會盡力安排。優惠票種不保證一定是許願航班，但會以許願出發日期進行安排，建議行程從抵達後第二天開始規劃。"],
      ["可以指定長榮、華航或星宇航空嗎？", "可以提出偏好。指定星宇航空通常每人加價 NT$2,000，已包含星宇的特定專案除外；實際仍須以機位與客服確認結果為準。"],
      ["提供 3 個許願航班，一定會拿到其中一個嗎？", "我們會盡量三選一安排。若熱門時段三個航班皆滿，可改選其他航班，或改購較快出票的一般優惠票。"],
      ["會被安排到紅眼航班或轉機嗎？", "非旅遊旺季原則上安排直飛且非紅眼航班；旺季、連假或機位非常緊張時才可能調整。每個專案是否允許轉機，仍以該專案條件為準。"],
      ["去程與回程可能是不同航空公司嗎？", "可能。我們會依您的許願航班、專案條件與當時機位進行整體搭配。"],
      ["多人同行可以安排同一班飛機嗎？", "同一訂單 9 人（含）以內會以同班安排為原則；較大型團體需另由客服確認團體促銷方案與出票方式。"],
      ["開出的航班不喜歡，可以更換或退款嗎？", "開票會依許願清單及專案規定辦理；開票完成後無法因個人偏好退款或更換。"]
    ]
  },
  {
    id: "service", icon: "🧳", title: "行李、座位與服務",
    items: [
      ["優惠機票包含行李嗎？", "傳統航空一般包含托運 23kg + 手提 7kg，部分航空依最新規定可能為托運 20kg；廉價航空依該航空公司規定，例如托運 20kg + 手提 10kg。請以專案與電子機票標示為準。"],
      ["可以額外加購行李重量嗎？", "可以。如需加購，通常可於航空公司官網或出發當天在機場櫃檯辦理，費用依航空公司規定。"],
      ["可以選位或和同行者坐在一起嗎？", "取得電子機票後，可憑機票號碼至航空公司官網辦理線上報到與選位。實際座位仍依航空公司可選狀況。"],
      ["可以累積航空公司哩程嗎？", "可以，請於取得電子機票後，自行登入航空公司會員帳號登錄累積；最終是否累積及比例依票種規定。"],
      ["商務艙可以使用貴賓室嗎？", "可以。商務艙須在訂購時提出並完成加價，實際貴賓室權益依航空公司與機場規定。"]
    ]
  },
  {
    id: "ticketing", icon: "🎫", title: "出票與報到",
    items: [
      ["付款後多久可以拿到機票？", "優惠專案機票預計於出發前兩週至前一天 18:00 前完成開立並發送電子機票。"],
      ["為什麼付款後不能馬上出票？", "特惠機票使用的採購管道與一般官網票不同，需要依合作票務的專案流程集中處理。"],
      ["快出國了還沒拿到機票正常嗎？", "只要仍在約定的出票期間內即屬正常流程。您可在『我的訂單』查看進度；若超過承諾時間仍未收到，請立即聯絡客服。"],
      ["可以加價申請提前出票嗎？", "可以詢問一般優惠票方案。提供來回航班截圖後，客服會依當時票價報價，通常可在下單後 15 天內出票。"],
      ["出票後如何確認機票真偽？", "出票後會收到正式電子機票（E-ticket），可憑機票號碼或訂位代碼至航空公司官網查詢確認。"]
    ]
  },
  {
    id: "change", icon: "⚠️", title: "改期與取消",
    items: [
      ["付款後可以取消退款嗎？", "依優惠專案規定，下訂後無法因個人因素取消、退款或退票。下單前請確認日期、人數與專案條件。"],
      ["可以變更出發日期嗎？", "僅限下單後 3 天內提出，且只能更改為當月其他日期，無法跨月份變更；最終仍需視機位確認。"],
      ["遇到颱風或惡劣天氣怎麼辦？", "一般建議改期，可申請當月其他時段。若在風險告知後仍選擇如期開票，後續航班異動須依航空公司規定處理，保險理賠則須自行向保險公司確認。"],
      ["航空公司主動取消或更改航班怎麼辦？", "一般臨時異動會由客服與合作旅行社依航空公司規定協助追蹤。若屬天候風險告知後仍堅持開票的情況，則依事前確認的處理方式辦理。"]
    ]
  },
  {
    id: "trust", icon: "🛡️", title: "票務來源與護照",
    items: [
      ["機票來源合法嗎？是旅行社開票嗎？", "機票由合法合作旅行社開立，完成開票後可正常報到與搭乘。"],
      ["這是哩程票、員工票或團體票嗎？", "一般優惠專案不是哩程票或員工票，而是商業特約管道的專案票；若是大型團體促銷票，會由客服另外清楚說明。"],
      ["會不會到了機場才發現不能搭？", "開票完成後會提供正式電子機票，您可事先至航空公司官網查詢訂位資料。"],
      ["護照沒辦好或快過期，可以先訂嗎？", "可以先預訂，辦妥後再從『我的訂單』補傳。出國時護照通常須有 6 個月以上效期；前往中國或香港時，請另確認台胞證或簽證需求。"]
    ]
  },
  {
    id: "payment", icon: "💳", title: "付款與下單",
    items: [
      ["提供哪些付款方式？可以刷卡或分期嗎？", "目前僅提供銀行轉帳，暫不支援信用卡與分期付款。匯款帳號由客服依訂單提供，請勿轉帳至非客服確認的帳號。"],
      ["有提供發票或報帳收據嗎？", "目前優惠專案不提供發票或報帳收據；付款與訂單明細會保留在『我的訂單』中。"],
      ["如何進行下單？", "先選擇專案與數量並填寫基本資料；客服確認後提供匯款資訊。付款核對完成後額度生效，護照與 3 個許願航班截圖可稍後分次補齊。"]
    ]
  }
];

let activeFaqCategory = "all";

const fallbackOrders = [
  {
    id: "PMR-260913-018",
    projectId: "0913A",
    title: "日韓潮流四城隨心飛",
    route: "東京・大阪・首爾・釜山",
    purchased: 8,
    pending: 1,
    used: 2,
    refunded: 0,
    paid: true,
    expiry: "2029/12/31",
    status: "資料補件中",
    statusType: "active",
    total: 65776,
    addOns: [{ name: "四人房升級", price: 5000 }],
    createdAt: "2026/09/13"
  }
];

let orders = window.PMRStore
  ? window.PMRStore.getOrders().filter(order => order.customerId === "CUS-0001")
  : fallbackOrders;

let selectedProject = projects[0];
let bookingQuantity = 1;
let ticketSelections = [];
let airportTransfer = "none";
let appliedCoupon = null;
let redeemQuantity = 1;
let selectedOrder = orders[0];

const STARLUX_PRICE_PER_TICKET = 2000;
const AIRPORT_TRANSFERS = {
  none: { label: "不需要機場接送", price: 0 },
  oneWay: { label: "機場接送・單趟", price: 1800 },
  roundTrip: { label: "機場接送・來回", price: 3600 }
};
const INTRODUCER_ACCOUNTS = {
  "楊翰": { owner: "楊翰", bank: "待客服設定銀行", account: "待客服設定帳號" },
  "傑評": { owner: "傑評", bank: "待客服設定銀行", account: "待客服設定帳號" },
  "軟糖": { owner: "軟糖", bank: "待客服設定銀行", account: "待客服設定帳號" }
};
const COUPON_RULES = {
  TRANSFERFREE: { type: "transfer", description: "機場接送費全額減免" },
  PMR95: { type: "percent", rate: 0.95, description: "本次訂單 95 折" }
};

const money = value => `$${Number(value).toLocaleString("zh-TW")}`;
const qs = selector => document.querySelector(selector);
const qsa = selector => [...document.querySelectorAll(selector)];

function splitAmount(total, count) {
  const base = Math.floor(Number(total || 0) / count);
  const remainder = Number(total || 0) - base * count;
  return Array.from({ length: count }, (_item, index) => base + (index < remainder ? 1 : 0));
}

function rebuildTicketSelections(preserve = true) {
  const previous = preserve ? ticketSelections : [];
  const credits = Number(selectedProject.credits || 1);
  const economyPrices = splitAmount(selectedProject.price, credits);
  const businessPrices = splitAmount(selectedProject.businessPrice, credits);
  const economyCosts = splitAmount(selectedProject.unitCost, credits);
  const businessCosts = splitAmount(selectedProject.businessCost, credits);
  ticketSelections = Array.from({ length: credits * bookingQuantity }, (_item, index) => {
    const withinPackage = index % credits;
    const old = previous[index];
    return {
      index,
      packageNumber: Math.floor(index / credits) + 1,
      ticketNumber: withinPackage + 1,
      cabin: old?.cabin || "economy",
      starlux: old?.starlux || false,
      economyPrice: economyPrices[withinPackage],
      businessPrice: businessPrices[withinPackage],
      economyCost: economyCosts[withinPackage],
      businessCost: businessCosts[withinPackage]
    };
  });
}

function bookingPricing() {
  const ticketSubtotal = ticketSelections.reduce((sum, ticket) => sum + (ticket.cabin === "business" ? ticket.businessPrice : ticket.economyPrice), 0);
  const ticketCost = ticketSelections.reduce((sum, ticket) => sum + (ticket.cabin === "business" ? ticket.businessCost : ticket.economyCost), 0);
  const businessCount = ticketSelections.filter(ticket => ticket.cabin === "business").length;
  const starluxCount = ticketSelections.filter(ticket => ticket.starlux).length;
  const starluxTotal = starluxCount * STARLUX_PRICE_PER_TICKET;
  const transferTotal = AIRPORT_TRANSFERS[airportTransfer].price;
  const beforeDiscount = ticketSubtotal + starluxTotal + transferTotal;
  let discountAmount = 0;
  if (appliedCoupon?.type === "transfer") discountAmount = transferTotal;
  if (appliedCoupon?.type === "percent") discountAmount = Math.round(beforeDiscount * (1 - appliedCoupon.rate));
  return {
    ticketSubtotal,
    ticketCost,
    businessCount,
    economyCount: ticketSelections.length - businessCount,
    starluxCount,
    starluxTotal,
    transferTotal,
    discountAmount,
    grandTotal: Math.max(0, beforeDiscount - discountAmount)
  };
}

function orderGrandTotal(order) {
  if (Number.isFinite(Number(order.grandTotal))) return Number(order.grandTotal);
  return Math.max(0, Number(order.total || 0) + (order.addOns || []).reduce((sum, item) => sum + Number(item.price || 0), 0) - Number(order.discountAmount || 0));
}

function paymentAccountText(order) {
  const account = order.paymentAccount || {};
  if (!account.account || account.account.includes("待客服設定")) return `${order.introducer || "介紹人"}的收款帳戶：客服確認後顯示`;
  return `${account.bank || "銀行帳戶"}｜戶名 ${account.owner || order.introducer}｜${account.account}`;
}

function projectCard(project, compact = false) {
  return `<article class="project-card${compact ? " search-project-card" : ""}">
      <div class="project-cover ${project.category}">
        <div class="project-tags"><span>${project.categoryLabel}</span><span>剩餘 ${project.remaining} ${project.unit}</span></div>
        <div class="project-symbol">${project.symbol}</div>
        <div class="project-code">${project.id}・${project.private ? "限定代碼" : project.archived ? "歷史專案" : "當日限定"}</div>
      </div>
      <div class="project-body">
        <h3>${project.title}</h3>
        <p class="route">✈ ${project.route}</p>
        <div class="project-highlight"><strong>這個專案特別在哪裡</strong><p>${project.highlight}</p></div>
        <details class="project-details">
          <summary>查看完整專案內容</summary>
          <ul>${project.conditions.map(condition => `<li>${condition}</li>`).join("")}</ul>
          <p>使用效期：${project.expiry}</p>
          <p>商務艙方案：${money(project.businessPrice)}</p>
        </details>
        <div class="project-meta"><span>${project.credits === 1 ? "單張使用" : `一組 ${project.credits} 位`}</span><span>效期 ${project.expiry}</span><span>${project.conditions.some(item => item.includes("不同點進出") && !item.includes("不含") && !item.includes("不可")) ? "可不同點進出" : "單點往返"}</span></div>
        <div class="project-price">
          <div><small>優惠售價</small><strong>${money(project.price)}</strong></div>
          <button class="book-btn" data-book-project="${project.id}">${project.archived ? "選擇此專案" : "立即預訂"}</button>
        </div>
      </div>
    </article>`;
}

function renderProjects(filter = "all") {
  const visible = filter === "all" ? projects : projects.filter(project => project.category === filter);
  qs("#project-grid").innerHTML = visible.map(project => projectCard(project)).join("");
}

function lookupProject(rawCode) {
  const code = rawCode.trim().toUpperCase().replace(/\s+/g, "");
  const project = allProjects.find(item => item.id === code);
  const result = qs("#code-result");
  if (!project) {
    result.className = "code-result is-visible is-error";
    result.innerHTML = `<strong>找不到 ${code || "這個代碼"}</strong><p>請確認英文字母與數字，或直接詢問 PMR 客服。</p>`;
    return;
  }
  result.className = "code-result is-visible";
  result.innerHTML = projectCard(project, true);
  result.scrollIntoView({behavior:"smooth",block:"nearest"});
}

function renderFaq(query = "") {
  const keyword = query.trim().toLowerCase();
  const categories = activeFaqCategory === "all"
    ? faqCategories
    : faqCategories.filter(category => category.id === activeFaqCategory);
  const html = categories.map(category => {
    const items = category.items.filter(([question, answer]) => !keyword || `${question} ${answer.replace(/<[^>]+>/g, "")}`.toLowerCase().includes(keyword));
    if (!items.length) return "";
    return `<section class="faq-category">
      <div class="faq-category-title"><span>${category.icon}</span><div><small>FAQ CATEGORY</small><h2>${category.title}</h2></div><b>${items.length}</b></div>
      <div class="faq-items">${items.map(([question, answer]) => `<details class="faq-item"><summary><span>${question}</span><i>＋</i></summary><div class="faq-answer">${answer}</div></details>`).join("")}</div>
    </section>`;
  }).join("");
  qs("#faq-list").innerHTML = html || `<div class="empty-state">找不到相關問題，歡迎直接詢問 PMR 客服。</div>`;
}

function getAvailable(order) {
  if (!order.paid) return 0;
  return Math.max(0, order.purchased - order.pending - order.used - order.refunded);
}

function renderOrders(filter = "active") {
  const filtered = filter === "all" ? orders : orders.filter(order => order.statusType === filter);
  qs("#orders-list").innerHTML = filtered.length ? filtered.map(order => {
    const available = getAvailable(order);
    const businessTickets = (order.ticketSelections || []).filter(ticket => ticket.cabin === "business").length;
    const economyTickets = (order.ticketSelections || []).filter(ticket => ticket.cabin !== "business").length;
    const cabinDetails = order.ticketSelections?.length
      ? `<div class="order-note">艙等：經濟艙 ${economyTickets} 張${businessTickets ? `、商務艙 ${businessTickets} 張` : ""}</div>`
      : "";
    const extras = order.addOns?.length
      ? `<div class="order-note">已加購：${order.addOns.map(item => `${item.name} ${money(item.price)}`).join("、")}</div>`
      : "";
    const timeline = order.paid
      ? `<div class="timeline-row is-done"><i></i><span>訂單已建立・${order.createdAt}</span></div>
         <div class="timeline-row is-done"><i></i><span>款項已確認・旅遊額度已生效</span></div>
         <div class="timeline-row is-current"><i></i><span>等待補齊本次旅客資料</span></div>
         <div class="timeline-row"><i></i><span>訂位與出票</span></div>`
      : `<div class="timeline-row is-done"><i></i><span>訂單已建立・${order.createdAt}</span></div>
         <div class="timeline-row is-current"><i></i><span>等待客服提供匯款資訊／確認款項</span></div>
         <div class="timeline-row"><i></i><span>旅遊額度生效</span></div>
         <div class="timeline-row"><i></i><span>補件、訂位與出票</span></div>`;
    return `<article class="order-card">
      <div class="order-head">
        <div><small>${order.id}</small><h3>${order.projectId}｜${order.title}</h3><p>✈ ${order.route}</p></div>
        <span class="status-pill">${order.status}</span>
      </div>
      <div class="order-content">
        <div>
          <div class="credit-stats">
            <div><small>購買</small><strong>${order.purchased}</strong></div>
            <div><small>處理中</small><strong>${order.pending}</strong></div>
            <div><small>已出票</small><strong>${order.used}</strong></div>
            <div class="available"><small>可使用</small><strong>${available}</strong></div>
          </div>
          <div class="order-timeline">
            ${timeline}
          </div>
        </div>
        <aside class="order-side">
          <div class="expiry-box"><small>訂單金額</small><strong>${money(orderGrandTotal(order))}</strong></div>
          <div class="expiry-box"><small>使用期限</small><strong>${order.expiry}</strong></div>
          ${!order.paid ? `<div class="payment-account-box"><small>待匯款（專案保留 1 天）</small><strong>${order.purchased} 張</strong><span>${paymentAccountText(order)}</span></div>` : ""}
          ${order.couponCode ? `<div class="order-note">優惠代碼：${order.couponCode}・折抵 ${money(order.discountAmount || 0)}</div>` : ""}
          ${cabinDetails}
          ${extras}
          <button class="redeem-btn" data-redeem-order="${order.id}" ${available === 0 ? "disabled" : ""}>${order.paid ? "我要使用額度" : "付款確認後即可使用"}</button>
          <button class="supplement-btn" data-supplement-order="${order.id}">補上護照／航班</button>
        </aside>
      </div>
    </article>`;
  }).join("") : `<div class="empty-state">這裡目前沒有訂單。</div>`;

  const activeOrders = orders.filter(order => order.statusType === "active");
  qs("#summary-available").textContent = activeOrders.reduce((sum, order) => sum + getAvailable(order), 0);
  qs("#summary-reserved").textContent = activeOrders.filter(order => !order.paid).reduce((sum, order) => sum + Number(order.purchased || 0), 0);
  qs("#summary-pending").textContent = activeOrders.reduce((sum, order) => sum + order.pending, 0);
  qs("#summary-used").textContent = activeOrders.reduce((sum, order) => sum + order.used, 0);
  qs("#order-badge").textContent = activeOrders.length;
}

function switchView(viewName) {
  qsa(".view").forEach(view => view.classList.toggle("is-active", view.id === `${viewName}-view`));
  qsa(".bottom-nav [data-view-target]").forEach(button => button.classList.toggle("is-active", button.dataset.viewTarget === viewName));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openModal(id) {
  const modal = qs(`#${id}`);
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const modal = qs(`#${id}`);
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function setBookingStep(step) {
  qsa("[data-booking-step]").forEach(panel => panel.classList.toggle("is-active", Number(panel.dataset.bookingStep) === step));
  qsa(".booking-progress span").forEach((bar, index) => bar.classList.toggle("is-active", index < step));
}

function updateBookingSummary() {
  qs("#booking-project-summary").innerHTML = `<div class="summary-symbol">${selectedProject.symbol}</div><div><strong>${selectedProject.id}｜${selectedProject.title}</strong><small>${selectedProject.route}・${selectedProject.credits === 1 ? "單張" : `每組 ${selectedProject.credits} 張`}</small></div>`;
  qs("#booking-quantity").textContent = bookingQuantity;
  qs("#booking-unit-label").textContent = selectedProject.unit;
  qs("#booking-ticket-list").innerHTML = ticketSelections.map(ticket => {
    const label = selectedProject.credits === 1
      ? `第 ${ticket.index + 1} 張`
      : `第 ${ticket.packageNumber} 組・第 ${ticket.ticketNumber} 張`;
    return `<article class="ticket-option-card">
      <div class="ticket-option-head"><strong>${label}</strong><span>${ticket.cabin === "business" ? "商務艙" : "經濟艙"}${ticket.starlux ? "・星宇" : ""}</span></div>
      <div class="cabin-options">
        <label><input type="radio" name="ticket-cabin-${ticket.index}" value="economy" data-ticket-cabin="${ticket.index}" ${ticket.cabin === "economy" ? "checked" : ""}><span><b>經濟艙</b><small>${money(ticket.economyPrice)}</small></span></label>
        <label><input type="radio" name="ticket-cabin-${ticket.index}" value="business" data-ticket-cabin="${ticket.index}" ${ticket.cabin === "business" ? "checked" : ""}><span><b>商務艙</b><small>${money(ticket.businessPrice)}</small></span></label>
      </div>
      <label class="starlux-toggle"><input type="checkbox" data-ticket-starlux="${ticket.index}" ${ticket.starlux ? "checked" : ""}><span><b>指定星宇航空</b><small>本張加購 ${money(STARLUX_PRICE_PER_TICKET)}</small></span></label>
    </article>`;
  }).join("");
  const pricing = bookingPricing();
  qs("#booking-ticket-subtotal").textContent = money(pricing.ticketSubtotal);
  qs("#booking-starlux-total").textContent = money(pricing.starluxTotal);
  qs("#booking-transfer-total").textContent = money(pricing.transferTotal);
  qs("#booking-discount-total").textContent = `-${money(pricing.discountAmount)}`;
  qs("#booking-discount-row").hidden = pricing.discountAmount === 0;
  qs("#booking-total").textContent = money(pricing.grandTotal);
}

function showToast(message) {
  const toast = qs("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

document.addEventListener("click", event => {
  const viewButton = event.target.closest("[data-view-target]");
  if (viewButton) switchView(viewButton.dataset.viewTarget);

  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) {
    qsa("[data-filter]").forEach(button => button.classList.remove("is-active"));
    filterButton.classList.add("is-active");
    renderProjects(filterButton.dataset.filter);
  }

  const orderFilter = event.target.closest("[data-order-filter]");
  if (orderFilter) {
    qsa("[data-order-filter]").forEach(button => button.classList.remove("is-active"));
    orderFilter.classList.add("is-active");
    renderOrders(orderFilter.dataset.orderFilter);
  }

  const faqFilter = event.target.closest("[data-faq-filter]");
  if (faqFilter) {
    activeFaqCategory = faqFilter.dataset.faqFilter;
    qsa("[data-faq-filter]").forEach(button => button.classList.toggle("is-active", button === faqFilter));
    renderFaq(qs("#faq-search").value);
  }

  const bookingButton = event.target.closest("[data-book-project]");
  if (bookingButton) {
    selectedProject = allProjects.find(project => project.id === bookingButton.dataset.bookProject);
    bookingQuantity = 1;
    airportTransfer = "none";
    appliedCoupon = null;
    qs("#coupon-code").value = "";
    qs("#coupon-feedback").textContent = "可減免機場接送或套用指定折扣；每筆訂單限用一組。";
    qs("#coupon-feedback").className = "";
    qsa('input[name="airport-transfer"]').forEach(input => { input.checked = input.value === "none"; });
    rebuildTicketSelections(false);
    updateBookingSummary();
    setBookingStep(1);
    openModal("booking-modal");
  }

  const quantityButton = event.target.closest("[data-quantity]");
  if (quantityButton) {
    bookingQuantity = Math.max(1, Math.min(9, bookingQuantity + (quantityButton.dataset.quantity === "plus" ? 1 : -1)));
    rebuildTicketSelections();
    updateBookingSummary();
  }

  const ticketPreset = event.target.closest("[data-ticket-preset]");
  if (ticketPreset) {
    ticketSelections.forEach(ticket => { ticket.cabin = ticketPreset.dataset.ticketPreset; });
    updateBookingSummary();
  }

  const nextButton = event.target.closest("[data-booking-next]");
  if (nextButton) setBookingStep(Number(nextButton.dataset.bookingNext));

  const closeButton = event.target.closest("[data-close-modal]");
  if (closeButton) closeModal(closeButton.dataset.closeModal);

  const redeemButton = event.target.closest("[data-redeem-order]");
  if (redeemButton) {
    selectedOrder = orders.find(order => order.id === redeemButton.dataset.redeemOrder);
    redeemQuantity = 1;
    qs("#redeem-quantity").textContent = redeemQuantity;
    qs("#redeem-available").textContent = getAvailable(selectedOrder);
    openModal("redeem-modal");
  }

  const redeemQuantityButton = event.target.closest("[data-redeem-quantity]");
  if (redeemQuantityButton) {
    const max = getAvailable(selectedOrder);
    redeemQuantity = Math.max(1, Math.min(max, redeemQuantity + (redeemQuantityButton.dataset.redeemQuantity === "plus" ? 1 : -1)));
    qs("#redeem-quantity").textContent = redeemQuantity;
  }

  const supplementButton = event.target.closest("[data-supplement-order]");
  if (supplementButton) {
    selectedOrder = orders.find(order => order.id === supplementButton.dataset.supplementOrder);
    openModal("supplement-modal");
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "scroll-projects") qs("#projects-section").scrollIntoView({ behavior: "smooth" });
  if (action === "go-orders") { closeModal("booking-modal"); switchView("orders"); renderOrders(); }
  if (action === "submit-redemption") {
    selectedOrder.pending += redeemQuantity;
    selectedOrder.status = "兌換申請已建立";
    if (window.PMRStore) window.PMRStore.upsertOrder(selectedOrder);
    closeModal("redeem-modal");
    renderOrders();
    showToast(`已保留 ${redeemQuantity} 張額度，可稍後補上旅客資料`);
  }
  if (action === "save-files") { closeModal("supplement-modal"); showToast("補件進度已儲存（展示版）"); }
  if (action === "contact") showToast("正式版會開啟您的 LINE 專屬客服聊天室");
  if (action === "profile") showToast("已使用 LINE 身分安全登入");
  if (action === "lookup-project") lookupProject(qs("#project-code-input").value);
  if (action === "apply-coupon") {
    const code = qs("#coupon-code").value.trim().toUpperCase();
    const rule = COUPON_RULES[code];
    if (!rule) {
      appliedCoupon = null;
      qs("#coupon-feedback").textContent = "優惠代碼無效或已過期，請向客服確認。";
      qs("#coupon-feedback").className = "is-error";
    } else {
      appliedCoupon = { code, ...rule };
      qs("#coupon-feedback").textContent = `已套用：${rule.description}`;
      qs("#coupon-feedback").className = "is-success";
    }
    updateBookingSummary();
  }
});

qs("#booking-modal").addEventListener("change", event => {
  const cabinInput = event.target.closest("[data-ticket-cabin]");
  if (cabinInput) {
    const ticket = ticketSelections[Number(cabinInput.dataset.ticketCabin)];
    if (ticket) ticket.cabin = cabinInput.value;
    updateBookingSummary();
    return;
  }
  const starluxInput = event.target.closest("[data-ticket-starlux]");
  if (starluxInput) {
    const ticket = ticketSelections[Number(starluxInput.dataset.ticketStarlux)];
    if (ticket) ticket.starlux = starluxInput.checked;
    updateBookingSummary();
    return;
  }
  if (event.target.matches('input[name="airport-transfer"]')) {
    airportTransfer = event.target.value;
    updateBookingSummary();
  }
});

qs("#booking-form").addEventListener("submit", event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const formData = new FormData(event.currentTarget);
  const pricing = bookingPricing();
  const transfer = AIRPORT_TRANSFERS[airportTransfer];
  const introducer = formData.get("referrer");
  const checkoutAddOns = [];
  if (pricing.starluxCount) checkoutAddOns.push({
    name: `指定星宇航空（${pricing.starluxCount} 張）`,
    price: pricing.starluxTotal,
    cost: 0,
    quantity: pricing.starluxCount,
    unitPrice: STARLUX_PRICE_PER_TICKET,
    source: "checkout",
    costStatus: "待客服填入"
  });
  if (transfer.price) checkoutAddOns.push({
    name: transfer.label,
    price: transfer.price,
    cost: 0,
    quantity: 1,
    unitPrice: transfer.price,
    source: "checkout",
    costStatus: "待客服填入"
  });
  if (formData.get("note")) checkoutAddOns.push({ name: "特殊需求待報價", price: 0, cost: 0, source: "manual" });
  const newId = `PMR-260914-${String(orders.length + 19).padStart(3, "0")}`;
  const newOrder = {
    id: newId,
    customerId: "CUS-0001",
    lineUserId: "demo-yvonne",
    lineDisplayName: "Yvonne",
    customerName: formData.get("name"),
    phone: formData.get("phone"),
    projectId: selectedProject.id,
    title: selectedProject.title,
    route: selectedProject.route,
    purchased: selectedProject.credits * bookingQuantity,
    pending: 0,
    used: 0,
    refunded: 0,
    paid: false,
    expiry: selectedProject.expiry,
    status: "等待付款",
    statusType: "active",
    total: pricing.ticketSubtotal,
    grandTotal: pricing.grandTotal,
    paymentAmount: 0,
    paymentStatus: "待匯款",
    cost: pricing.ticketCost,
    serviceFee: ticketSelections.length * 500,
    introducer,
    paymentAccount: { ...INTRODUCER_ACCOUNTS[introducer] },
    reservationExpiresAt: "2026/09/15 23:59",
    couponCode: appliedCoupon?.code || "",
    couponType: appliedCoupon?.type || "",
    couponDescription: appliedCoupon?.description || "",
    discountAmount: pricing.discountAmount,
    introducerProfit: 0,
    sourceProfit: 0,
    docsStatus: "尚未補件",
    ticketStatus: "尚未出票",
    assignedTo: "待分派",
    nextActionDate: "2026-09-15",
    internalNotes: formData.get("note") || "",
    ticketSelections: ticketSelections.map(ticket => ({
      ticketNumber: ticket.index + 1,
      packageNumber: ticket.packageNumber,
      cabin: ticket.cabin,
      starlux: ticket.starlux,
      sellPrice: ticket.cabin === "business" ? ticket.businessPrice : ticket.economyPrice,
      cost: ticket.cabin === "business" ? ticket.businessCost : ticket.economyCost
    })),
    cabinSummary: { economy: pricing.economyCount, business: pricing.businessCount },
    airportTransfer,
    addOns: checkoutAddOns,
    createdAt: "2026/09/14",
    activity: [{ at: "2026/09/14", text: `客戶由前台建立訂單，${ticketSelections.length} 張待匯款保留 1 天` }]
  };
  orders.unshift(newOrder);
  if (window.PMRStore) window.PMRStore.upsertOrder(newOrder);
  qs("#success-order-id").textContent = newId;
  qs("#success-reserved").textContent = `專案已保留 ${newOrder.purchased} 張，保留 1 天`;
  qs("#success-payment-account").textContent = paymentAccountText(newOrder);
  setBookingStep(3);
  renderOrders();
  event.currentTarget.reset();
});

qs("#project-code-form").addEventListener("submit", event => {
  event.preventDefault();
  lookupProject(qs("#project-code-input").value);
});

qsa("[data-code-example]").forEach(button => button.addEventListener("click", () => {
  qs("#project-code-input").value = button.dataset.codeExample;
  lookupProject(button.dataset.codeExample);
}));

qs("#faq-search").addEventListener("input", event => renderFaq(event.currentTarget.value));

qsa(".upload-card input").forEach(input => input.addEventListener("change", () => {
  input.closest(".upload-card").classList.toggle("has-file", input.files.length > 0);
  const files = qsa(".upload-card input").flatMap(element => [...element.files]);
  qs("#selected-files").textContent = files.length ? `已選擇 ${files.length} 個檔案：${files.map(file => file.name).join("、")}` : "尚未選擇檔案";
}));

qsa(".modal-backdrop").forEach(modal => modal.addEventListener("click", event => {
  if (event.target === modal) closeModal(modal.id);
}));

document.addEventListener("keydown", event => {
  if (event.key === "Escape") qsa(".modal-backdrop.is-open").forEach(modal => closeModal(modal.id));
});

renderProjects();
renderOrders();
renderFaq();

window.addEventListener("storage", event => {
  if (!window.PMRStore || event.key !== window.PMRStore.keys.orders) return;
  orders = window.PMRStore.getOrders().filter(order => order.customerId === "CUS-0001");
  selectedOrder = orders[0];
  renderOrders();
});

"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const Database = require("better-sqlite3");
const betterSqlite3 = require("drizzle-orm/better-sqlite3");
const sqliteCore = require("drizzle-orm/sqlite-core");
const drizzleOrm = require("drizzle-orm");
const nodeThermalPrinter = require("node-thermal-printer");
const fs = require("fs");
const os = require("os");
const child_process = require("child_process");
const crypto = require("crypto");
const icon = path.join(__dirname, "../../resources/icon.png");
const categories = sqliteCore.sqliteTable("categories", {
  id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
  name: sqliteCore.text("name").notNull(),
  sortOrder: sqliteCore.integer("sort_order").notNull().default(0),
  isActive: sqliteCore.integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`)
});
const products = sqliteCore.sqliteTable("products", {
  id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
  categoryId: sqliteCore.integer("category_id").notNull().references(() => categories.id),
  name: sqliteCore.text("name").notNull(),
  price: sqliteCore.integer("price").notNull().default(0),
  hasVariants: sqliteCore.integer("has_variants", { mode: "boolean" }).notNull().default(false),
  isActive: sqliteCore.integer("is_active", { mode: "boolean" }).notNull().default(true),
  timesSold: sqliteCore.integer("times_sold").notNull().default(0),
  lastSoldAt: sqliteCore.text("last_sold_at"),
  createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`)
});
const variants = sqliteCore.sqliteTable("variants", {
  id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
  productId: sqliteCore.integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  name: sqliteCore.text("name").notNull(),
  price: sqliteCore.integer("price").notNull().default(0),
  sortOrder: sqliteCore.integer("sort_order").notNull().default(0),
  isActive: sqliteCore.integer("is_active", { mode: "boolean" }).notNull().default(true)
});
const restaurantTables = sqliteCore.sqliteTable("restaurant_tables", {
  id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
  name: sqliteCore.text("name").notNull(),
  isActive: sqliteCore.integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`)
});
const waiters = sqliteCore.sqliteTable("waiters", {
  id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
  name: sqliteCore.text("name").notNull(),
  isActive: sqliteCore.integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`)
});
const orders = sqliteCore.sqliteTable("orders", {
  id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
  orderNumber: sqliteCore.text("order_number").notNull().unique(),
  orderType: sqliteCore.text("order_type", { enum: ["dine_in", "take_away", "delivery"] }).notNull(),
  tableId: sqliteCore.integer("table_id").references(() => restaurantTables.id),
  waiterId: sqliteCore.integer("waiter_id").references(() => waiters.id),
  status: sqliteCore.text("status", { enum: ["pending", "paid", "cancelled"] }).notNull().default("pending"),
  subtotal: sqliteCore.integer("subtotal").notNull().default(0),
  discountPercent: sqliteCore.integer("discount_percent").notNull().default(0),
  discount: sqliteCore.integer("discount").notNull().default(0),
  deliveryCharge: sqliteCore.integer("delivery_charge").notNull().default(0),
  serviceCharge: sqliteCore.integer("service_charge").notNull().default(0),
  taxAmount: sqliteCore.integer("tax_amount").notNull().default(0),
  total: sqliteCore.integer("total").notNull().default(0),
  note: sqliteCore.text("note"),
  userId: sqliteCore.integer("user_id").references(() => users.id),
  customerName: sqliteCore.text("customer_name"),
  customerPhone: sqliteCore.text("customer_phone"),
  customerAddress: sqliteCore.text("customer_address"),
  createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`),
  paidAt: sqliteCore.text("paid_at"),
  kitchenPrintedAt: sqliteCore.text("kitchen_printed_at"),
  amountPaid: sqliteCore.integer("amount_paid").notNull().default(0)
});
const orderPayments = sqliteCore.sqliteTable("order_payments", {
  id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
  orderId: sqliteCore.integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  amount: sqliteCore.integer("amount").notNull(),
  method: sqliteCore.text("method").notNull().default("cash"),
  note: sqliteCore.text("note"),
  createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`)
});
const orderItems = sqliteCore.sqliteTable("order_items", {
  id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
  orderId: sqliteCore.integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: sqliteCore.integer("product_id").notNull(),
  variantId: sqliteCore.integer("variant_id"),
  productName: sqliteCore.text("product_name").notNull(),
  variantName: sqliteCore.text("variant_name"),
  unitPrice: sqliteCore.integer("unit_price").notNull(),
  quantity: sqliteCore.integer("quantity").notNull().default(1),
  note: sqliteCore.text("note"),
  lineTotal: sqliteCore.integer("line_total").notNull()
});
const users = sqliteCore.sqliteTable("users", {
  id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
  name: sqliteCore.text("name").notNull(),
  role: sqliteCore.text("role", { enum: ["admin", "cashier"] }).notNull().default("cashier"),
  pinHash: sqliteCore.text("pin_hash").notNull(),
  pinSalt: sqliteCore.text("pin_salt").notNull(),
  isActive: sqliteCore.integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`)
});
const expenseItems = sqliteCore.sqliteTable("expense_items", {
  id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
  name: sqliteCore.text("name").notNull(),
  isActive: sqliteCore.integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`)
});
const expenses = sqliteCore.sqliteTable("expenses", {
  id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
  expenseDate: sqliteCore.text("expense_date").notNull(),
  category: sqliteCore.text("category", { enum: ["ingredients", "utilities", "salaries", "rent", "equipment", "other"] }).notNull(),
  expenseItemId: sqliteCore.integer("expense_item_id").references(() => expenseItems.id),
  quantity: sqliteCore.text("quantity"),
  description: sqliteCore.text("description"),
  amount: sqliteCore.integer("amount").notNull(),
  userId: sqliteCore.integer("user_id").references(() => users.id),
  createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`)
});
const customers = sqliteCore.sqliteTable("customers", {
  id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
  name: sqliteCore.text("name"),
  phone: sqliteCore.text("phone").notNull().unique(),
  address: sqliteCore.text("address"),
  timesOrdered: sqliteCore.integer("times_ordered").notNull().default(0),
  lastOrderAt: sqliteCore.text("last_order_at"),
  createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`)
});
const settings = sqliteCore.sqliteTable("settings", {
  key: sqliteCore.text("key").primaryKey(),
  value: sqliteCore.text("value").notNull()
});
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  categories,
  customers,
  expenseItems,
  expenses,
  orderItems,
  orderPayments,
  orders,
  products,
  restaurantTables,
  settings,
  users,
  variants,
  waiters
}, Symbol.toStringTag, { value: "Module" }));
const SML = (s, m, l) => [
  ["Small", s],
  ["Medium", m],
  ["Large", l]
];
const MENU = {
  Pizza: [
    { name: "Chicken Fajita Pizza", variants: SML(550, 950, 1400) },
    { name: "Chicken Tikka Pizza", variants: SML(550, 950, 1400) },
    { name: "Veggie Lover Pizza", variants: SML(550, 950, 1400) },
    { name: "Cheese Lover Pizza", variants: SML(550, 950, 1400) },
    { name: "Shahi Pizza", variants: SML(600, 1e3, 1500) },
    { name: "Bone Fire Pizza", variants: SML(600, 1e3, 1500) },
    { name: "Supreme Pizza", variants: SML(600, 1e3, 1500) },
    { name: "Shawarma Pizza", variants: SML(600, 1e3, 1500) },
    { name: "Afghani Tikka Pizza", variants: SML(650, 1050, 1600) },
    { name: "Seekh Kabab Pizza", variants: SML(650, 1050, 1600) },
    { name: "BBQ Pizza", variants: SML(650, 1050, 1600) },
    { name: "Malai Boti Pizza", variants: SML(650, 1050, 1600) },
    { name: "Peri Peri Pizza", variants: SML(650, 1050, 1600) },
    { name: "Extreme Pizza", variants: SML(700, 1100, 1700) },
    { name: "Special Behari Pizza", variants: SML(700, 1100, 1700) },
    { name: "Crown Crust Pizza", variants: SML(700, 1100, 1700) },
    { name: "Lasagnia Pizza", variants: SML(750, 1150, 1800) },
    { name: "Special Islamic Pizza", variants: SML(750, 1150, 1800) },
    {
      name: "Extra Large Pizza",
      variants: [
        ["2300", 2300],
        ["2500", 2500],
        ["2700", 2700]
      ]
    }
  ],
  Wraps: [
    { name: "Arabic Wrap", price: 550 },
    { name: "Crispy Wrap", price: 650 },
    { name: "BBQ Wrap", price: 650 }
  ],
  "Chicken Rolls": [
    { name: "Shawarma Roll", price: 220 },
    { name: "Paratha Roll", price: 300 },
    { name: "Cheese Paratha Roll", price: 350 },
    { name: "Cheese Shawarma", price: 250 },
    { name: "Kabab Paratha", price: 300 },
    { name: "Zingish Roll", price: 350 },
    { name: "Pizza Paratha", price: 600 },
    { name: "Behari Roll", price: 350 },
    { name: "Turkish Roll", price: 400 },
    { name: "Shawarma Sandwich", price: 550 }
  ],
  Fries: [
    {
      name: "Fries",
      variants: [
        ["Regular", 200],
        ["Medium", 300],
        ["Family", 400]
      ]
    },
    {
      name: "Loaded Fries",
      variants: [
        ["Small", 400],
        ["Large", 800]
      ]
    }
  ],
  Pasta: [
    {
      name: "Cheese Pasta",
      variants: [
        ["Small", 500],
        ["Large", 900]
      ]
    },
    {
      name: "Crunchy Pasta",
      variants: [
        ["Small", 550],
        ["Large", 950]
      ]
    }
  ],
  Burgers: [
    { name: "Zinger Burger", price: 330 },
    { name: "Tikka Burger", price: 300 },
    { name: "Chicken Patty Burger", price: 300 },
    { name: "Double Patty Burger", price: 500 },
    { name: "Kabab Burger", price: 300 },
    { name: "Grill Burger", price: 600 },
    { name: "Double Decker Burger", price: 600 },
    { name: "Mighty Burger", price: 650 },
    { name: "Thunder Cheese Burger", price: 450 }
  ],
  "Chicken Broast": [
    { name: "Chest Piece", price: 400 },
    { name: "Leg Piece", price: 380 },
    { name: "Zinger Piece", price: 250 },
    { name: "Drum Piece", price: 250 },
    { name: "Thigh Piece", price: 250 },
    { name: "BBQ Piece", price: 400 }
  ],
  Nuggets: [
    {
      name: "Nuggets",
      variants: [
        ["6 Pcs", 300],
        ["12 Pcs", 600]
      ]
    }
  ],
  "Hot Wings": [
    {
      name: "Hot Wings",
      variants: [
        ["6 Pcs", 300],
        ["12 Pcs", 600]
      ]
    }
  ],
  "Seekh Kabab": [{ name: "Seekh Kabab (6 Pcs)", price: 400 }],
  Extras: [
    {
      name: "Extra Topping Chicken Cheese",
      variants: [
        ["Small", 100],
        ["Medium", 150],
        ["Large", 250]
      ]
    },
    { name: "Dip Sauce", price: 50 },
    { name: "Cheese Sauce", price: 60 }
  ]
};
function seedIfEmpty() {
  const sqlite2 = getSqlite();
  const count = sqlite2.prepare("SELECT COUNT(*) as c FROM products").get();
  if (count.c > 0) return;
  const insertCat = sqlite2.prepare("INSERT INTO categories (name, sort_order) VALUES (?, ?)");
  const insertProd = sqlite2.prepare(
    "INSERT INTO products (category_id, name, price, has_variants) VALUES (?, ?, ?, ?)"
  );
  const insertVar = sqlite2.prepare(
    "INSERT INTO variants (product_id, name, price, sort_order) VALUES (?, ?, ?, ?)"
  );
  const tx = sqlite2.transaction(() => {
    let catOrder = 0;
    for (const [catName, items] of Object.entries(MENU)) {
      const catId = insertCat.run(catName, catOrder++).lastInsertRowid;
      for (const item of items) {
        const hasVariants = (item.variants?.length ?? 0) > 0;
        const prodId = insertProd.run(
          catId,
          item.name,
          hasVariants ? 0 : item.price ?? 0,
          hasVariants ? 1 : 0
        ).lastInsertRowid;
        item.variants?.forEach(([vName, vPrice], i) => {
          insertVar.run(prodId, vName, vPrice, i);
        });
      }
    }
  });
  tx();
  console.log("[db] menu seeded");
}
let sqlite = null;
let db = null;
const MIGRATIONS = [
  // v1 â€” initial schema
  `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    name TEXT NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    has_variants INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    times_sold INTEGER NOT NULL DEFAULT 0,
    last_sold_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE TABLE IF NOT EXISTS variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS restaurant_tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE TABLE IF NOT EXISTS waiters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL UNIQUE,
    order_type TEXT NOT NULL,
    table_id INTEGER REFERENCES restaurant_tables(id),
    waiter_id INTEGER REFERENCES waiters(id),
    status TEXT NOT NULL DEFAULT 'pending',
    subtotal INTEGER NOT NULL DEFAULT 0,
    discount INTEGER NOT NULL DEFAULT 0,
    tax_amount INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL DEFAULT 0,
    note TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    paid_at TEXT
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL,
    variant_id INTEGER,
    product_name TEXT NOT NULL,
    variant_name TEXT,
    unit_price INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    note TEXT,
    line_total INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
  CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
  CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
  CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
  `,
  // v2 — delivery customer info + percentage discount
  `
  ALTER TABLE orders ADD COLUMN customer_phone TEXT;
  ALTER TABLE orders ADD COLUMN customer_address TEXT;
  ALTER TABLE orders ADD COLUMN discount_percent INTEGER NOT NULL DEFAULT 0;
  `,
  // v3 - users with PIN auth + order attribution
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'cashier',
    pin_hash TEXT NOT NULL,
    pin_salt TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  ALTER TABLE orders ADD COLUMN user_id INTEGER REFERENCES users(id);
  `,
  // v4 - expense items + expenses + customers
  `
  CREATE TABLE IF NOT EXISTS expense_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    expense_date TEXT NOT NULL,
    category TEXT NOT NULL,
    expense_item_id INTEGER REFERENCES expense_items(id),
    quantity TEXT,
    description TEXT,
    amount INTEGER NOT NULL,
    user_id INTEGER REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
  CREATE INDEX IF NOT EXISTS idx_expenses_item ON expenses(expense_item_id);
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT NOT NULL UNIQUE,
    address TEXT,
    times_ordered INTEGER NOT NULL DEFAULT 0,
    last_order_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
  `,
  // v5 - delivery charge on orders
  `
  ALTER TABLE orders ADD COLUMN delivery_charge INTEGER NOT NULL DEFAULT 0;
  `,
  // v6 - customer name on every order, manual service charge, part payments,
  // kitchen printing as a timestamp instead of a status.
  `
  ALTER TABLE orders ADD COLUMN customer_name TEXT;
  ALTER TABLE orders ADD COLUMN service_charge INTEGER NOT NULL DEFAULT 0;
  ALTER TABLE orders ADD COLUMN amount_paid INTEGER NOT NULL DEFAULT 0;
  ALTER TABLE orders ADD COLUMN kitchen_printed_at TEXT;
  CREATE TABLE IF NOT EXISTS order_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    method TEXT NOT NULL DEFAULT 'cash',
    note TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE INDEX IF NOT EXISTS idx_order_payments_order ON order_payments(order_id);
  CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders(customer_name);
  UPDATE orders SET kitchen_printed_at = created_at WHERE status = 'kitchen_printed';
  UPDATE orders SET amount_paid = total WHERE status = 'paid';
  UPDATE orders SET status = 'pending' WHERE status = 'kitchen_printed';
  INSERT INTO order_payments (order_id, amount, method, created_at)
    SELECT id, total, 'cash', COALESCE(paid_at, created_at) FROM orders WHERE status = 'paid';
  `
];
function ensureColumns(conn) {
  const cols = conn.prepare(`PRAGMA table_info(orders)`).all().map(
    (c) => c.name
  );
  const add = (name, ddl) => {
    if (!cols.includes(name)) conn.exec(`ALTER TABLE orders ADD COLUMN ${ddl};`);
  };
  add("delivery_charge", "delivery_charge INTEGER NOT NULL DEFAULT 0");
  add("customer_name", "customer_name TEXT");
  add("service_charge", "service_charge INTEGER NOT NULL DEFAULT 0");
  add("amount_paid", "amount_paid INTEGER NOT NULL DEFAULT 0");
  add("kitchen_printed_at", "kitchen_printed_at TEXT");
  conn.exec(`
    CREATE TABLE IF NOT EXISTS order_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      amount INTEGER NOT NULL,
      method TEXT NOT NULL DEFAULT 'cash',
      note TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );
    CREATE INDEX IF NOT EXISTS idx_order_payments_order ON order_payments(order_id);
  `);
  conn.exec(`
    UPDATE orders SET kitchen_printed_at = created_at
      WHERE status = 'kitchen_printed' AND kitchen_printed_at IS NULL;
    UPDATE orders SET amount_paid = total WHERE status = 'paid' AND amount_paid = 0;
    UPDATE orders SET status = 'pending' WHERE status = 'kitchen_printed';
  `);
}
function runMigrations(conn) {
  const current = conn.pragma("user_version", { simple: true });
  for (let v = current; v < MIGRATIONS.length; v++) {
    const migrate = conn.transaction(() => {
      conn.exec(MIGRATIONS[v]);
      conn.pragma(`user_version = ${v + 1}`);
    });
    migrate();
    console.log(`[db] migration v${v + 1} applied`);
  }
  ensureColumns(conn);
}
function initDatabase() {
  const dbPath = path.join(electron.app.getPath("userData"), "restaurant-pos.db");
  sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  runMigrations(sqlite);
  db = betterSqlite3.drizzle(sqlite, { schema });
  seedIfEmpty();
  console.log("[db] ready at", dbPath);
}
function getDb() {
  if (!db) throw new Error("Database not initialized. Call initDatabase() first.");
  return db;
}
function getSqlite() {
  if (!sqlite) throw new Error("Database not initialized.");
  return sqlite;
}
function closeDatabase() {
  sqlite?.close();
  sqlite = null;
  db = null;
}
function listCategories() {
  return getDb().select().from(categories).orderBy(drizzleOrm.asc(categories.sortOrder), drizzleOrm.asc(categories.name)).all();
}
function createCategory(input) {
  const name = input.name.trim();
  if (!name) throw new Error("Category name is required");
  const row = getDb().insert(categories).values({ name, sortOrder: input.sortOrder ?? 0 }).returning().get();
  return row;
}
function updateCategory(input) {
  const { id, ...changes } = input;
  if (changes.name !== void 0 && !changes.name.trim()) {
    throw new Error("Category name cannot be empty");
  }
  const row = getDb().update(categories).set(changes).where(drizzleOrm.eq(categories.id, id)).returning().get();
  if (!row) throw new Error("Category not found");
  return row;
}
function deleteCategory(id) {
  const used = getSqlite().prepare("SELECT COUNT(*) as count FROM products WHERE category_id = ?").get(id);
  if (used.count > 0) {
    throw new Error("This category has products. Move or delete its products first, or disable the category.");
  }
  const result = getDb().delete(categories).where(drizzleOrm.eq(categories.id, id)).run();
  if (result.changes === 0) throw new Error("Category not found");
}
function makeService(table) {
  return {
    list() {
      return getDb().select().from(table).orderBy(drizzleOrm.asc(table.name)).all();
    },
    create(input) {
      const name = input.name.trim();
      if (!name) throw new Error("Name is required");
      return getDb().insert(table).values({ name }).returning().get();
    },
    update(input) {
      const { id, ...changes } = input;
      if (changes.name !== void 0 && !changes.name.trim()) {
        throw new Error("Name cannot be empty");
      }
      if (changes.name !== void 0) changes.name = changes.name.trim();
      const row = getDb().update(table).set(changes).where(drizzleOrm.eq(table.id, id)).returning().get();
      if (!row) throw new Error("Not found");
      return row;
    },
    remove(id) {
      const result = getDb().delete(table).where(drizzleOrm.eq(table.id, id)).run();
      if (result.changes === 0) throw new Error("Not found");
    }
  };
}
const tablesService = makeService(restaurantTables);
const waitersService = makeService(waiters);
function validateVariants(list) {
  const cleaned = list.map((v) => ({ name: v.name.trim(), price: Math.round(v.price) })).filter((v) => v.name.length > 0);
  const names = new Set(cleaned.map((v) => v.name.toLowerCase()));
  if (names.size !== cleaned.length) throw new Error("Variant names must be unique");
  for (const v of cleaned) {
    if (v.price < 0) throw new Error("Variant price cannot be negative");
  }
  return cleaned;
}
function listProducts() {
  const db2 = getDb();
  const prods = db2.select({
    id: products.id,
    categoryId: products.categoryId,
    name: products.name,
    price: products.price,
    hasVariants: products.hasVariants,
    isActive: products.isActive,
    timesSold: products.timesSold,
    lastSoldAt: products.lastSoldAt,
    createdAt: products.createdAt,
    categoryName: categories.name
  }).from(products).innerJoin(categories, drizzleOrm.eq(products.categoryId, categories.id)).orderBy(drizzleOrm.asc(categories.sortOrder), drizzleOrm.asc(categories.name), drizzleOrm.asc(products.name)).all();
  const allVariants = db2.select().from(variants).orderBy(drizzleOrm.asc(variants.sortOrder), drizzleOrm.asc(variants.id)).all();
  const byProduct = /* @__PURE__ */ new Map();
  for (const v of allVariants) {
    const arr = byProduct.get(v.productId) ?? [];
    arr.push(v);
    byProduct.set(v.productId, arr);
  }
  return prods.map((p) => ({ ...p, variants: byProduct.get(p.id) ?? [] }));
}
function createProduct(input) {
  const name = input.name.trim();
  if (!name) throw new Error("Product name is required");
  if (input.price < 0) throw new Error("Price cannot be negative");
  const variantList = validateVariants(input.variants ?? []);
  const hasVariants = variantList.length > 0;
  const db2 = getDb();
  const tx = getSqlite().transaction(() => {
    const row = db2.insert(products).values({
      categoryId: input.categoryId,
      name,
      price: hasVariants ? 0 : Math.round(input.price),
      hasVariants
    }).returning().get();
    variantList.forEach((v, i) => {
      db2.insert(variants).values({ productId: row.id, name: v.name, price: v.price, sortOrder: i }).run();
    });
    return row;
  });
  return tx();
}
function updateProduct(input) {
  const db2 = getDb();
  const { id, variants: variantList, ...changes } = input;
  if (changes.name !== void 0) {
    changes.name = changes.name.trim();
    if (!changes.name) throw new Error("Product name cannot be empty");
  }
  if (changes.price !== void 0 && changes.price < 0) {
    throw new Error("Price cannot be negative");
  }
  const tx = getSqlite().transaction(() => {
    let cleanedVariants;
    if (variantList !== void 0) {
      cleanedVariants = validateVariants(variantList);
      db2.delete(variants).where(drizzleOrm.eq(variants.productId, id)).run();
      cleanedVariants.forEach((v, i) => {
        db2.insert(variants).values({ productId: id, name: v.name, price: v.price, sortOrder: i }).run();
      });
    }
    const finalChanges = { ...changes };
    if (cleanedVariants !== void 0) {
      finalChanges.hasVariants = cleanedVariants.length > 0;
      if (cleanedVariants.length > 0) finalChanges.price = 0;
    }
    if (changes.price !== void 0) finalChanges.price = Math.round(changes.price);
    const row = db2.update(products).set(finalChanges).where(drizzleOrm.eq(products.id, id)).returning().get();
    if (!row) throw new Error("Product not found");
    return row;
  });
  return tx();
}
function deleteProduct(id) {
  const used = getSqlite().prepare("SELECT COUNT(*) as count FROM order_items WHERE product_id = ?").get(id);
  if (used.count > 0) {
    throw new Error("This product has been used in orders. Disable it instead of deleting.");
  }
  const result = getDb().delete(products).where(drizzleOrm.eq(products.id, id)).run();
  if (result.changes === 0) throw new Error("Product not found");
}
function searchCustomers(query) {
  const q = query.trim();
  if (q.length < 3) return [];
  return getSqlite().prepare(
    `SELECT id, name, phone, address, times_ordered AS timesOrdered,
              last_order_at AS lastOrderAt, created_at AS createdAt
       FROM customers
       WHERE phone LIKE ? OR LOWER(COALESCE(name,'')) LIKE LOWER(?)
       ORDER BY times_ordered DESC, last_order_at DESC
       LIMIT 6`
  ).all(`%${q}%`, `%${q}%`);
}
function upsertCustomerOnOrder(input) {
  const phone = input.phone.trim();
  if (!phone) return;
  const now = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " ");
  const db2 = getDb();
  const existing = db2.select().from(customers).where(drizzleOrm.eq(customers.phone, phone)).get();
  if (existing) {
    db2.update(customers).set({
      name: input.name?.trim() || existing.name,
      address: input.address?.trim() || existing.address,
      timesOrdered: existing.timesOrdered + 1,
      lastOrderAt: now
    }).where(drizzleOrm.eq(customers.id, existing.id)).run();
  } else {
    db2.insert(customers).values({
      phone,
      name: input.name?.trim() || null,
      address: input.address?.trim() || null,
      timesOrdered: 1,
      lastOrderAt: now
    }).run();
  }
}
function nowStamp() {
  const d = /* @__PURE__ */ new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
function nextOrderNumber() {
  const today = /* @__PURE__ */ new Date();
  const y = today.getFullYear();
  const mo = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const datePart = `${y}${mo}${d}`;
  const row = getSqlite().prepare(`SELECT COUNT(*) as c FROM orders WHERE order_number LIKE ?`).get(`${datePart}-%`);
  return `${datePart}-${String(row.c + 1).padStart(3, "0")}`;
}
function createOrder(input) {
  if (!input.items || input.items.length === 0) throw new Error("Order has no items");
  if (input.orderType === "dine_in" && !input.tableId) throw new Error("Select a table for dine-in");
  const discountInput = Math.max(0, Math.round(input.discountAmount ?? 0));
  const deliveryChargeInput = input.orderType === "delivery" ? Math.max(0, Math.round(input.deliveryCharge ?? 0)) : 0;
  const serviceChargeInput = Math.max(0, Math.round(input.serviceCharge ?? 0));
  const db2 = getDb();
  const sqlite2 = getSqlite();
  const tx = sqlite2.transaction(() => {
    const resolvedItems = input.items.map((item) => {
      const product = db2.select().from(products).where(drizzleOrm.eq(products.id, item.productId)).get();
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (item.quantity < 1) throw new Error("Quantity must be at least 1");
      let unitPrice = product.price;
      let variantName = null;
      if (item.variantId != null) {
        const variant = db2.select().from(variants).where(drizzleOrm.eq(variants.id, item.variantId)).get();
        if (!variant || variant.productId !== product.id) throw new Error("Invalid variant");
        unitPrice = variant.price;
        variantName = variant.name;
      } else if (product.hasVariants) {
        throw new Error(`${product.name} requires a variant`);
      }
      return {
        productId: product.id,
        variantId: item.variantId ?? null,
        productName: product.name,
        variantName,
        unitPrice,
        quantity: Math.round(item.quantity),
        note: item.note?.trim() || null,
        lineTotal: unitPrice * Math.round(item.quantity)
      };
    });
    const subtotal = resolvedItems.reduce((sum, i) => sum + i.lineTotal, 0);
    const discount = Math.min(discountInput, subtotal);
    const discountPercent = subtotal > 0 ? Math.round(discount / subtotal * 100) : 0;
    const total = subtotal - discount + deliveryChargeInput + serviceChargeInput;
    const now = nowStamp();
    const order = db2.insert(orders).values({
      userId: input.userId ?? null,
      orderNumber: nextOrderNumber(),
      orderType: input.orderType,
      tableId: input.orderType === "dine_in" ? input.tableId ?? null : null,
      waiterId: input.orderType === "dine_in" ? input.waiterId ?? null : null,
      status: input.markPaid ? "paid" : "pending",
      subtotal,
      discountPercent,
      discount,
      deliveryCharge: deliveryChargeInput,
      serviceCharge: serviceChargeInput,
      amountPaid: input.markPaid ? total : 0,
      taxAmount: 0,
      total,
      note: input.note?.trim() || null,
      customerName: input.customerName?.trim() || null,
      customerPhone: input.orderType === "delivery" ? input.customerPhone?.trim() || null : null,
      customerAddress: input.orderType === "delivery" ? input.customerAddress?.trim() || null : null,
      paidAt: input.markPaid ? now : null
    }).returning().get();
    const savedItems = resolvedItems.map(
      (item) => db2.insert(orderItems).values({ ...item, orderId: order.id }).returning().get()
    );
    if (input.markPaid && total > 0) {
      sqlite2.prepare("INSERT INTO order_payments (order_id, amount, method, created_at) VALUES (?, ?, 'cash', ?)").run(order.id, total, now);
    }
    const bump = sqlite2.prepare(
      `UPDATE products SET times_sold = times_sold + ?, last_sold_at = ? WHERE id = ?`
    );
    for (const item of resolvedItems) {
      bump.run(item.quantity, now, item.productId);
    }
    if (input.orderType === "delivery" && input.customerPhone?.trim()) {
      upsertCustomerOnOrder({
        phone: input.customerPhone,
        name: input.customerName,
        address: input.customerAddress
      });
    }
    return { ...order, items: savedItems };
  });
  return tx();
}
function listOrders(filter = {}) {
  const sqlite2 = getSqlite();
  const conditions = [];
  const params = [];
  if (filter.date) {
    conditions.push(`date(created_at) = ?`);
    params.push(filter.date);
  }
  if (filter.status === "kitchen") {
    conditions.push("kitchen_printed_at IS NOT NULL AND status = 'pending'");
  } else if (filter.status && filter.status !== "all") {
    conditions.push(`status = ?`);
    params.push(filter.status);
  }
  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const orderRows = sqlite2.prepare(`SELECT * FROM orders ${where} ORDER BY id DESC LIMIT 500`).all(...params);
  if (orderRows.length === 0) return [];
  const ids = orderRows.map((o) => o.id);
  const itemRows = sqlite2.prepare(
    `SELECT * FROM order_items WHERE order_id IN (${ids.map(() => "?").join(",")})`
  ).all(...ids);
  const itemsByOrder = /* @__PURE__ */ new Map();
  for (const item of itemRows) {
    const oid = item.order_id;
    const arr = itemsByOrder.get(oid) ?? [];
    arr.push(item);
    itemsByOrder.set(oid, arr);
  }
  const mapItem = (r) => ({
    id: r.id,
    orderId: r.order_id,
    productId: r.product_id,
    variantId: r.variant_id,
    productName: r.product_name,
    variantName: r.variant_name,
    unitPrice: r.unit_price,
    quantity: r.quantity,
    note: r.note,
    lineTotal: r.line_total
  });
  return orderRows.map((r) => ({
    id: r.id,
    orderNumber: r.order_number,
    orderType: r.order_type,
    tableId: r.table_id,
    waiterId: r.waiter_id,
    status: r.status,
    subtotal: r.subtotal,
    discountPercent: r.discount_percent,
    discount: r.discount,
    deliveryCharge: r.delivery_charge,
    taxAmount: r.tax_amount,
    total: r.total,
    note: r.note,
    customerName: r.customer_name,
    customerPhone: r.customer_phone,
    customerAddress: r.customer_address,
    serviceCharge: r.service_charge,
    amountPaid: r.amount_paid,
    createdAt: r.created_at,
    paidAt: r.paid_at,
    kitchenPrintedAt: r.kitchen_printed_at,
    items: (itemsByOrder.get(r.id) ?? []).map(mapItem)
  }));
}
function updateOrderItems(input) {
  if (!input.items || input.items.length === 0) throw new Error("Order has no items");
  const discountInput = Math.max(0, Math.round(input.discountAmount ?? 0));
  const db2 = getDb();
  const sqlite2 = getSqlite();
  const tx = sqlite2.transaction(() => {
    const existing = db2.select().from(orders).where(drizzleOrm.eq(orders.id, input.orderId)).get();
    if (!existing) throw new Error("Order not found");
    if (existing.status !== "pending") {
      throw new Error("Only unpaid orders can be edited");
    }
    const oldItems = db2.select().from(orderItems).where(drizzleOrm.eq(orderItems.orderId, input.orderId)).all();
    const unbump = sqlite2.prepare(
      `UPDATE products SET times_sold = MAX(0, times_sold - ?) WHERE id = ?`
    );
    for (const item of oldItems) {
      unbump.run(item.quantity, item.productId);
    }
    db2.delete(orderItems).where(drizzleOrm.eq(orderItems.orderId, input.orderId)).run();
    const resolvedItems = input.items.map((item) => {
      const product = db2.select().from(products).where(drizzleOrm.eq(products.id, item.productId)).get();
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (item.quantity < 1) throw new Error("Quantity must be at least 1");
      let unitPrice = product.price;
      let variantName = null;
      if (item.variantId != null) {
        const variant = db2.select().from(variants).where(drizzleOrm.eq(variants.id, item.variantId)).get();
        if (!variant || variant.productId !== product.id) throw new Error("Invalid variant");
        unitPrice = variant.price;
        variantName = variant.name;
      } else if (product.hasVariants) {
        throw new Error(`${product.name} requires a variant`);
      }
      return {
        orderId: input.orderId,
        productId: product.id,
        variantId: item.variantId ?? null,
        productName: product.name,
        variantName,
        unitPrice,
        quantity: Math.round(item.quantity),
        note: item.note?.trim() || null,
        lineTotal: unitPrice * Math.round(item.quantity)
      };
    });
    const subtotal = resolvedItems.reduce((sum, i) => sum + i.lineTotal, 0);
    const discount = Math.min(discountInput, subtotal);
    const discountPercent = subtotal > 0 ? Math.round(discount / subtotal * 100) : 0;
    const newOrderType = input.orderType ?? existing.orderType;
    const deliveryChargeInput = newOrderType === "delivery" ? Math.max(0, Math.round(input.deliveryCharge ?? 0)) : 0;
    const serviceChargeInput = Math.max(0, Math.round(input.serviceCharge ?? existing.serviceCharge));
    const total = subtotal - discount + deliveryChargeInput + serviceChargeInput;
    const now = nowStamp();
    const savedItems = resolvedItems.map(
      (item) => db2.insert(orderItems).values(item).returning().get()
    );
    const bump = sqlite2.prepare(
      `UPDATE products SET times_sold = times_sold + ?, last_sold_at = ? WHERE id = ?`
    );
    for (const item of resolvedItems) {
      bump.run(item.quantity, now, item.productId);
    }
    const order = db2.update(orders).set({
      orderType: newOrderType,
      customerName: input.customerName?.trim() ?? existing.customerName ?? null,
      tableId: newOrderType === "dine_in" ? input.tableId ?? existing.tableId ?? null : null,
      waiterId: newOrderType === "dine_in" ? input.waiterId ?? existing.waiterId ?? null : null,
      customerPhone: newOrderType === "delivery" ? input.customerPhone?.trim() ?? existing.customerPhone ?? null : null,
      customerAddress: newOrderType === "delivery" ? input.customerAddress?.trim() ?? existing.customerAddress ?? null : null,
      subtotal,
      discountPercent,
      discount,
      deliveryCharge: deliveryChargeInput,
      serviceCharge: serviceChargeInput,
      total,
      note: input.note?.trim() || existing.note
    }).where(drizzleOrm.eq(orders.id, input.orderId)).returning().get();
    return { ...order, items: savedItems };
  });
  return tx();
}
function withItems(id) {
  const db2 = getDb();
  const order = db2.select().from(orders).where(drizzleOrm.eq(orders.id, id)).get();
  if (!order) throw new Error("Order not found");
  const items = db2.select().from(orderItems).where(drizzleOrm.eq(orderItems.orderId, id)).all();
  return { ...order, items };
}
function updateOrderStatus(id, status) {
  const db2 = getDb();
  const sqlite2 = getSqlite();
  const now = nowStamp();
  const tx = sqlite2.transaction(() => {
    const existing = db2.select().from(orders).where(drizzleOrm.eq(orders.id, id)).get();
    if (!existing) throw new Error("Order not found");
    const changes = { status };
    if (status === "paid") {
      const owed = Math.max(0, existing.total - existing.amountPaid);
      if (owed > 0) {
        sqlite2.prepare(
          "INSERT INTO order_payments (order_id, amount, method, created_at) VALUES (?, ?, 'cash', ?)"
        ).run(id, owed, now);
      }
      changes.amountPaid = existing.total;
      changes.paidAt = now;
    }
    db2.update(orders).set(changes).where(drizzleOrm.eq(orders.id, id)).run();
    return withItems(id);
  });
  return tx();
}
function markKitchenPrinted(id) {
  const db2 = getDb();
  const existing = db2.select().from(orders).where(drizzleOrm.eq(orders.id, id)).get();
  if (!existing) throw new Error("Order not found");
  if (!existing.kitchenPrintedAt) {
    db2.update(orders).set({ kitchenPrintedAt: nowStamp() }).where(drizzleOrm.eq(orders.id, id)).run();
  }
  return withItems(id);
}
function addOrderPayment(input) {
  const amount = Math.round(input.amount);
  if (amount <= 0) throw new Error("Payment must be greater than zero");
  const db2 = getDb();
  const sqlite2 = getSqlite();
  const now = nowStamp();
  const tx = sqlite2.transaction(() => {
    const existing = db2.select().from(orders).where(drizzleOrm.eq(orders.id, input.orderId)).get();
    if (!existing) throw new Error("Order not found");
    if (existing.status === "cancelled") throw new Error("Order is cancelled");
    const owed = Math.max(0, existing.total - existing.amountPaid);
    if (owed === 0) throw new Error("Order is already fully paid");
    if (amount > owed) throw new Error("Only Rs " + owed + " is outstanding on this order");
    sqlite2.prepare(
      "INSERT INTO order_payments (order_id, amount, method, note, created_at) VALUES (?, ?, ?, ?, ?)"
    ).run(input.orderId, amount, input.method?.trim() || "cash", input.note?.trim() || null, now);
    const paidNow = existing.amountPaid + amount;
    const settled = paidNow >= existing.total;
    db2.update(orders).set({
      amountPaid: paidNow,
      status: settled ? "paid" : existing.status,
      paidAt: settled ? now : existing.paidAt
    }).where(drizzleOrm.eq(orders.id, input.orderId)).run();
    return withItems(input.orderId);
  });
  return tx();
}
function listOrderPayments(orderId) {
  return getSqlite().prepare(
    "SELECT id, order_id as orderId, amount, method, note, created_at as createdAt FROM order_payments WHERE order_id = ? ORDER BY id ASC"
  ).all(orderId);
}
function listUnpaidOrders(query) {
  const sqlite2 = getSqlite();
  const params = [];
  let where = "WHERE status = 'pending' AND amount_paid < total";
  if (query?.trim()) {
    where += " AND (customer_phone LIKE ? OR customer_name LIKE ?)";
    const q = "%" + query.trim() + "%";
    params.push(q, q);
  }
  const rows = sqlite2.prepare("SELECT id FROM orders " + where + " ORDER BY id DESC LIMIT 500").all(...params);
  return rows.map((r) => withItems(r.id));
}
const DEFAULTS = {
  restaurantName: "Islamic Pizza & Fast Food",
  address: "Muqabil Allah Wali Market, Jatoi Road, Shehar Sultan",
  phone: "0305-1415678 / 0306-1415678",
  receiptHeader: "",
  receiptFooter: "Thank you for your order!",
  currency: "Rs",
  defaultPrinter: "",
  kitchenPrinter: "",
  receiptWidth: "80",
  charsPerLine: 0,
  receiptLogo: "",
  paymentQr: ""
};
function getSettings() {
  const rows = getSqlite().prepare("SELECT key, value FROM settings").all();
  const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return { ...DEFAULTS, ...stored };
}
function saveSettings(input) {
  const stmt = getSqlite().prepare(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  );
  const tx = getSqlite().transaction(() => {
    for (const [key, value] of Object.entries(input)) {
      if (value !== void 0) stmt.run(key, String(value));
    }
  });
  tx();
  return getSettings();
}
function layout(settings2) {
  const override = settings2.charsPerLine;
  const width = override && override > 0 ? override : settings2.receiptWidth === "58" ? 32 : 48;
  const amtW = Math.max(6, Math.round(width * 0.21));
  const qtyW = Math.max(3, Math.round(width * 0.1));
  return { width, qtyW, amtW };
}
function resourcePath(file) {
  const devPath = path.join(process.cwd(), "resources", file);
  if (fs.existsSync(devPath)) return devPath;
  const unpacked = path.join(process.resourcesPath, "app.asar.unpacked", "resources", file);
  if (fs.existsSync(unpacked)) return unpacked;
  return path.join(process.resourcesPath, "resources", file);
}
function makePrinter(width) {
  const printer = new nodeThermalPrinter.ThermalPrinter({
    type: nodeThermalPrinter.PrinterTypes.EPSON,
    interface: "buffer",
    characterSet: nodeThermalPrinter.CharacterSet.PC437_USA,
    removeSpecialCharacters: false,
    width,
    lineCharacter: "-"
  });
  printer.add(Buffer.from([27, 64]));
  printer.add(Buffer.from([27, 33, 0]));
  printer.add(Buffer.from([27, 32, 0]));
  return printer;
}
async function sendRaw(printerName, buffer) {
  if (!printerName) throw new Error("No printer selected in Settings");
  const tmpFile = path.join(os.tmpdir(), `escpos-${Date.now()}.prn`);
  fs.writeFileSync(tmpFile, buffer);
  const psScript = `
$printer = "${printerName.replace(/"/g, '""')}"
$path = "${tmpFile.replace(/\\/g, "\\\\")}"
$bytes = [System.IO.File]::ReadAllBytes($path)
$src = @"
using System;
using System.IO;
using System.Runtime.InteropServices;
public class RawPrint {
  [StructLayout(LayoutKind.Sequential, CharSet=CharSet.Ansi)]
  public struct DOCINFOA { [MarshalAs(UnmanagedType.LPStr)] public string pDocName; [MarshalAs(UnmanagedType.LPStr)] public string pOutputFile; [MarshalAs(UnmanagedType.LPStr)] public string pDataType; }
  [DllImport("winspool.Drv", EntryPoint="OpenPrinterA", SetLastError=true, CharSet=CharSet.Ansi)] public static extern bool OpenPrinter(string src, out IntPtr hPrinter, IntPtr pd);
  [DllImport("winspool.Drv", EntryPoint="ClosePrinter", SetLastError=true)] public static extern bool ClosePrinter(IntPtr hPrinter);
  [DllImport("winspool.Drv", EntryPoint="StartDocPrinterA", SetLastError=true, CharSet=CharSet.Ansi)] public static extern bool StartDocPrinter(IntPtr hPrinter, int level, ref DOCINFOA di);
  [DllImport("winspool.Drv", EntryPoint="EndDocPrinter", SetLastError=true)] public static extern bool EndDocPrinter(IntPtr hPrinter);
  [DllImport("winspool.Drv", EntryPoint="StartPagePrinter", SetLastError=true)] public static extern bool StartPagePrinter(IntPtr hPrinter);
  [DllImport("winspool.Drv", EntryPoint="EndPagePrinter", SetLastError=true)] public static extern bool EndPagePrinter(IntPtr hPrinter);
  [DllImport("winspool.Drv", EntryPoint="WritePrinter", SetLastError=true)] public static extern bool WritePrinter(IntPtr hPrinter, byte[] pBytes, int dwCount, out int dwWritten);
  public static void Send(string name, byte[] bytes) {
    IntPtr h;
    if (!OpenPrinter(name, out h, IntPtr.Zero)) throw new Exception("OpenPrinter failed - check printer name");
    DOCINFOA di = new DOCINFOA(); di.pDocName = "Receipt"; di.pDataType = "RAW";
    StartDocPrinter(h, 1, ref di); StartPagePrinter(h);
    int written; WritePrinter(h, bytes, bytes.Length, out written);
    EndPagePrinter(h); EndDocPrinter(h); ClosePrinter(h);
  }
}
"@
Add-Type -TypeDefinition $src -Language CSharp
[RawPrint]::Send($printer, $bytes)
`;
  await new Promise((resolve, reject) => {
    child_process.execFile("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", psScript], (err) => {
      try {
        fs.unlinkSync(tmpFile);
      } catch {
      }
      if (err) reject(new Error(err.message));
      else resolve();
    });
  });
}
function money(n) {
  return `Rs ${n}`;
}
function padRow(left, right, L) {
  let l = left;
  let r = right;
  if (l.length + r.length + 1 > L.width) {
    const maxLeft = Math.max(1, L.width - r.length - 1);
    l = l.slice(0, maxLeft);
  }
  const space = Math.max(1, L.width - l.length - r.length);
  return l + " ".repeat(space) + r;
}
function itemLine(name, qty, amount, L) {
  const nameW = L.width - L.qtyW - L.amtW;
  const qtyStr = String(qty).padStart(Math.floor((L.qtyW + String(qty).length) / 2)).padEnd(L.qtyW);
  const amtStr = amount.padStart(L.amtW);
  const lines = [];
  let remaining = name;
  let first = true;
  while (remaining.length > 0) {
    const chunk = remaining.slice(0, nameW);
    remaining = remaining.slice(chunk.length);
    if (first) {
      lines.push(chunk.padEnd(nameW) + qtyStr + amtStr);
      first = false;
    } else {
      lines.push(chunk);
    }
  }
  return lines.join("\n");
}
function itemHeader(L) {
  const nameW = L.width - L.qtyW - L.amtW;
  return "Item".padEnd(nameW) + "Qty".padStart(Math.floor((L.qtyW + 3) / 2)).padEnd(L.qtyW) + "Amount".padStart(L.amtW);
}
async function printReceiptEscpos(order, settings2, names) {
  const L = layout(settings2);
  const printer = makePrinter(L.width);
  printer.alignCenter();
  if (settings2.receiptLogo) {
    try {
      await printer.printImage(settings2.receiptLogo);
    } catch {
    }
  }
  printer.bold(true);
  printer.setTextSize(1, 1);
  printer.println(settings2.restaurantName || "Restaurant");
  printer.setTextNormal();
  if (settings2.receiptHeader) {
    printer.bold(true);
    printer.println(settings2.receiptHeader);
    printer.bold(false);
  }
  if (settings2.address) printer.println(settings2.address);
  if (settings2.phone) printer.println(settings2.phone);
  printer.drawLine();
  printer.alignLeft();
  const typeLabel = order.orderType === "dine_in" ? "DINE IN" : order.orderType === "delivery" ? "DELIVERY" : "TAKE AWAY";
  printer.println(`${typeLabel}   #${order.orderNumber}`);
  printer.println(new Date(order.createdAt).toLocaleString());
  if (names.tableName) printer.println(`Table: ${names.tableName}`);
  if (names.waiterName) printer.println(`Waiter: ${names.waiterName}`);
  if (names.servedBy) printer.println(`Served by: ${names.servedBy}`);
  if (order.customerName) printer.println("Name: " + order.customerName);
  if (order.customerPhone) printer.println(`Phone: ${order.customerPhone}`);
  if (order.customerAddress) printer.println(`Address: ${order.customerAddress}`);
  printer.drawLine();
  printer.bold(true);
  printer.add(Buffer.from([27, 71, 1]));
  printer.println(itemHeader(L));
  printer.add(Buffer.from([27, 71, 0]));
  printer.bold(false);
  printer.drawLine();
  for (const item of order.items) {
    const name = item.variantName ? item.productName + " (" + item.variantName + ")" : item.productName;
    printer.println(itemLine(name, item.quantity, money(item.lineTotal), L));
  }
  printer.drawLine();
  if (order.discount > 0 || order.deliveryCharge > 0 || order.serviceCharge > 0) {
    printer.println(padRow("Subtotal:", money(order.subtotal), L));
  }
  if (order.discount > 0) {
    printer.println(padRow("Discount:", "-" + money(order.discount), L));
  }
  if (order.serviceCharge > 0) {
    printer.println(padRow("Service:", "+" + money(order.serviceCharge), L));
  }
  if (order.deliveryCharge > 0) {
    printer.println(padRow("Delivery:", "+" + money(order.deliveryCharge), L));
  }
  printer.bold(true);
  printer.setTextSize(1, 1);
  printer.println(padRow("TOTAL:", money(order.total), L));
  printer.setTextNormal();
  printer.bold(false);
  if (order.amountPaid > 0 && order.amountPaid < order.total) {
    printer.println(padRow("Paid:", money(order.amountPaid), L));
    printer.bold(true);
    printer.println(padRow("BALANCE:", money(order.total - order.amountPaid), L));
    printer.bold(false);
  }
  printer.alignCenter();
  printer.drawLine();
  if (settings2.receiptFooter) printer.println(settings2.receiptFooter);
  try {
    await printer.printImage(resourcePath("xiom-logo-print.png"));
  } catch {
    printer.println("Powered by XIOM");
  }
  printer.println("0301-4442459");
  printer.add(Buffer.from([10, 10, 10, 10]));
  printer.add(Buffer.from([29, 86, 0]));
  await sendRaw(settings2.defaultPrinter, printer.getBuffer());
}
async function printKitchenEscpos(order, settings2, names) {
  const printerName = settings2.kitchenPrinter || settings2.defaultPrinter;
  const L = layout(settings2);
  const printer = makePrinter(L.width);
  printer.alignCenter();
  printer.bold(true);
  printer.setTextSize(1, 1);
  printer.println("KITCHEN");
  const typeLabel = order.orderType === "dine_in" ? "DINE IN" : order.orderType === "delivery" ? "DELIVERY" : "TAKE AWAY";
  printer.bold(true);
  printer.setTextSize(1, 1);
  printer.println(`${typeLabel}  #${order.orderNumber}`);
  printer.setTextNormal();
  printer.bold(false);
  printer.println(new Date(order.createdAt).toLocaleString());
  if (names.tableName) printer.println(`Table: ${names.tableName}`);
  if (order.customerName) {
    printer.bold(true);
    printer.println("Name: " + order.customerName);
    printer.bold(false);
  }
  printer.drawLine();
  printer.alignLeft();
  for (const item of order.items) {
    const name = item.variantName ? item.productName + " (" + item.variantName + ")" : item.productName;
    printer.bold(true);
    printer.setTextSize(1, 1);
    printer.println(`${item.quantity} x ${name}`);
    printer.setTextNormal();
    printer.bold(false);
    if (item.note) printer.println(`    * ${item.note}`);
  }
  printer.cut();
  await sendRaw(printerName, printer.getBuffer());
}
async function printReportEscpos(report, settings2) {
  const L = layout(settings2);
  const printer = makePrinter(L.width);
  const s = report.summary;
  const range = report.from === report.to ? report.from : `${report.from} to ${report.to}`;
  printer.alignCenter();
  printer.bold(true);
  printer.println("SALES REPORT");
  printer.println(settings2.restaurantName || "Restaurant");
  printer.bold(false);
  printer.println(range);
  printer.drawLine();
  printer.alignLeft();
  printer.println(padRow("Paid Orders:", String(s.paidOrders), L));
  printer.bold(true);
  printer.println(padRow("Revenue:", money(s.paidRevenue), L));
  printer.bold(false);
  printer.println(padRow("Avg Order:", money(s.avgOrderValue), L));
  printer.println(padRow("Discounts:", money(s.totalDiscount), L));
  printer.println(padRow("Unpaid:", s.pendingOrders + " (" + money(s.pendingAmount) + ")", L));
  printer.println(padRow("Cancelled:", String(s.cancelledOrders), L));
  printer.drawLine();
  printer.bold(true);
  printer.println("TOP ITEMS");
  printer.println(itemHeader(L));
  printer.bold(false);
  printer.drawLine();
  for (const p of report.popular) {
    const name = p.variantName ? p.productName + " (" + p.variantName + ")" : p.productName;
    printer.println(itemLine(name, p.quantity, money(p.revenue), L));
  }
  printer.drawLine();
  printer.alignCenter();
  printer.println(`Printed: ${(/* @__PURE__ */ new Date()).toLocaleString()}`);
  printer.cut();
  await sendRaw(settings2.defaultPrinter, printer.getBuffer());
}
async function testPrintEscpos(printerName) {
  const settings2 = getSettings();
  const L = layout(settings2);
  const printer = makePrinter(L.width);
  printer.alignCenter();
  printer.bold(true);
  printer.println("PRINTER TEST");
  printer.bold(false);
  printer.println(`Paper: ${settings2.receiptWidth}mm  Width: ${L.width} chars`);
  printer.println((/* @__PURE__ */ new Date()).toLocaleString());
  printer.drawLine();
  printer.alignLeft();
  printer.println("Column width check:");
  let ruler = "";
  for (let i = 1; i <= L.width; i++) ruler += String(i % 10);
  printer.println(ruler);
  printer.drawLine();
  printer.println(itemHeader(L));
  printer.drawLine();
  printer.println(itemLine("Short item", 1, money(250), L));
  printer.println(itemLine("A much longer product name that wraps", 2, money(1500), L));
  printer.drawLine();
  printer.println(padRow("TOTAL:", money(1750), L));
  printer.drawLine();
  printer.alignCenter();
  printer.println("If columns line up, printer is OK");
  printer.println("Powered by XIOM");
  printer.cut();
  await sendRaw(printerName, printer.getBuffer());
}
async function rawTestPrint$1(text) {
  const settings2 = getSettings();
  const L = layout(settings2);
  const printer = makePrinter(L.width);
  for (const line of text.split("\n")) printer.println(line);
  printer.cut();
  await sendRaw(settings2.defaultPrinter, printer.getBuffer());
}
function resolveNames(order) {
  const db2 = getDb();
  const out = {};
  if (order.userId != null) {
    const u = db2.select().from(users).where(drizzleOrm.eq(users.id, order.userId)).get();
    if (u) out.servedBy = u.name;
  }
  if (order.tableId != null) {
    const t = db2.select().from(restaurantTables).where(drizzleOrm.eq(restaurantTables.id, order.tableId)).get();
    if (t) out.tableName = t.name;
  }
  if (order.waiterId != null) {
    const w = db2.select().from(waiters).where(drizzleOrm.eq(waiters.id, order.waiterId)).get();
    if (w) out.waiterName = w.name;
  }
  return out;
}
async function printReport(report) {
  const settings2 = getSettings();
  await printReportEscpos(report, settings2);
}
async function printTest() {
  const settings2 = getSettings();
  await testPrintEscpos(settings2.defaultPrinter);
}
async function printReceipt(order) {
  const settings2 = getSettings();
  await printReceiptEscpos(order, settings2, resolveNames(order));
}
async function printKitchenSlip(order) {
  const settings2 = getSettings();
  await printKitchenEscpos(order, settings2, resolveNames(order));
}
async function rawTestPrint(text) {
  await rawTestPrint$1(text);
}
function getSalesReport(filter) {
  const sqlite2 = getSqlite();
  const { from, to } = filter;
  if (!from || !to) throw new Error("Date range is required");
  if (from > to) throw new Error("From date must be before To date");
  const summaryRow = sqlite2.prepare(
    `SELECT
        COUNT(CASE WHEN status = 'paid' THEN 1 END) AS paidOrders,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN total END), 0) AS paidRevenue,
        COUNT(CASE WHEN status IN ('pending', 'kitchen_printed') THEN 1 END) AS pendingOrders,
        COALESCE(SUM(CASE WHEN status IN ('pending', 'kitchen_printed') THEN total END), 0) AS pendingAmount,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelledOrders,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN discount END), 0) AS totalDiscount
      FROM orders
      WHERE date(created_at) BETWEEN ? AND ?`
  ).get(from, to);
  const avgOrderValue = summaryRow.paidOrders > 0 ? Math.round(summaryRow.paidRevenue / summaryRow.paidOrders) : 0;
  const popular = sqlite2.prepare(
    `SELECT
        oi.product_name AS productName,
        oi.variant_name AS variantName,
        SUM(oi.quantity) AS quantity,
        SUM(oi.line_total) AS revenue
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE o.status = 'paid' AND date(o.created_at) BETWEEN ? AND ?
      GROUP BY oi.product_name, oi.variant_name
      ORDER BY quantity DESC, revenue DESC
      LIMIT 15`
  ).all(from, to);
  const daily = sqlite2.prepare(
    `SELECT
        date(created_at) AS date,
        COUNT(*) AS orders,
        COALESCE(SUM(total), 0) AS revenue
      FROM orders
      WHERE status = 'paid' AND date(created_at) BETWEEN ? AND ?
      GROUP BY date(created_at)
      ORDER BY date`
  ).all(from, to);
  return { from, to, summary: { ...summaryRow, avgOrderValue }, popular, daily };
}
async function backupDatabase() {
  const now = /* @__PURE__ */ new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  const result = await electron.dialog.showSaveDialog({
    title: "Save Backup",
    defaultPath: `pos-backup-${stamp}.db`,
    filters: [{ name: "Database", extensions: ["db"] }]
  });
  if (result.canceled || !result.filePath) throw new Error("Backup cancelled");
  await getSqlite().backup(result.filePath);
  return result.filePath;
}
async function restoreDatabase() {
  const result = await electron.dialog.showOpenDialog({
    title: "Select Backup File",
    filters: [{ name: "Database", extensions: ["db"] }],
    properties: ["openFile"]
  });
  if (result.canceled || result.filePaths.length === 0) throw new Error("Restore cancelled");
  const backupPath = result.filePaths[0];
  if (!fs.existsSync(backupPath)) throw new Error("Backup file not found");
  const dbPath = path.join(electron.app.getPath("userData"), "restaurant-pos.db");
  const safetyPath = path.join(electron.app.getPath("userData"), "pre-restore-safety.db");
  await getSqlite().backup(safetyPath);
  closeDatabase();
  fs.copyFileSync(backupPath, dbPath);
  initDatabase();
  return backupPath;
}
function checkIntegrity() {
  const rows = getSqlite().pragma("integrity_check");
  const result = rows.map((r) => r.integrity_check).join("; ");
  if (result !== "ok") throw new Error(`Integrity check failed: ${result}`);
  return "Database integrity: OK";
}
function hashPin(pin, salt) {
  return crypto.createHash("sha256").update(`${salt}:${pin}`).digest("hex");
}
function validatePin(pin) {
  if (!/^\d{4,6}$/.test(pin)) throw new Error("PIN must be 4-6 digits");
}
function toSafe(u) {
  return { id: u.id, name: u.name, role: u.role, isActive: u.isActive, createdAt: u.createdAt };
}
function hasAnyUser() {
  const row = getDb().select({ id: users.id }).from(users).limit(1).get();
  return row !== void 0;
}
function setupAdmin(name, pin) {
  if (hasAnyUser()) throw new Error("Setup already completed");
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Name is required");
  validatePin(pin);
  const salt = crypto.randomBytes(16).toString("hex");
  const row = getDb().insert(users).values({ name: trimmed, role: "admin", pinHash: hashPin(pin, salt), pinSalt: salt }).returning().get();
  return toSafe(row);
}
function login(pin) {
  validatePin(pin);
  const all = getDb().select().from(users).where(drizzleOrm.eq(users.isActive, true)).all();
  for (const u of all) {
    if (hashPin(pin, u.pinSalt) === u.pinHash) return toSafe(u);
  }
  throw new Error("Invalid PIN");
}
function listUsers() {
  return getDb().select().from(users).orderBy(drizzleOrm.asc(users.name)).all().map(toSafe);
}
function createUser(input) {
  const name = input.name.trim();
  if (!name) throw new Error("Name is required");
  validatePin(input.pin);
  const salt = crypto.randomBytes(16).toString("hex");
  const row = getDb().insert(users).values({ name, role: input.role, pinHash: hashPin(input.pin, salt), pinSalt: salt }).returning().get();
  return toSafe(row);
}
function updateUser(input) {
  const { id, pin, ...changes } = input;
  const db2 = getDb();
  const existing = db2.select().from(users).where(drizzleOrm.eq(users.id, id)).get();
  if (!existing) throw new Error("User not found");
  if (changes.name !== void 0 && !changes.name.trim()) throw new Error("Name cannot be empty");
  const demotingAdmin = existing.role === "admin" && (changes.role === "cashier" || changes.isActive === false);
  if (demotingAdmin) {
    const activeAdmins = db2.select().from(users).where(drizzleOrm.eq(users.role, "admin")).all().filter((u) => u.isActive && u.id !== id);
    if (activeAdmins.length === 0) throw new Error("At least one active admin is required");
  }
  const finalChanges = { ...changes };
  if (changes.name !== void 0) finalChanges.name = changes.name.trim();
  if (pin !== void 0) {
    validatePin(pin);
    const salt = crypto.randomBytes(16).toString("hex");
    finalChanges.pinSalt = salt;
    finalChanges.pinHash = hashPin(pin, salt);
  }
  const row = db2.update(users).set(finalChanges).where(drizzleOrm.eq(users.id, id)).returning().get();
  return toSafe(row);
}
const LICENSE_SECRET = "IsPz-2026-Kx9#mQv7$Lw2@Rt8!Zn4&Jh6";
let cachedMachineId = null;
function getMachineId() {
  if (cachedMachineId) return cachedMachineId;
  try {
    const out = child_process.execSync(
      'reg query "HKLM\\SOFTWARE\\Microsoft\\Cryptography" /v MachineGuid',
      { encoding: "utf8" }
    );
    const match = out.match(/MachineGuid\s+REG_SZ\s+([a-f0-9-]+)/i);
    if (!match) throw new Error("MachineGuid not found");
    cachedMachineId = match[1].toUpperCase();
    return cachedMachineId;
  } catch {
    throw new Error("Could not read machine ID");
  }
}
function signature(machineId, expiry) {
  const raw = crypto.createHmac("sha256", LICENSE_SECRET).update(`${machineId}:${expiry}`).digest("hex").toUpperCase().slice(0, 20);
  return `${raw.slice(0, 5)}-${raw.slice(5, 10)}-${raw.slice(10, 15)}-${raw.slice(15, 20)}`;
}
function todayStr() {
  const d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}
function verifyKey(key) {
  const cleaned = key.trim().toUpperCase();
  const match = cleaned.match(/^([A-F0-9]{5}-[A-F0-9]{5}-[A-F0-9]{5}-[A-F0-9]{5})-(\d{8})$/);
  if (!match) return { valid: false, error: "Invalid key format" };
  const [, sig, expiry] = match;
  const machineId = getMachineId();
  if (signature(machineId, expiry) !== sig) {
    return { valid: false, error: "Key is not valid for this computer" };
  }
  if (expiry < todayStr()) {
    return { valid: false, error: `License expired on ${expiry.slice(0, 4)}-${expiry.slice(4, 6)}-${expiry.slice(6, 8)}` };
  }
  return { valid: true, expiry };
}
function activate(key) {
  const res = verifyKey(key);
  if (!res.valid) throw new Error(res.error ?? "Invalid key");
  const stmt = getSqlite().prepare(
    "INSERT INTO settings (key, value) VALUES ('licenseKey', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  );
  stmt.run(key.trim().toUpperCase());
  return getLicenseStatus();
}
function getLicenseStatus() {
  const machineId = getMachineId();
  const row = getSqlite().prepare("SELECT value FROM settings WHERE key = 'licenseKey'").get();
  if (!row) return { activated: false, machineId, expiresOn: null, daysLeft: null };
  const res = verifyKey(row.value);
  if (!res.valid) {
    return { activated: false, machineId, expiresOn: null, daysLeft: null, error: res.error };
  }
  const e = res.expiry;
  const expiresOn = `${e.slice(0, 4)}-${e.slice(4, 6)}-${e.slice(6, 8)}`;
  const msLeft = (/* @__PURE__ */ new Date(`${expiresOn}T23:59:59`)).getTime() - Date.now();
  const daysLeft = Math.max(0, Math.ceil(msLeft / 864e5));
  return { activated: true, machineId, expiresOn, daysLeft };
}
const VALID_CATEGORIES = ["ingredients", "utilities", "salaries", "rent", "equipment", "other"];
function validate(input) {
  if (input.amount !== void 0 && (!Number.isFinite(input.amount) || input.amount <= 0)) {
    throw new Error("Amount must be a positive number");
  }
  if (input.category !== void 0 && !VALID_CATEGORIES.includes(input.category)) {
    throw new Error("Invalid category");
  }
  if (input.expenseDate !== void 0 && !/^\d{4}-\d{2}-\d{2}$/.test(input.expenseDate)) {
    throw new Error("Invalid date");
  }
}
function listExpenseItems() {
  return getDb().select().from(expenseItems).orderBy(drizzleOrm.asc(expenseItems.name)).all();
}
function createExpenseItem(name) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Item name is required");
  const existing = getSqlite().prepare("SELECT id FROM expense_items WHERE LOWER(name) = LOWER(?)").get(trimmed);
  if (existing) throw new Error("Item already exists");
  return getDb().insert(expenseItems).values({ name: trimmed }).returning().get();
}
function updateExpenseItem(input) {
  const { id, ...changes } = input;
  if (changes.name !== void 0) {
    changes.name = changes.name.trim();
    if (!changes.name) throw new Error("Item name cannot be empty");
  }
  const row = getDb().update(expenseItems).set(changes).where(drizzleOrm.eq(expenseItems.id, id)).returning().get();
  if (!row) throw new Error("Item not found");
  return row;
}
function listExpenses(filter) {
  const rows = getDb().select({
    id: expenses.id,
    expenseDate: expenses.expenseDate,
    category: expenses.category,
    expenseItemId: expenses.expenseItemId,
    itemName: expenseItems.name,
    quantity: expenses.quantity,
    description: expenses.description,
    amount: expenses.amount,
    userId: expenses.userId,
    createdAt: expenses.createdAt
  }).from(expenses).leftJoin(expenseItems, drizzleOrm.eq(expenses.expenseItemId, expenseItems.id)).where(drizzleOrm.and(drizzleOrm.gte(expenses.expenseDate, filter.from), drizzleOrm.lte(expenses.expenseDate, filter.to))).orderBy(drizzleOrm.desc(expenses.expenseDate), drizzleOrm.desc(expenses.id)).all();
  return rows;
}
function createExpense(input) {
  validate(input);
  const row = getDb().insert(expenses).values({
    expenseDate: input.expenseDate,
    category: input.category,
    expenseItemId: input.expenseItemId ?? null,
    quantity: input.quantity?.trim() || null,
    description: input.description?.trim() || null,
    amount: Math.round(input.amount),
    userId: input.userId ?? null
  }).returning().get();
  return { ...row, itemName: null };
}
function updateExpense(input) {
  const { id, ...changes } = input;
  validate(changes);
  const finalChanges = { ...changes };
  if (changes.description !== void 0) finalChanges.description = changes.description.trim() || null;
  if (changes.quantity !== void 0) finalChanges.quantity = changes.quantity.trim() || null;
  if (changes.amount !== void 0) finalChanges.amount = Math.round(changes.amount);
  const row = getDb().update(expenses).set(finalChanges).where(drizzleOrm.eq(expenses.id, id)).returning().get();
  if (!row) throw new Error("Expense not found");
  return { ...row, itemName: null };
}
function deleteExpense(id) {
  const result = getDb().delete(expenses).where(drizzleOrm.eq(expenses.id, id)).run();
  if (result.changes === 0) throw new Error("Expense not found");
}
function expenseSummary(filter) {
  const sqlite2 = getSqlite();
  const byCategory = sqlite2.prepare(
    `SELECT category, COALESCE(SUM(amount), 0) AS total
       FROM expenses WHERE expense_date BETWEEN ? AND ?
       GROUP BY category ORDER BY total DESC`
  ).all(filter.from, filter.to);
  const byItem = sqlite2.prepare(
    `SELECT ei.name AS itemName, COUNT(*) AS purchases,
              COALESCE(SUM(e.amount), 0) AS total, MAX(e.expense_date) AS lastDate
       FROM expenses e JOIN expense_items ei ON ei.id = e.expense_item_id
       WHERE e.expense_date BETWEEN ? AND ?
       GROUP BY ei.name ORDER BY total DESC`
  ).all(filter.from, filter.to);
  return {
    total: byCategory.reduce((s, r) => s + r.total, 0),
    byCategory,
    byItem
  };
}
function handle(channel, fn) {
  electron.ipcMain.handle(channel, (_event, ...args) => {
    try {
      return { ok: true, data: fn(...args) };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`[ipc] ${channel} failed:`, message);
      return { ok: false, error: message };
    }
  });
}
function registerIpcHandlers() {
  handle("categories:list", listCategories);
  handle("categories:create", createCategory);
  handle("categories:update", updateCategory);
  handle("categories:delete", deleteCategory);
  handle("products:list", listProducts);
  handle("products:create", createProduct);
  handle("products:update", updateProduct);
  handle("products:delete", deleteProduct);
  handle("tables:list", tablesService.list);
  handle("tables:create", tablesService.create);
  handle("tables:update", tablesService.update);
  handle("tables:delete", tablesService.remove);
  handle("license:status", getLicenseStatus);
  handle("license:activate", activate);
  handle("auth:hasAnyUser", hasAnyUser);
  handle("auth:setupAdmin", setupAdmin);
  handle("auth:login", login);
  handle("users:list", listUsers);
  handle("users:create", createUser);
  handle("users:update", updateUser);
  electron.ipcMain.handle("settings:pickImage", async (_e, kind) => {
    try {
      const result = await electron.dialog.showOpenDialog({
        title: kind === "logo" ? "Select Receipt Logo" : "Select Payment QR Image",
        filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp"] }],
        properties: ["openFile"]
      });
      if (result.canceled || result.filePaths.length === 0) {
        return { ok: false, error: "Cancelled" };
      }
      const destName = kind === "logo" ? "receipt-logo.png" : "payment-qr.png";
      const destPath = path.join(electron.app.getPath("userData"), destName);
      const sharp = require("sharp");
      await sharp(result.filePaths[0]).flatten({ background: "#ffffff" }).resize(360, 360, { fit: "inside", withoutEnlargement: false }).greyscale().threshold(180).png().toFile(destPath);
      const key = kind === "logo" ? "receiptLogo" : "paymentQr";
      saveSettings({ [key]: destPath });
      return { ok: true, data: destPath };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Image failed" };
    }
  });
  electron.ipcMain.handle("settings:clearImage", (_e, kind) => {
    const key = kind === "logo" ? "receiptLogo" : "paymentQr";
    saveSettings({ [key]: "" });
    return { ok: true };
  });
  handle("settings:get", getSettings);
  handle("settings:save", saveSettings);
  electron.ipcMain.handle("printers:list", async () => {
    try {
      const win = electron.BrowserWindow.getAllWindows()[0];
      if (!win) return { ok: false, error: "No window available" };
      const printers = await win.webContents.getPrintersAsync();
      return { ok: true, data: printers.map((p) => ({ name: p.name, isDefault: false })) };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Failed to list printers" };
    }
  });
  handle("reports:sales", getSalesReport);
  handle("expenses:listItems", listExpenseItems);
  handle("expenses:createItem", createExpenseItem);
  handle("expenses:updateItem", updateExpenseItem);
  handle("expenses:list", listExpenses);
  handle("expenses:create", createExpense);
  handle("expenses:update", updateExpense);
  handle("expenses:delete", deleteExpense);
  handle("expenses:summary", expenseSummary);
  handle("customers:search", searchCustomers);
  electron.ipcMain.handle("backup:create", async () => {
    try {
      const path2 = await backupDatabase();
      return { ok: true, data: path2 };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Backup failed" };
    }
  });
  electron.ipcMain.handle("backup:restore", async () => {
    try {
      const path2 = await restoreDatabase();
      return { ok: true, data: path2 };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Restore failed" };
    }
  });
  handle("backup:check", checkIntegrity);
  electron.ipcMain.handle("print:report", async (_e, report) => {
    try {
      await printReport(report);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Print failed" };
    }
  });
  electron.ipcMain.handle("print:raw", async (_e, text) => {
    try {
      await rawTestPrint(text);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Print failed" };
    }
  });
  electron.ipcMain.handle("print:test", async () => {
    try {
      await printTest();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Print failed" };
    }
  });
  electron.ipcMain.handle("print:receipt", async (_e, order) => {
    try {
      await printReceipt(order);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Print failed" };
    }
  });
  electron.ipcMain.handle("print:kitchen", async (_e, order) => {
    try {
      await printKitchenSlip(order);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Print failed" };
    }
  });
  handle("orders:create", createOrder);
  handle("orders:list", listOrders);
  handle("orders:updateItems", updateOrderItems);
  handle("orders:updateStatus", updateOrderStatus);
  handle("orders:markKitchenPrinted", markKitchenPrinted);
  handle("orders:addPayment", addOrderPayment);
  handle("orders:payments", listOrderPayments);
  handle("orders:unpaid", listUnpaidOrders);
  handle("waiters:list", waitersService.list);
  handle("waiters:create", waitersService.create);
  handle("waiters:update", waitersService.update);
  handle("waiters:delete", waitersService.remove);
}
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    title: "Restaurant POS",
    width: 1280,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.on("before-input-event", (_e, input) => {
    if (input.type === "keyDown" && input.key === "F12") {
      mainWindow.webContents.toggleDevTools();
    }
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.restaurantpos.app");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  initDatabase();
  registerIpcHandlers();
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    closeDatabase();
    electron.app.quit();
  }
});

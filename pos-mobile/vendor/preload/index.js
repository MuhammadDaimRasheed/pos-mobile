"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
function namedEntityApi(prefix) {
  return {
    list: () => electron.ipcRenderer.invoke(`${prefix}:list`),
    create: (input) => electron.ipcRenderer.invoke(`${prefix}:create`, input),
    update: (input) => electron.ipcRenderer.invoke(`${prefix}:update`, input),
    delete: (id) => electron.ipcRenderer.invoke(`${prefix}:delete`, id)
  };
}
const api = {
  categories: {
    list: () => electron.ipcRenderer.invoke("categories:list"),
    create: (input) => electron.ipcRenderer.invoke("categories:create", input),
    update: (input) => electron.ipcRenderer.invoke("categories:update", input),
    delete: (id) => electron.ipcRenderer.invoke("categories:delete", id)
  },
  products: {
    list: () => electron.ipcRenderer.invoke("products:list"),
    create: (input) => electron.ipcRenderer.invoke("products:create", input),
    update: (input) => electron.ipcRenderer.invoke("products:update", input),
    delete: (id) => electron.ipcRenderer.invoke("products:delete", id)
  },
  expenses: {
    listItems: () => electron.ipcRenderer.invoke("expenses:listItems"),
    createItem: (name) => electron.ipcRenderer.invoke("expenses:createItem", name),
    updateItem: (input) => electron.ipcRenderer.invoke("expenses:updateItem", input),
    list: (filter) => electron.ipcRenderer.invoke("expenses:list", filter),
    create: (input) => electron.ipcRenderer.invoke("expenses:create", input),
    update: (input) => electron.ipcRenderer.invoke("expenses:update", input),
    delete: (id) => electron.ipcRenderer.invoke("expenses:delete", id),
    summary: (filter) => electron.ipcRenderer.invoke("expenses:summary", filter)
  },
  customers: {
    search: (query) => electron.ipcRenderer.invoke("customers:search", query)
  },
  license: {
    status: () => electron.ipcRenderer.invoke("license:status"),
    activate: (key) => electron.ipcRenderer.invoke("license:activate", key)
  },
  auth: {
    hasAnyUser: () => electron.ipcRenderer.invoke("auth:hasAnyUser"),
    setupAdmin: (name, pin) => electron.ipcRenderer.invoke("auth:setupAdmin", name, pin),
    login: (pin) => electron.ipcRenderer.invoke("auth:login", pin)
  },
  users: {
    list: () => electron.ipcRenderer.invoke("users:list"),
    create: (input) => electron.ipcRenderer.invoke("users:create", input),
    update: (input) => electron.ipcRenderer.invoke("users:update", input)
  },
  settings: {
    pickImage: (kind) => electron.ipcRenderer.invoke("settings:pickImage", kind),
    clearImage: (kind) => electron.ipcRenderer.invoke("settings:clearImage", kind),
    get: () => electron.ipcRenderer.invoke("settings:get"),
    save: (input) => electron.ipcRenderer.invoke("settings:save", input)
  },
  printers: {
    list: () => electron.ipcRenderer.invoke("printers:list")
  },
  backup: {
    create: () => electron.ipcRenderer.invoke("backup:create"),
    restore: () => electron.ipcRenderer.invoke("backup:restore"),
    check: () => electron.ipcRenderer.invoke("backup:check")
  },
  reports: {
    sales: (filter) => electron.ipcRenderer.invoke("reports:sales", filter)
  },
  print: {
    raw: (text) => electron.ipcRenderer.invoke("print:raw", text),
    test: () => electron.ipcRenderer.invoke("print:test"),
    report: (report) => electron.ipcRenderer.invoke("print:report", report),
    receipt: (order) => electron.ipcRenderer.invoke("print:receipt", order),
    kitchen: (order) => electron.ipcRenderer.invoke("print:kitchen", order)
  },
  orders: {
    list: (filter) => electron.ipcRenderer.invoke("orders:list", filter),
    create: (input) => electron.ipcRenderer.invoke("orders:create", input),
    updateStatus: (id, status) => electron.ipcRenderer.invoke("orders:updateStatus", id, status),
    markKitchenPrinted: (id) => electron.ipcRenderer.invoke("orders:markKitchenPrinted", id),
    addPayment: (input) => electron.ipcRenderer.invoke("orders:addPayment", input),
    payments: (orderId) => electron.ipcRenderer.invoke("orders:payments", orderId),
    unpaid: (query) => electron.ipcRenderer.invoke("orders:unpaid", query),
    updateItems: (input) => electron.ipcRenderer.invoke("orders:updateItems", input)
  },
  tables: namedEntityApi("tables"),
  waiters: namedEntityApi("waiters")
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}

const STORAGE_KEY = 'manage-keuangan-mobile-data-v1'

const createInitialData = () => ({
  wallets: [],
  categories: [
    { id: 1, name: 'Gaji', type: 'INCOME' },
    { id: 2, name: 'Makanan', type: 'EXPENSE' },
    { id: 3, name: 'Transportasi', type: 'EXPENSE' }
  ],
  transactions: [],
  budgets: []
})

const readData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : createInitialData()
  } catch (error) {
    console.error('Data lokal tidak dapat dibaca', error)
    return createInitialData()
  }
}

const writeData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const nextId = (items) => items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
const normaliseId = (value) => (value === '' || value === null || value === undefined ? value : Number(value))

const withWalletBalances = (data) => data.wallets.map(wallet => ({
  ...wallet,
  balance: data.transactions
    .filter(transaction => Number(transaction.wallet_id) === Number(wallet.id))
    .reduce((balance, transaction) => balance + (transaction.type === 'INCOME' ? Number(transaction.amount) : -Number(transaction.amount)), 0)
}))

const get = (path) => {
  const data = readData()
  if (path === '/wallets/') return { data: withWalletBalances(data) }
  if (path === '/categories/') return { data: data.categories }
  if (path === '/transactions/') return { data: data.transactions }
  if (path === '/budgets/history') return { data: data.budgets }
  throw new Error(`Endpoint lokal tidak dikenal: ${path}`)
}

const post = (path, payload) => {
  const data = readData()
  if (path === '/wallets/') data.wallets.push({ ...payload, id: nextId(data.wallets) })
  else if (path === '/categories/') data.categories.push({ ...payload, id: nextId(data.categories) })
  else if (path === '/transactions/') data.transactions.push({
    ...payload,
    id: nextId(data.transactions),
    amount: Number(payload.amount),
    wallet_id: normaliseId(payload.wallet_id),
    category_id: normaliseId(payload.category_id),
    date: payload.date || new Date().toISOString()
  })
  else if (path === '/budgets/allocate') {
    const total = Number(payload.income)
    data.budgets.unshift({
      id: nextId(data.budgets),
      month: Number(payload.month),
      year: Number(payload.year),
      total,
      needs: total * 0.5,
      wants: total * 0.3,
      investments: total * 0.2
    })
  } else throw new Error(`Endpoint lokal tidak dikenal: ${path}`)
  writeData(data)
  return { data: payload }
}

const update = (path, payload) => {
  const data = readData()
  const match = path.match(/^\/(wallets|categories)\/(\d+)$/)
  if (!match) throw new Error(`Endpoint lokal tidak dikenal: ${path}`)
  const collection = match[1]
  const item = data[collection].find(value => Number(value.id) === Number(match[2]))
  if (!item) throw new Error('Data tidak ditemukan')
  Object.assign(item, payload)
  writeData(data)
  return { data: item }
}

const remove = (path) => {
  const data = readData()
  const match = path.match(/^\/(wallets|categories)\/(\d+)$/)
  if (!match) throw new Error(`Endpoint lokal tidak dikenal: ${path}`)
  const collection = match[1]
  data[collection] = data[collection].filter(value => Number(value.id) !== Number(match[2]))
  writeData(data)
  return { data: null }
}

export default { get, post, put: update, delete: remove }
export { STORAGE_KEY, createInitialData, readData, writeData }

// let secList = ["CDR", "CUR:DOGE", "CUR:BTC", "CUR:USDT", "MPW", "GWRS", "CUR:ADA", "CUR:ETH", "NVDA", "WE", "O", "PYPL", "AAPL", "NFLX"]
// let secList = ["SPYD", "CPSEETF", "VWRL", "IWDA", "VWCE", "CDR", "CUR:DOGE", "CUR:BTC", "CUR:USDT", "MPW", "GWRS", "CUR:ADA", "CUR:ETH", "NVDA", "WE", "O", "PYPL", "AAPL", "NFLX"]
// let secList = ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'NVDA', 'BRK-B', 'META', 'TSLA', 'LLY', 'V', 'UNH', 'JNJ', 'JPM', 'XOM', 'WMT', 'MA', 'PG', 'AVGO', 'HD', 'ORCL', 'CVX', 'MRK', 'ABBV', 'KO', 'PEP', 'COST', 'BAC', 'ADBE', 'CSCO', 'MCD', 'TMO', 'CRM', 'PFE', 'CMCSA', 'NFLX', 'DHR', 'ABT', 'AMD', 'TMUS', 'NKE', 'DIS', 'WFC', 'TXN', 'UPS', 'INTC', 'PM', 'CAT', 'MS', 'AMGN', 'VZ', 'INTU', 'BA', 'COP', 'UNP', 'NEE', 'LOW', 'BMY', 'IBM', 'DE', 'RTX', 'HON', 'GE', 'QCOM', 'SPGI', 'AXP', 'BKNG', 'AMAT', 'NOW', 'SBUX', 'PLD', 'LMT', 'ELV', 'SCHW', 'GS', 'SYK', 'ISRG', 'ADP', 'T', 'BLK', 'GILD', 'MDLZ', 'TJX', 'MMC', 'CVS', 'ADI', 'VRTX', 'UBER', 'REGN', 'LRCX', 'ZTS', 'AMT', 'CI', 'C', 'SLB', 'ABNB', 'BDX', 'MO', 'FI', 'EOG', 'BSX']
// let secList = ["IE00B3RBWM25", "IE00B4L5Y983", "IE00BK5BQT80", "IE00B8GKDB10", "IE00B3XXRP09", "IE00BKM4GZ66", "IE00B1XNHC34", "IE00B4X9L533", "IE00BJ0KDQ92", "IE00B5BMR087"]
// let secList = ["US67066G1040", "US70450Y1038", "US6541061031", "US5949181045", "US0378331005", "US0079031078", "US69608A1088", "US88160R1014", "US2546871060", "US7561091049"]
// let secList = ["ACWX", "ADFI", "BGLD", "BGRN", "COMT", "CONL", "DECT", "DECW", "BSCQ", "BBIB", "BBUS", "BCD", "BCDF", "BJK", "CGW", "CNXT", "DAPR"]
let secList = ['SPY', 'IVV', 'VOO', 'VTI', 'QQQ', 'VEA', 'VTV', 'IEFA', 'VUG', 'BND', 'AGG', 'VWO', 'IJH', 'IEMG', 'IWF', 'IJR', 'VIG', 'GLD', 'VXUS', 'IWM']
let curList = ["USD"]

//creating holdings (using items from secList and amount of items in secList 1 to 1)
function createHold(security) {
    let tempObj =  {
        "institution_price": 10,
        "institution_price_as_of": "2023-08-01",
        "cost_basis": 10,
        "quantity": 10,
        "currency": "USD",
        "security": {
          "ticker_symbol": "CUR:BTC",
          "currency": "USD"
        }
    }
    tempObj.institution_price = 10000 * Math.random();
    tempObj.cost_basis = 1000 * Math.random()
    tempObj.quantity = 100 * Math.random()
    tempObj.currency = curList[Math.floor(Math.random() * curList.length)]
    tempObj.security.ticker_symbol = security
    tempObj.security.currency = tempObj.currency
    return tempObj    
}


//functions to create a transaction via mask (createSingleTr(security)) and create an amount of transactions (createTrList(amount))
function createSingleTr(security) {
  let tempTransaction = {
    "date": "2023-07-27",
    "name": "buy stock",
    "quantity": 10,
    "price": 2898.32,
    "fees": 20,
    "type": "buy",
    "currency": "USD",
    "security": {
      "ticker_symbol": "GOOGL",
      "currency": "USD"
    }
 }
  tempTransaction.date = new Date(new Date(2023, 7, 1).getTime() + Math.random() * (Date.now() - new Date(2023, 7, 1).getTime())).toJSON().slice(0,10);
 // IMPORTANT!!!! NB!!! Months start from "0" while rest starts from "1"
  tempTransaction.type = ["buy", "sell"][Math.round(Math.random())];
  tempTransaction.quantity = tempTransaction["type"] == "sell" ? 0 - (Math.random() * 100) : Math.random() * 100;
  tempTransaction.name = `${tempTransaction["type"]} stock`;
  tempTransaction.price = Math.random() * 5000;
  tempTransaction.fees = Math.random() * 20 + 1;
  tempTransaction.security.ticker_symbol = security;   
  return tempTransaction
}
function createTrList(amount) {
  let resArray = []
  for (let i = 0; i < amount; i++) {
        resArray.push(createSingleTr(secList[Math.floor(Math.random() * secList.length)]))
  }
  return resArray
}


//custom user import mask (embedded functions from above)
let baseAcc = {
  "override_accounts": [
    {
      "type": "investment",
      "subtype": "brokerage",
      "holdings": secList.map(item => createHold(item)),
      "investment_transactions": createTrList(150),
    }
  ]
}


// OUTPUT SECTIONS BELOW : multiple console logs to be referred to / copied and pasted into PLAID custom user

console.log(`
For this instance: 
==============================
==========HOLDINGS============
==============================
`)
baseAcc.override_accounts[0].holdings.forEach(holding => console.log(`${holding.security.ticker_symbol} holding ${holding.quantity}`))

console.log(`
==============================
==========TRANSACTIONS========
==============================
`)
console.log(`Total Transactions: ${baseAcc.override_accounts[0].investment_transactions.length}
Total FEES: ${baseAcc.override_accounts[0].investment_transactions.reduce((totFee, fee) => totFee + fee.fees, 0)}
==============================
`)

secList.forEach(
  item => {
    let sumTransactions = baseAcc.override_accounts[0].investment_transactions.filter(i => i.security.ticker_symbol == item).reduce((total, current) => total + current.quantity, 0)
    console.log(`${item} TOTAL in TRANSACTIONS : ${sumTransactions} |||| EXPECTED COMPENSATORY TRANSACTION : ${(baseAcc.override_accounts[0].holdings.find(it => JSON.stringify(Object.values(it)).includes(item)).quantity) - sumTransactions}`)
  }
)

console.log(`
===============================
`)

















console.log(JSON.stringify(baseAcc))
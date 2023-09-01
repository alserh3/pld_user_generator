Array.prototype.random = function () {
  return this[Math.floor((Math.random() * this.length))];
}
//creating holdings (using items from securityArray and amount of items in it 1 to 1)
function createHolding(security) {
  let currency = currencyArray.random();
  let tempObject = {
    "institution_price": 10000 * Math.random(),
    "institution_price_as_of": new Date(Date.now()).toJSON().slice(0,10),
    "cost_basis": 1000 * Math.random(),
    "quantity": 100 * Math.random(),
    "currency": currency,
    "security": {
      "ticker_symbol": security,
      "isin": security,
      "currency": currency
    }
  } 
  security.length != 12 ? delete tempObject.security.isin : delete tempObject.security.ticker_symbol;
  return tempObject
}

//functions to create a transaction and create an amount of transactions
function createSingleTransaction(security) {
  let currency = currencyArray.random();
  let typeTransaction = ["buy", "sell"].random();
  let tempObject = {
      "date": new Date(new Date(2023, 7, 1).getTime() + Math.random() * (Date.now() - new Date(2023, 7, 1).getTime())).toJSON().slice(0,10), 
      "name": `${typeTransaction} stock`,
      "quantity": typeTransaction == "sell" ? 0 - (Math.random() * 100) : Math.random() * 100,
      "price": Math.random() * 5000,
      "fees": Math.random() * 20 + 1,
      "type": typeTransaction,
      "currency": currency,
      "security": {
        "ticker_symbol": security,
        "isin": security, 
        "currency": currency
      }
    }
  security.length != 12 ? delete tempObject.security.isin : delete tempObject.security.ticker_symbol;
  return tempObject
}

function createTransactionsList(amount, securityArray) {
  let transactionsArray = [];
  for (let i = 0; i < amount; i++) {
    transactionsArray.push(createSingleTransaction(securityArray.random()));
  }
  return transactionsArray
}


//custom user import constructor. Holdings for every Security, random Transactions (input amount)

function generateAccount(securityArray, transactionsAmount) {
  return {
    "override_accounts": [
      {
        "type": "investment",
        "subtype": "brokerage",
        "holdings": securityArray.map(item => createHolding(item)),
        "investment_transactions": createTransactionsList(transactionsAmount, securityArray),
      }
    ]
  }
}

//functions to generate output
function showHoldings(userAccount){
console.log(`
==============================
==========HOLDINGS============
==============================
`)

  let holdings = userAccount.override_accounts[0].holdings;
  console.log(`Total Holdings: ${holdings.length}`)
  holdings.forEach(
    holding => {
      let field = holding.security.ticker_symbol ? "ticker_symbol" : "isin";
      console.log(`${holding.security[field]} holding ${holding.quantity}`)
    }
  )
console.log(`
===============================
`)
}

function showBuyIns(userAccount) {
  let holdingArray = [];
  userAccount.override_accounts[0].holdings.map(
    holding => {
      let field = holding.security.ticker_symbol ? "ticker_symbol" : "isin";
      holdingArray.push(holding.security[field]);
    }
  );
  let transactionsArray = [];
  userAccount.override_accounts[0].investment_transactions.map(
    transaction => {
      let field = transaction.security.ticker_symbol ? "ticker_symbol" : "isin";
      transactionsArray.push(transaction.security[field]);
    }
  );
  let uniqueHoldings = holdingArray.filter(holding => !transactionsArray.includes(holding))
  uniqueHoldings.forEach(
    holding => {
      let holdingObject = userAccount.override_accounts[0].holdings.find(
        hld => {
          let field = hld.security.ticker_symbol ? "ticker_symbol" : "isin";
          return hld.security[field] == holding
        }
      );
      console.log(
        `For ${holding} the number of shares is ${holdingObject.quantity} | cost basis is ${holdingObject.cost_basis} | expected BUY IN for FE: ${holdingObject.cost_basis / holdingObject.quantity}`
      );
    }
  )
}

function showTransactions(userAccount){
  let transactions = userAccount.override_accounts[0].investment_transactions;
  let holdings = userAccount.override_accounts[0].holdings;
  console.log(`
  ==============================
  ==========TRANSACTIONS========
  ==============================
  `);
  console.log(`
  Total Transactions: ${transactions.length}
  Total FEES: ${transactions.reduce((totalFee, fee) => totalFee + fee.fees, 0)}
  ==============================
  `)
  holdings.forEach(
    holdingObject => {
      let field = holdingObject.security.ticker_symbol ? "ticker_symbol" : "isin";
      let security = holdingObject.security[field];
      let sumTransactions = transactions
        .filter(transaction => transaction.security[field] == security)
        .reduce((totalSum, currentTransaction) => totalSum + currentTransaction.quantity, 0);
      let compensatoryTransaction = holdings.find(holding => holding.security[field] == security).quantity - sumTransactions
      console.log(
        `${security} TOTAL in TRANSACTIONS : ${sumTransactions} |||| EXPECTED COMPENSATORY TRANSACTION : ${compensatoryTransaction}`
      )
    }
  )
}

function showAccount(userAccount){
  console.log(JSON.stringify(userAccount))
}

//trigger output section 


// let testSecurityArray = ["IE00B3RBWM25", "IE00B4L5Y983", "IE00BK5BQT80", "IE00B8GKDB10", "IE00B3XXRP09", "IE00BKM4GZ66", "IE00B1XNHC34", "IE00B4X9L533", "IE00BJ0KDQ92", "IE00B5BMR087", 'SPY', 'IVV', 'VOO', 'VTI', 'QQQ', 'VEA', 'VTV', 'IEFA', 'VUG', 'BND', 'AGG', 'VWO', 'IJH', 'IEMG', 'IWF', 'IJR', 'VIG', 'GLD', 'VXUS', 'IWM']
let testSecurityArray = ["US7561091049", "US67066G1040", "US70450Y1038", "US69608A1088", "US0231351067", "DE000A1ML7J1", "US88579Y1010", "FR0000121014", "US22788C1053", "US0378331005"]
let currencyArray = ["USD"]
let sanyaUser = generateAccount(testSecurityArray, 8);
showHoldings(sanyaUser);
showBuyIns(sanyaUser);
showTransactions(sanyaUser);
showAccount(sanyaUser);

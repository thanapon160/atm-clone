import React, { useState, useContext, useEffect } from 'react'
import axios from './config/axios'
import { AuthContext } from './context/AuthContextProvider';
import localStorageService from "./services/localStorageService"

function App() {
  const [cardId, setCardId] = useState({ cardId: null, pin: null })
  const [account, setAccount] = useState()
  const [transaction, setTransaction] = useState({ amount: "" })
  const [history, setHistory] = useState([])

  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post("/users/login", cardId)
      localStorageService.setToken(res.data?.token);
      const account = await axios.get('/users/me')
      // const userHistory = await axios.get('/')
      setAccount(account?.data?.user)
      setIsAuthenticated(true)
    } catch (err) {
      console.dir(err);
    }
  }
  const handleLogout = async (e) => {
    try {
      e.preventDefault()
      localStorageService.clearToken() // service.clearToken();
      setAccount()
      setIsAuthenticated(false)
    } catch (err) {
      console.dir(err)
    }
  }
  const cashAlgo = (n) => {
    const count1000 = Math.floor(n / 1000)
    const from1000 = n - (count1000 * 1000)
    const count500 = Math.floor(from1000 / 500)
    const from500 = from1000 - (count500 * 500)
    const count100 = Math.floor(from500 / 100)
    console.log({
      "แบงค์พัน": count1000,
      "แบงค์ห้าร้อย": count500,
      "แบงค์ร้อย": count100,
    })
  }

  const handleTransaction = (e) => {
    setTransaction({ amount: +e.target.value })
  }
  const handleDeposit = async () => {
    const newBalance = +account.balance + transaction.amount
    await axios.post("/transaction/deposit", { ...transaction, balance: newBalance })
    setAccount({ ...account, balance: +newBalance })
    setHistory([...history, { type: 'DEPOSIT', amount: transaction.amount }])
  }
  const handleWithdrawal = async () => {
    if (account?.balance < transaction.amount) return console.log("please try again, you don't have enough balance.")
    cashAlgo(transaction.amount)
    const newBalance = +account.balance - transaction.amount
    await axios.post("/transaction/withdrawal", { ...transaction, balance: newBalance })
    setAccount({ ...account, balance: +newBalance })
    setHistory([...history, { type: 'WITHDRAWAL', amount: transaction.amount }])
  }

  return (
    <div>
      {!isAuthenticated && <form onSubmit={handleSubmit}>
        <label htmlFor="account">Account Number :</label>&nbsp;&nbsp;
        <input name="account" id="account" onChange={(e) => { setCardId({ ...cardId, cardId: e.target.value }) }} />
        <br /><br />
        <label htmlFor="pin">PIN :</label>&nbsp;&nbsp;
        <input name="pin" id="pin" type="password" onChange={(e) => { setCardId({ ...cardId, pin: e.target.value }) }} />
        &nbsp;&nbsp;&nbsp;
      <button type="submit">Submit</button>
      </form>}
      <br />
      { isAuthenticated &&
        <>
          <button onClick={handleLogout}>Sign Out</button>
          <br /><br /><br />
          <p>Hello, {account?.name}</p>
          <p><strong>Balance : </strong> {account?.balance} Baht</p>
          <label htmlFor="number">Amount :</label> &nbsp;
          <input name="number" id="number" type="number" onChange={handleTransaction} />&nbsp;&nbsp;
          <button onClick={handleWithdrawal}>Withdrawal</button>&nbsp;
          <button onClick={handleDeposit}>Deposit</button>
          <p>History</p>
          <ul>
            {history.map((item, index) =>
              <li key={index}>{item.type} : {item.amount} Baht</li>
            )}
          </ul>
        </>
      }

    </div>
  );
}

export default App;

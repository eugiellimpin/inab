import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class TransactionForm extends Component {
  render() {
    return (
      <div>
        <input type="text" value="07/03/2017" name="transaction-date" />
        <input type="text" value="Ramen Kuroda" name="payee" />
        <input type="text" value="Food" name="category" />
        <input type="text" value="Chicken Teriyaki Don" name="memo" />
        <input type="text" value="180.00" name="outflow" />
        <input type="text" value="" name="inflow" />
        <input type="submit" value="Save" />
      </div>
    );
  }
}

class Transaction extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.details.date}</td>
        <td>{this.props.details.payee}</td>
        <td>{this.props.details.category}</td>
        <td>{this.props.details.memo}</td>
        <td>{this.props.details.outflow}</td>
        <td>{this.props.details.inflow}</td>
      </tr>
    )
  }
}

class TransactionList extends Component {
  render() {
    const transactionRows = this.props.transactions.map((txn) => (
      <Transaction details={txn} />
    ));

    return (
      <div>
        <TransactionForm />

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Payee</th>
              <th>Category</th>
              <th>Memo</th>
              <th>Outflow</th>
              <th>Inflow</th>
            </tr>
          </thead>
          {transactionRows}
        </table>
      </div>
    );
  }
}
class App extends Component {
  render() {
    const transactions = [
      { date: '07/03/2017', payee: 'Ramen Kuroda', category: 'Food', memo: 'Chicken Teriyaki Don', outflow: '180.00', inflow: ''},
      { date: '07/03/2017', payee: 'Pan De Manila', category: 'Food', memo: 'Breakfast', outflow: '80.00', inflow: ''},
      { date: '07/02/2017', payee: 'Tricycle', category: 'Transportation', memo: '', outflow: '20', inflow: ''},
      { date: '07/02/2017', payee: 'Cash & Carry', category: 'Grocery', memo: '', outflow: '500.00', inflow: ''},
      { date: '06/30/2017', payee: 'Myself', category: 'To be Budgeted', memo: 'Quipper Income', outflow: '', inflow: '20000.00'},
    ];

    return (
      <TransactionList transactions={transactions} />
    );
  }
}

export default App;

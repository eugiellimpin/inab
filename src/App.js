import React, { Component } from 'react';
import './App.css';

class TransactionForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transactionDate: '',
      payee: '',
      category: '',
      memo: '',
      outflow: '',
      inflow: '',
    };
  }

  render() {
    const categoryOptions = this.props.categories.map((category) => (
      <option value={category}>{category}</option>
    ));

    return (
      <div>
        <input type="date" onChange={this.handleInputChange} value={this.state.transactionDate} placeholder="Transaction Date" name="transactionDate" />
        <input type="text" onChange={this.handleInputChange} value={this.state.payee} placeholder="Payee" name="payee" />

        <select onChange={this.handleInputChange} value={this.state.category} name="category">
          {categoryOptions}
        </select>

        <input type="text" onChange={this.handleInputChange} value={this.state.memo} placeholder="Memo" name="memo" />
        <input type="text" onChange={this.handleInputChange} value={this.state.outflow} placeholder="Outflow" name="outflow" />
        <input type="text" onChange={this.handleInputChange} value={this.state.inflow} placeholder="Inflow" name="inflow" />
        <input type="submit" onClick={() => this.props.onSubmit(this.state)} value="Save" />
      </div>
    );
  }

  handleInputChange = ({ target }) => {
    const value = target.value;
    const name = target.name;
    let changes = { [name]: value };

    if (name.endsWith('flow')) {
      if (name === 'inflow' && value.length > 0) {
        changes.outflow = '';
      }

      if (name === 'outflow' && value.length > 0) {
        changes.inflow = '';
      }
    }

    this.setState(changes);
  }
}

class Transaction extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.details.transactionDate}</td>
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
  constructor(props) {
    super(props);

    const transactions = [
      { transactionDate: '07/03/2017', payee: 'Ramen Kuroda', category: 'Food', memo: 'Chicken Teriyaki Don', outflow: '180.00', inflow: ''},
      { transactionDate: '07/03/2017', payee: 'Pan De Manila', category: 'Food', memo: 'Breakfast', outflow: '80.00', inflow: ''},
      { transactionDate: '07/02/2017', payee: 'Tricycle', category: 'Transportation', memo: '', outflow: '20', inflow: ''},
      { transactionDate: '07/02/2017', payee: 'Cash & Carry', category: 'Grocery', memo: '', outflow: '500.00', inflow: ''},
      { transactionDate: '06/30/2017', payee: 'Myself', category: 'To be Budgeted', memo: 'Quipper Income', outflow: '', inflow: '20000.00'},
    ];

    const categories = [
      'Food',
      'Transportation',
      'Groceries',
    ]

    this.state = {
      transactions,
      categories
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const transactionRows = this.state.transactions.map((txn) => (
      <Transaction details={txn} />
    ));

    return (
      <div>
        <TransactionForm onSubmit={this.handleSubmit} categories={this.state.categories} />

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
          <tbody>
            {transactionRows}
          </tbody>
        </table>
      </div>
    );
  }

  handleSubmit = (transaction) => {
    const flow = { inflow: null, outflow: null }
    let inflow = !!transaction.inflow;

    // Either inflow has a value or outflow has a value or both don't have a
    // value
    let amount = Number.parseFloat(transaction.inflow);
    if (!inflow) {
      amount = Number.parseFloat(transaction.outflow);
    }

    // Ignore non-numeric values and 0
    if (!Number.isNaN(amount) && amount > 0) {
      // If value is negative make it positive and reverse the flow
      if (amount < 0) {
        inflow = !inflow;
        amount = amount * -1;
      }

      if (inflow) {
        flow.inflow = amount;
      } else {
        flow.outflow = amount;
      }
    }

    const newTransaction = Object.assign({}, transaction, flow)

    this.setState({ transactions: [...this.state.transactions, newTransaction] })
  }
}

class App extends Component {
  render() {
    return (
      <TransactionList />
    );
  }
}

export default App;

import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import {
  Button,
  Form,
  FormGroup,
  Input
} from 'reactstrap';
import './App.css';

class TransactionForm extends Component {
  getInitialState = () => ({
    transactionDate: '',
    payee: '',
    category: this.props.categories[0],
    memo: '',
    outflow: '',
    inflow: '',
  })

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  render() {
    const categoryOptions = this.props.categories.map((category) => (
      <option value={category}>{category}</option>
    ));

    return (
      <Form inline>
        <Input type="date" name="transactionDate" size="sm" placeholder="Transaction Date" onChange={this.handleInputChange} value={this.state.transactionDate} />
        <Input type="text" name="payee" size="sm" placeholder="Payee" onChange={this.handleInputChange} value={this.state.payee} />

        <Input type="select" name="category" size="sm" onChange={this.handleInputChange} value={this.state.category} >
          {categoryOptions}
        </Input>

        <Input type="text" name="memo" size="sm" placeholder="Memo" onChange={this.handleInputChange} value={this.state.memo} />
        <Input type="text" name="outflow" size="sm" placeholder="Outflow" onChange={this.handleInputChange} value={this.state.outflow}  />
        <Input type="text" name="inflow" size="sm" placeholder="Inflow" onChange={this.handleInputChange} value={this.state.inflow} />
        <Button color="primary" size="sm" onClick={this.handleSubmit} >Save</Button>
      </Form>
    );
  }

  handleSubmit = () => {
    this.props.onSubmit(this.state);
    this.setState(this.getInitialState());
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

const BudgetCategory = (props) => {
}

const BudgetCategoryGroup = (props) => {
  const categories = props.categories.map((category) => (
    <li>{category}</li>
  ));

  return (
    <div>
      <h3>{props.name}</h3>

      <ul>{categories}</ul>
    </div>
  );
};

const Budget = () => {
  const categoryGroups = [
    { name: 'Immediate Obligations', categories: ['Rent/Mortgage', 'Electric', 'Water', 'Internet', 'Groceries', 'Transportation'] },
    { name: 'True Expenses', categories: ['Clothing', 'Medical'] },
    { name: 'Quality of Life Goals', categories: ['Vacation', 'Fitness', 'Education'] },
    { name: 'Just for Fun', categories: ['Dining Out', 'Gaming', 'Fun Money'] },
  ];

  const groups = categoryGroups.map((group) => (
      <BudgetCategoryGroup name={group.name} categories={group.categories} />
  ));

  return (
    <div>
      {groups}
    </div>
  );
};

const App = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Budget</Link></li>
        <li><Link to="/accounts">Accounts</Link></li>
      </ul>

      <Route exact path="/" component={Budget} />
      <Route path="/accounts" component={TransactionList} />
    </div>
  </Router>
);

export default App;

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
  Input,
  Popover,
  PopoverContent,
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

const BudgetCategory = (props) => (
  <Form inline className="row">
    <div className="col-sm-3">
      <span>{props.name}</span>
    </div>
    <div className="col-sm-3">
      <Input type="text" name="budget" size="sm" value={props.budget} />
    </div>
    <div className="col-sm-3">
      <Input type="text" name="activity" size="sm" value={props.activity} disabled />
    </div>
    <div className="col-sm-3">
      <Input type="text" name="available" size="sm" value={props.available} disabled />
    </div>
  </Form>
);

class BudgetCategoryGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newCategoryFormOpen: false
    };
  }

  toggleNewCategoryForm = (event) => {
    this.setState({ newCategoryFormOpen: !this.state.newCategoryFormOpen });
  }

  render() {
    const categories = this.props.categories.map((category) => (
      <BudgetCategory {...category} />
    ));

    return (
      <div>
        <div>
          <h3>{this.props.name}</h3>
          <Button id={this.props.id} onClick={this.toggleNewCategoryForm} size="sm">Add category</Button>
          <Popover
            placement="bottom"
            isOpen={this.state.newCategoryFormOpen}
            target={this.props.id} >
            <PopoverContent>Test</PopoverContent>
          </Popover>
        </div>

        <ul>{categories}</ul>
      </div>
    );
  }
}

const Budget = () => {
  const categoryGroups = [
    {
      id: 'immediate-obligations',
      name: 'Immediate Obligations',
      categories: [
        { name: 'Rent/Mortgage', budget: 0, activity: 0, available: 0 },
        { name: 'Electric', budget: 0, activity: 0, available: 0 },
        { name: 'Water', budget: 0, activity: 0, available: 0 },
        { name: 'Internet', budget: 0, activity: 0, available: 0 },
        { name: 'Groceries', budget: 0, activity: 0, available: 0 },
        { name: 'Transportation', budget: 0, activity: 0, available: 0 },
      ],
    },
    {
      id: 'true-expenses',
      name: 'True Expenses',
      categories: [
        { name: 'Clothing', budget: 0, activity: 0, available: 0 },
        { name: 'Medical', budget: 0, activity: 0, available: 0 },
      ]
    },
    // { name: 'Quality of Life Goals', categories: ['Vacation', 'Fitness', 'Education'] },
    // { name: 'Just for Fun', categories: ['Dining Out', 'Gaming', 'Fun Money'] },
  ];

  const groups = categoryGroups.map((group) => (
      <BudgetCategoryGroup {...group} />
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

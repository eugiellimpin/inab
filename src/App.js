import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Nav,
  NavItem,
  NavLink,
  Popover,
  PopoverContent,
  Row,
} from 'reactstrap';
import configureStore from './configureStore';
import { fetchCategoryGroups } from './actions';
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

class CategoryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    }
  }

  render() {
    return (
      <div>
        <FormGroup>
          <Input value={this.state.name} name="name" onChange={this.handleInputChange} type="text" size="sm" placeholder="New Category" />
        </FormGroup>
        <Button onClick={this.props.onCancel} color="secondary" size="sm">Cancel</Button>
        <Button onClick={this.handleSubmit} color="primary" size="sm">Add</Button>
      </div>
    );
  }

  handleInputChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  }

  handleSubmit = () => {
    this.props.onSubmit(this.state.name);
  }
}

class InlineEditableText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
      editing: false,
    }
  }

  toggleEditMode = (event) => {
    this.setState({ editing: !this.state.editing });
  }

  handleSubmit = (event) => {
    if (event.type === 'keypress' && event.which !== 13) {
      return;
    }

    this.toggleEditMode();
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const editField = (
      <Input
          autoFocus
          type="text"
          name="text"
          size="sm"
          value={this.state.text}
          onChange={this.handleInputChange}
          onFocus={(e) => e.target.select()}
          onBlur={this.handleSubmit}
          onKeyPress={this.handleSubmit}
      />
    );

    return (
      this.state.editing
        ? editField
        : <a onClick={this.toggleEditMode}>{this.state.text}</a>
    );
  }
}

class BudgetCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props
    }
  }

  render() {
    return (
      <Form inline className="row">
        <div className="col-sm-3">
          <InlineEditableText text={this.state.name}/>
        </div>
        <div className="col-sm-3">
          <Input
            type="text"
            name="budget"
            size="sm"
            value={this.state.budget}
            onChange={this.handleInputChange}
            onClick={(event) => event.target.select() }
            onKeyPress={this.handleUpdateBudget}
            onBlur={this.handleUpdateBudget}
          />
        </div>
        <div className="col-sm-3">
          <Input type="text" name="activity" size="sm" value={this.state.activity} disabled />
        </div>
        <div className="col-sm-3">
          <Input type="text" name="available" size="sm" value={this.state.available} disabled />
        </div>
      </Form>
    );
  }

  handleUpdateBudget = (event) => {
    if (event.type === 'blur' || (event.type === 'keypress' && event.which === 13)) {
      let value = Number.parseFloat(event.target.value);
      value = Number.isNaN(value) ? 0 : value;
      this.setState({ budget: value });
      event.target.blur();
    }
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }
}

class BudgetCategoryGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newCategoryFormOpen: false
    };
  }

  htmlIdAttr = (groupId) => `category-group-${groupId}`

  toggleNewCategoryForm = (event) => {
    this.setState({ newCategoryFormOpen: !this.state.newCategoryFormOpen });
  }

  handleCategoryFormSubmit = (categoryName) => {
    this.props.onAddNewCategory(categoryName);
    this.toggleNewCategoryForm();
  }

  render() {
    const categories = this.props.categories.map((category) => (
      <BudgetCategory {...category} />
    ));

    return (
      <div>
        <div>
          <h3>
            <InlineEditableText text={this.props.name}/>
          </h3>
          <Button id={this.htmlIdAttr(this.props.id)} onClick={this.toggleNewCategoryForm} size="sm">Add category</Button>
          <Popover
            placement="right"
            isOpen={this.state.newCategoryFormOpen}
            target={this.htmlIdAttr(this.props.id)}
            toggle={this.toggleNewCategoryForm} >
            <PopoverContent>
              <CategoryForm onCancel={this.toggleNewCategoryForm} onSubmit={this.handleCategoryFormSubmit} />
            </PopoverContent>
          </Popover>
        </div>

        <ul>{categories}</ul>
      </div>
    );
  }
}

class Budget extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCategoryGroups());
  }

  componentDidUpdate() {
  }

  render() {
    const groups = this.props.categoryGroups.map((group) => (
       <BudgetCategoryGroup key={group.id} {...group} onAddNewCategory={this.handleAddNewCategory(group.id)}  />
    ));

    return (
      <div>
        {groups}
      </div>
    );
  }

  handleAddNewCategory = (categoryGroupId) => (newCategoryName) => {
    console.log(`add new category ${newCategoryName} to ${categoryGroupId}`);
  }
}

const mapStateToProps = (state) => {
  return { ...state };
};

const BudgetContainer = connect(mapStateToProps)(Budget);

const App = () => (
  <Provider store={configureStore()}>
    <Router>
      <div>
        <Row>
          <Col sm="2">
            <Nav vertical>
              <NavItem>
                <NavLink>
                  <Link to="/">Budget</Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  <Link to="/accounts">Accounts</Link>
                </NavLink>
              </NavItem>
            </Nav>
          </Col>

          <Col sm="10">
            <Route exact path="/" component={BudgetContainer} />
            <Route path="/accounts" component={TransactionList} />
          </Col>
        </Row>
      </div>
    </Router>
  </Provider>
);

export default App;

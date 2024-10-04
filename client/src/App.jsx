import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import CustomerDetail from './components/CustomerDetail';
import CompanyList from './components/CompanyList';
import CompanyForm from './components/CompanyForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path="/" component={CustomerList} />
          <Route path="/customers/new" component={CustomerForm} />
          <Route path="/customers/:id/edit" component={CustomerForm} />
          <Route path="/customers/:id" component={CustomerDetail} />
          <Route exact path="/companies" component={CompanyList} />
          <Route path="/companies/new" component={CompanyForm} />
          <Route path="/companies/:id/edit" component={CompanyForm} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
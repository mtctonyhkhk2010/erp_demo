import { useState, useEffect } from 'react';
import {useParams, Form, useNavigate} from 'react-router-dom';
import axios from 'axios';
import TextField from "@mui/material/TextField";
import {Box, Button, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select} from "@mui/material";
import {MuiTelInput} from "mui-tel-input";

export default function CustomerForm() {
    const [customer, setCustomer] = useState(null);
    const [companies, setCompanies] = useState([]);
    const { customerId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompanies();
        if (customerId)
        {
            fetchCustomer();
        }
    }, [customerId]);

    const fetchCustomer = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/customers/${customerId}`);
            setCustomer(response.data);
        } catch (error) {
            console.error('Error fetching customer:', error);
        }
    };

    const fetchCompanies = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/companies');
            setCompanies(response.data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (customerId) {
                await axios.put(`http://localhost:8080/api/customers/${customerId}`, customer);
            } else {
                await axios.post('http://localhost:8080/api/customers', customer);
            }
            navigate('/customers');
        } catch (error) {
            console.error('Error saving customer:', error);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:8080/api/customers/${customerId}`);
            navigate('/customers');
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    const handleChange = (e) => {
        setCustomer( { ...customer, [e.target.id]: e.target.value } );
    };

    const handlePhoneChange = (value) => {
        setCustomer({ ...customer, ['phone']: value });
    };

    function handleCompanyChange(event) {
        setCustomer({ ...customer, ['companies_id']: event.target.value });
    }

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const handleCreateOrUpdateCustomer = async (e) => {
        e.preventDefault();
        try {
            if (customer.shopifyId)
            {
                await axios.put(`http://localhost:8080/api/shopify/customer/${customer.shopifyId}`, customer);
            }
            else
            {
                await axios.post(`http://localhost:8080/api/shopify/customer`, customer);
            }
            await fetchCustomer();
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    }

    const handleGetCustomer = async (e) => {
        e.preventDefault();
        try {
            if (customer.shopifyId)
            {
                await axios.get(`http://localhost:8080/api/shopify/customer/${customer.shopifyId}`);
            }
            await fetchCustomer();
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    }

    return (
        <div id="customer">
            <h1 className="text-lg font-bold mb-3">{customerId ? 'Edit' : 'Create'} Customer</h1>
            <Form onSubmit={handleSubmit}>
                <TextField
                    required
                    id="firstName"
                    label="First Name"
                    value={customer && customer.firstName || ''}
                    onChange={handleChange}
                    fullWidth
                    className="!mb-3"
                />
                <TextField
                    required
                    id="lastName"
                    label="Last Name"
                    value={customer && customer.lastName  || ''}
                    onChange={handleChange}
                    fullWidth
                    className="!mb-3"
                />
                <TextField
                    required
                    id="email"
                    label="Email"
                    value={customer && customer.email  || ''}
                    onChange={handleChange}
                    fullWidth
                    className="!mb-3"
                />
                <MuiTelInput
                    required
                    id="phone"
                    label="Phone Number"
                    value={customer && customer.phone  || ''}
                    onChange={handlePhoneChange}
                    defaultCountry="CA"
                    onlyCountries={['CA', 'US', 'HK']}
                    fullWidth
                    className="!mb-3"
                />
                <FormControl fullWidth>
                    <InputLabel id="company-select-label">Company</InputLabel>
                    <Select
                        labelId="company-select-label"
                        id="company-select"
                        multiple
                        value={customer && customer.companies_id || []}
                        label="Company"
                        onChange={handleCompanyChange}
                        input={<OutlinedInput label="Name" />}
                        className="!mb-3"
                        MenuProps={MenuProps}
                    >
                        {companies.map((company) => (
                            <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <div className="mb-3">
                    <Button variant="contained" type={'submit'} className="!mr-3">{customerId ? 'Update' : 'Create'}</Button>
                    {customerId ? (
                        <Button variant="contained" color={'error'} type={'button'} onClick={(event) => {
                            if (confirm("Please confirm you want to delete this record.")) {
                                handleDelete(event);
                            }
                        }}>Delete</Button>
                    ) : null}
                </div>
                <div>
                    {customer ? (
                    <Button variant="contained" type={'button'} color={'secondary'} className="!mr-3" onClick={(event) => {
                        if (confirm("Please confirm you want to sync this customer to Shopify")) {
                            handleCreateOrUpdateCustomer(event);
                        }
                    }}>{customer.shopifyId ? 'Sync to Shopify' : 'Create customer at Shopify'}</Button>
                    ) : null}
                    {customer && customer.shopifyId ? (
                        <Button variant="contained" color={'warning'} type={'button'} onClick={(event) => {
                            if (confirm("Please confirm you want to get data from Shopify.")) {
                                handleGetCustomer(event);
                            }
                        }}>Sync from shopify</Button>
                    ) : null}
                </div>
            </Form>
        </div>
    );
}
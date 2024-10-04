import { useState, useEffect } from 'react';
import {useParams, Link} from 'react-router-dom';
import axios from 'axios';
import {Button, Chip} from "@mui/material";

export default function CustomerForm() {
    const [customer, setCustomer] = useState(null);
    const { customerId } = useParams();

    useEffect(() => {
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

    if (!customer) return <div>Loading...</div>;

    return (
        <div>
            <h1 className='text-lg font-bold mb-3'>Customer Detail</h1>
            <div className='mb-3'>Name: {customer.firstName} {customer.lastName}</div>
            <div className='mb-3'>Email: {customer.email}</div>
            <div className='mb-3'>Phone: {customer.phone}</div>
            {customer.Companies.length > 0 ? (
                <div>Companies: {customer.Companies.map((company) => (
                    <Chip key={company.id} label={company.name} variant="outlined" />
                ))}</div>
            ) : ''}
            <Button variant="contained" color={'success'} type={'button'} component={Link} to={`/customers/${customerId}/edit`}
                    className='!mt-3'>Edit</Button>
        </div>
    );
}
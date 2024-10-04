import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {Button, Chip} from "@mui/material";

export default function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async (query = null) => {
        try {
            const response = query ? await axios.get('http://localhost:8080/api/customers?query=' + query) : await axios.get('http://localhost:8080/api/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    useEffect(() => {
        fetchCustomers(searchTerm);
    },[searchTerm]);

    return (
        <div>
            <h1 className='text-lg font-bold mb-3'>Customers List</h1>

            <div className='flex justify-between align-middle'>
                <TextField id="search"
                           className='!mb-3'
                           label="Search customers..."
                           variant="outlined"
                           onChange={(e) => setSearchTerm(e.target.value)}
                />

                <Button variant="contained" color={'success'} type={'button'} component={Link} to={`/customers/create`} className='!mb-3'>Create</Button>
            </div>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.length > 0 ? customers.map((customer) => (
                            <TableRow
                                key={customer.id}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell>
                                    {customer.firstName} {customer.lastName}
                                </TableCell>
                                <TableCell>{customer.phone}</TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>
                                    {customer.Companies.length > 0 ? (
                                        customer.Companies.map((company) => (
                                            <Chip key={company.id} label={company.name} variant="outlined" />
                                        ))
                                    ) : ''}
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" type={'button'} component={Link} to={`/customers/${customer.id}`}>View</Button>
                                </TableCell>
                            </TableRow>
                        )) :
                        <TableRow>
                            <TableCell colSpan={5}>No result</TableCell>
                        </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
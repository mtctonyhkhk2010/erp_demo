import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {Button} from "@mui/material";

export default function CompanyList() {
    const [companies, setCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async (query) => {
        try {
            const response = query ? await axios.get('http://localhost:8080/api/companies?query=' + query) : await axios.get('http://localhost:8080/api/companies');
            setCompanies(response.data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    useEffect(() => {
        fetchCompanies(searchTerm);
    }, [searchTerm]);

    return (
        <div>
            <h1 className='text-lg font-bold mb-3'>Companies List</h1>

            <div className='flex justify-between align-middle'>
                <TextField id="search"
                           className='!mb-3'
                           label="Search companies..."
                           variant="outlined"
                           onChange={(e) => setSearchTerm(e.target.value)}
                />

                <Button variant="contained" color={'success'} type={'button'} component={Link} to={`/companies/create`}
                        className='!mb-3'>Create</Button>
            </div>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {companies.length > 0 ? companies.map((company) => (
                                <TableRow
                                    key={company.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell>
                                        {company.name}
                                    </TableCell>
                                    <TableCell>
                                        {company.phone}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" type={'button'} component={Link}
                                                to={`/companies/${company.id}`}>Edit</Button>
                                    </TableCell>
                                </TableRow>
                            )) :
                            <TableRow>
                                <TableCell colSpan={3}>No result</TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
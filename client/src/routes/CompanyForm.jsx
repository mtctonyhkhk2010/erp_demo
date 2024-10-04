import { useState, useEffect } from 'react';
import {useParams, Form, useNavigate} from 'react-router-dom';
import axios from 'axios';
import TextField from "@mui/material/TextField";
import {Button, FormControl, InputLabel, MenuItem, Select} from "@mui/material";

export default function CompanyDetail() {
    const [company, setCompany] = useState(null);
    const { companyId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (companyId) {
            fetchCompany();
        }
    }, [companyId]);

    const fetchCompany = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/companies/${companyId}`);
            setCompany(response.data);
        } catch (error) {
            console.error('Error fetching company:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (companyId) {
                await axios.put(`http://localhost:8080/api/companies/${companyId}`, company);
            } else {
                await axios.post('http://localhost:8080/api/companies', company);
            }
            navigate('/companies');
        } catch (error) {
            console.error('Error saving company:', error);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:8080/api/companies/${companyId}`);
            navigate('/companies');
        } catch (error) {
            console.error('Error deleting company:', error);
        }
    };

    const handleChange = (e) => {
        setCompany( { ...company, [e.target.id]: e.target.value } );
    };

    return (
        <div id="company">
            <h1 className="text-lg font-bold mb-3">{companyId ? 'Edit' : 'Create'} company</h1>
            <Form onSubmit={handleSubmit}>
                <TextField
                    required
                    id="name"
                    label="Name"
                    value={company && company.name || ''}
                    onChange={handleChange}
                    fullWidth
                    className="!mb-3"
                />
                <TextField
                    required
                    id="address"
                    label="Address"
                    value={company && company.address || ''}
                    onChange={handleChange}
                    fullWidth
                    className="!mb-3"
                />
                <TextField
                    required
                    id="phone"
                    label="Phone Number"
                    value={company && company.phone || ''}
                    onChange={handleChange}
                    fullWidth
                    className="!mb-3"
                />
                <TextField
                    required
                    id="website"
                    label="Website"
                    value={company && company.website || ''}
                    onChange={handleChange}
                    fullWidth
                    className="!mb-3"
                />
                <div>
                    <Button variant="contained" type={'submit'} className="!mr-3">{companyId ? 'Update' : 'Create'}</Button>
                    {companyId ? (
                        <Button variant="contained" color={'error'} type={'button'} onClick={(event) => {
                            if (confirm("Please confirm you want to delete this record.")) {
                                handleDelete(event);
                            }
                        }}>Delete</Button>
                    ) : null}
                </div>
            </Form>
        </div>
    );
}
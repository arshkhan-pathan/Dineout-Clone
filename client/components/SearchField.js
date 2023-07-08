// packages
import { TextField } from '@mui/material';


const SearchField = ({ searchQuery, onChange }) => {
    return (
        <TextField
            label="Search"
            fullWidth
            size="small"
            margin="none"
            sx={{ mb: 2 }}
            type="search"
            value={searchQuery}
            onChange={onChange}
        />
    );
};

export default SearchField;
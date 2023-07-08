// packages
import { useState } from 'react';
import { Box, Typography } from '@mui/material';
// store
import { useGetTypesQuery } from '@/store/api/restaurant';
// components
import SearchField from '@/components/SearchField';


const FilterTypes = ({ selectedFilters, setSelectedFilters }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const { data } = useGetTypesQuery();

    const onChange = ({ target: { value } }) => {
        setSearchQuery(value);
    };

    const onSelect = (item) => {
        if (selectedFilters?.types !== item) {
            setSelectedFilters((prev) => ({ ...prev, types: item }));
        } else {
            setSelectedFilters((prev) => ({ ...prev, types: '' }));
        }
    };

    const filteredData = data?.filter((item) =>
        item?.name.toLowerCase().includes(searchQuery)
    );

    return (
        <Box>
            <SearchField searchQuery={searchQuery} onChange={onChange} />

            {filteredData?.map((type) => (
                <Typography
                    gutterBottom
                    key={type?.id}
                    sx={{
                        opacity: selectedFilters?.types === type?.name ? 0.8 : 0.4,
                        cursor: "pointer",
                    }}
                    onClick={() => onSelect(type?.name)}
                >
                    {type?.name}
                </Typography>
            ))}
        </Box>
    );
};

export default FilterTypes;
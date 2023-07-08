// packages
import { Box } from '@mui/material';
// store
import { useGetCuisinesQuery, useGetTagsQuery } from '@/store/api/restaurant';
//
import Accordtion from './Accordion';
import FilterTypes from './FilterTypes';
import FilterDetails from './FilterDetails';


const Filters = ({ selectedFilters, setSelectedFilters }) => {
  return (
    <Box>
      <Accordtion
        summary="Types"
        details={
          <FilterTypes
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
        }
      />
      <Accordtion
        summary="Cuisines"
        details={
          <FilterDetails
            setSelectedFilters={setSelectedFilters}
            title="cuisines"
            getData={useGetCuisinesQuery}
          />
        }
      />
      <Accordtion
        summary="Tags"
        details={
          <FilterDetails
            setSelectedFilters={setSelectedFilters}
            title="tags"
            getData={useGetTagsQuery}
          />
        }
      />
    </Box>
  );
};

export default Filters;

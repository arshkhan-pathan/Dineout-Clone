// packages
import { useState, useEffect } from "react";
import { Box, Grid, FormControlLabel, Checkbox } from "@mui/material";
// components
import SearchField from "@/components/SearchField";
// utils
import convertToString from "@/utils/convertToString";

const FilterDetails = ({ setSelectedFilters, title, getData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const { data } = getData();

  const onChange = ({ target: { value } }) => {
    setSearchQuery(value);
  };

  const onSelect = (event) => {
    const { value } = event.target;
    const updatedCheckboxes = [...selectedItems];

    if (updatedCheckboxes.includes(value)) {
      // Deselect the checkbox
      const index = updatedCheckboxes.indexOf(value);
      updatedCheckboxes.splice(index, 1);
    } else {
      // Select the checkbox
      updatedCheckboxes.push(value);
    }

    setSelectedItems(updatedCheckboxes);
  };

  useEffect(() => {
    setSelectedFilters((prev) => ({
      ...prev,
      [title]: convertToString(selectedItems),
    }));
  }, [selectedItems]);

  const filteredData = data?.filter((item) =>
    item?.name.toLowerCase().includes(searchQuery)
  );

  return (
    <Box>
      <SearchField searchQuery={searchQuery} onChange={onChange} />

      <Grid container>
        {filteredData?.map((item) => (
          <Grid item xs={12} key={item?.id}>
            <FormControlLabel
              gutterBottom
              control={
                <Checkbox
                  size="small"
                  checked={selectedItems.includes(item?.name)}
                  onChange={onSelect}
                  value={item?.name}
                />
              }
              label={item?.name}
              sx={{
                fontSize: "13px",
                opacity: 0.5,
                cursor: "pointer",
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FilterDetails;

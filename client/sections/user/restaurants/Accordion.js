// packages
import { useState } from 'react';
import {
    Accordion as MuiAccordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


// styles
const IconSx = {
    width: 15,
};

const Accordtion = ({ summary, details }) => {
    const [expended, setExpended] = useState(true);

    const onToggle = () => {
        setExpended(prev => !prev);
    }

    return (
        <Box>
            <MuiAccordion
                square
                disableGutters
                defaultExpanded
                TransitionProps={{ unmountOnExit: true }}
                onChange={onToggle}
            >
                <AccordionSummary
                    expandIcon={expended ? <RemoveIcon sx={IconSx} /> : <AddIcon sx={IconSx} />}
                >
                    <Typography variant='subtitle2' sx={{opacity: 0.5, fontWeight: 'bold'}}>{summary}</Typography>
                </AccordionSummary>

                <AccordionDetails>
                    {details}
                </AccordionDetails>
            </MuiAccordion>
        </Box>
    );
};

export default Accordtion;

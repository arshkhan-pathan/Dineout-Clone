// packages
import ReactSelect from 'react-select';


const Select = (props) => {
    return (
        <ReactSelect
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            isMulti
            styles={{
                option: (props) => ({
                    ...props,
                })
            }}
            {...props}
        />
    )
};

export default Select;

import {
    TextField,
    Box,
    Autocomplete
} from "@mui/material";
import { countries } from "../utils/countryList";

const CountrySelectField = ({
    value,
    setFormValues,
    handleChange
}) => {
    return (
        <Autocomplete
            options={countries}
            autoHighlight
            getOptionLabel={(option) => option.label}
            onChange={(e, value) => {
                setFormValues(prev => ({ ...prev, "country": value?.label || "", "countryCode": value?.code || "" }));
            }
            }
            renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                    <Box
                        key={key}
                        component="li"
                        sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                        {...optionProps}
                    >
                        <img
                            loading="lazy"
                            width="20"
                            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                            alt=""
                        />
                        {option.label} ({option.code}) +{option.phone}
                    </Box>
                );
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Country"
                    name="country"
                    onChange={handleChange}
                    value={value}
                    required
                    slotProps={{
                        htmlInput: {
                            ...params.inputProps,
                        },
                    }}
                />
            )}
        />
    )
}

export default CountrySelectField
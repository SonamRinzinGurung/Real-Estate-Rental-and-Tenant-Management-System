import { useState } from "react";
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Avatar,
} from "@mui/material";
import { countries } from "../utils/countryList";


export default function PhoneNumberField({
    value,
    handleChange,
    defaultCountryCode = "US",
    size = "medium",
    fullWidth = false,
    sx = {},
    label = "Phone",
    name = "phoneNumber",
}) {
    const [selectedCountry, setSelectedCountry] = useState(
        countries.find((c) => c.code === defaultCountryCode) || countries[0]
    );
    const [phone, setPhone] = useState(value || "");

    const handleCountryChange = (e) => {
        const code = e.target.value;
        const country = countries.find((c) => c.code === code) || countries[0];
        setSelectedCountry(country);

        // Trigger handleChange with updated full phone number
        const fullPhone = `+${country.phone} ${phone}`;
        handleChange(fullPhone);
    };

    const handlePhoneChange = (e) => {
        // Trigger handleChange with updated full phone number
        setPhone(e.target.value);
        const fullPhone = `+${selectedCountry.phone} ${e.target.value}`;
        handleChange(fullPhone);
    };

    return (
        <Box sx={{
            display: "flex", gap: 1, alignItems: "start", flexDirection: {
                xs: "column", sm: "row"
            }, ...sx
        }}>
            <Box sx={{ minWidth: 130 }}>
                <FormControl fullWidth={fullWidth} size={size}>
                    <InputLabel id="phone-country-select-label">Country</InputLabel>
                    <Select
                        labelId="phone-country-select-label"
                        value={selectedCountry?.code || ""}
                        label="Country"
                        onChange={handleCountryChange}
                        renderValue={(selected) => {
                            const c = countries.find((x) => x.code === selected);
                            if (!c) return "";
                            return (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Avatar
                                        src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`}
                                        alt={c.code}
                                        sx={{ width: 20, height: 14 }}
                                        variant="square"
                                    />
                                    <Box component="span">{`${c.code} (+${c.phone})`}</Box>
                                </Box>
                            );
                        }}
                    >
                        {countries.map((c) => (
                            <MenuItem key={c.code} value={c.code}>
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <Avatar
                                        src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`}
                                        alt={c.code}
                                        sx={{ width: 20, height: 14 }}
                                        variant="square"
                                    />
                                </ListItemIcon>
                                <ListItemText primary={`${c.label}`} secondary={`+${c.phone}`} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <TextField
                label={label}
                value={phone}
                onChange={handlePhoneChange}
                fullWidth
                size={size}
                name={name}
            />
        </Box>
    );
}
import { OutlinedInput, Button } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import IconButton from "@mui/material/IconButton";

const SearchAndFilter = ({
  handleSearchSubmit,
  handleValueChange,
  clearFilter,
  search,
  category,
  lowerLimit,
  upperLimit,
}) => {
  const categories = [
    "all",
    "House",
    "Apartment",
    "Room",
    "Shop Space",
    "Office Space",
  ];
  return (
    <div className="w-3/5 mx-auto">
      <form action="" onSubmit={handleSearchSubmit}>
        <FormControl color="tertiary" sx={{ width: "100%" }} variant="outlined">
          <OutlinedInput
            color="tertiary"
            name="search"
            type="text"
            placeholder="Search"
            value={search}
            onChange={handleValueChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton edge="end" type="submit">
                  <SearchRoundedIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <div className="flex gap-2 flex-wrap items-center">
          <div className="flex w-44 md:w-48 mt-2 items-center">
            <label htmlFor="category" className="font-robotoNormal mx-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 "
              onChange={handleValueChange}
              value={category}
            >
              {categories.map((option) => {
                return (
                  <option key={option} value={option} className="">
                    {option}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex gap-2 mx-4">
            <p className="font-robotoNormal">Price range</p>
            <input
              type="number"
              name="lowerLimit"
              className="w-20 text-sm h-8 rounded-lg text-center"
              value={lowerLimit}
              onChange={handleValueChange}
            />
            to
            <input
              type="number"
              name="upperLimit"
              className="w-20 text-sm h-8 rounded-lg text-center"
              value={upperLimit}
              onChange={handleValueChange}
            />
          </div>
          <Button
            size="small"
            variant="contained"
            type="submit"
            color="tertiary"
            sx={{ color: "#fff" }}
          >
            Apply
          </Button>
          <Button
            variant="text"
            onClick={clearFilter}
            color="error"
            size="small"
          >
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchAndFilter;

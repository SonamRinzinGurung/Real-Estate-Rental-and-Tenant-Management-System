import { useState, useEffect, useCallback } from "react";
import { getAllRealEstate } from "../../features/realEstateTenant/realEstateTenantSlice";
import { useDispatch, useSelector } from "react-redux";
import { RealEstateCard, Footer, SearchAndFilter } from "../../components";
import { Pagination, CircularProgress } from "@mui/material";

const Homepage = () => {
  const dispatch = useDispatch();

  const { allRealEstate, isLoading, numberOfPages } = useSelector(
    (store) => store.realEstateTenant
  );

  // initial query for search and filter
  const initialQuery = {
    page: 1,
    search: "",
    category: "all",
    lowerLimit: "",
    upperLimit: "",
    priceFilter: "",
  };

  const [query, setQuery] = useState(initialQuery);

  // get all real estate on page load and when page number changes
  useEffect(() => {
    dispatch(getAllRealEstate({ ...query }));
  }, [query.page]);

  // update price filter when lower and upper limit changes
  useEffect(() => {
    if (query.lowerLimit && query.upperLimit) {
      query.priceFilter = query.lowerLimit + "-" + query.upperLimit;
    }
  }, [query.lowerLimit, query.upperLimit]);

  // function to handle page number change
  const handlePageChange = useCallback(
    (event, value) => {
      setQuery({ ...query, page: value });
    },
    [query]
  );

  // function to handle search and filter query value change
  const handleValueChange = useCallback(
    (event) => {
      setQuery({ ...query, [event.target.name]: event.target.value });
    },
    [query]
  );

  // function to handle search and filter submission and reset page number to 1
  const handleSearchSubmit = useCallback(
    (event) => {
      event.preventDefault();
      dispatch(getAllRealEstate({ ...query, page: 1 }));
    },
    [query, dispatch]
  );

  // function to clear search and filter
  const clearFilter = useCallback(() => {
    setQuery(initialQuery);
    dispatch(getAllRealEstate({ ...initialQuery }));
  }, [dispatch]);

  return (
    <>
      <div className="mt-8">
        <SearchAndFilter
          handleSearchSubmit={handleSearchSubmit}
          handleValueChange={handleValueChange}
          clearFilter={clearFilter}
          {...query}
        />

        {isLoading ? (
          <div className="flex justify-center mt-12 h-96">
            <CircularProgress size={"8rem"} />
          </div>
        ) : (
          <>
            <h3 className="text-center mt-8 mb-6 font-heading font-bold">
              All Properties
            </h3>

            {allRealEstate?.length === 0 ? (
              <h2 className="text-center mt-8 mb-6 font-heading font-bold">
                No Real Estate Found
              </h2>
            ) : (
              <main className="flex flex-wrap gap-5 justify-center mb-12 md:justify-center mx-4 md:mx-0">
                {allRealEstate?.map((item) => {
                  return <RealEstateCard key={item._id} {...item} />;
                })}
              </main>
            )}
          </>
        )}
      </div>

      <Pagination
        count={numberOfPages || 1}
        page={query?.page}
        onChange={handlePageChange}
        color="secondary"
        className="flex justify-center mb-12"
      />
      <Footer />
    </>
  );
};

export default Homepage;

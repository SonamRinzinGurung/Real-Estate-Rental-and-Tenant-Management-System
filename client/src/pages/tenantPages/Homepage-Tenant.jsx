import { useState, useEffect, useCallback } from "react";
import { getAllRealEstate } from "../../features/realEstateTenant/realEstateTenantSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  PageLoading,
  RealEstateCard,
  Footer,
  SearchAndFilter,
} from "../../components";
import Pagination from "@mui/material/Pagination";

const Homepage = () => {
  const { allRealEstate, isLoading, numberOfPages } = useSelector(
    (store) => store.realEstateTenant
  );

  const dispatch = useDispatch();

  const initialQuery = {
    page: 1,
    search: "",
    category: "all",
    lowerLimit: "",
    upperLimit: "",
    priceFilter: "",
  };
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    dispatch(getAllRealEstate({ ...query }));
  }, [query.page]);

  useEffect(() => {
    if (query.lowerLimit && query.upperLimit) {
      query.priceFilter = query.lowerLimit + "-" + query.upperLimit;
    }
  }, [query.lowerLimit, query.upperLimit]);

  const handlePageChange = useCallback(
    (event, value) => {
      setQuery({ ...query, page: value });
    },
    [query]
  );

  const handleValueChange = useCallback(
    (event) => {
      setQuery({ ...query, [event.target.name]: event.target.value });
    },
    [query]
  );

  const handleSearchSubmit = useCallback(
    (event) => {
      event.preventDefault();
      dispatch(getAllRealEstate({ ...query, page: 1 }));
    },
    [query, dispatch]
  );

  const clearFilter = useCallback(() => {
    setQuery(initialQuery);
    dispatch(getAllRealEstate({ ...initialQuery }));
  }, [dispatch]);

  if (isLoading) return <PageLoading />;

  return (
    <>
      <div className="mt-8">
        <SearchAndFilter
          handleSearchSubmit={handleSearchSubmit}
          handleValueChange={handleValueChange}
          clearFilter={clearFilter}
          {...query}
        />
        {allRealEstate?.length === 0 ? (
          <h2 className="text-center mt-8 mb-6 font-heading font-bold">
            No Real Estate Found
          </h2>
        ) : (
          <>
            <h3 className="text-center mt-8 mb-6 font-heading font-bold">
              All Properties
            </h3>
            <main className="flex flex-wrap gap-5 justify-center mb-12 md:justify-center">
              {allRealEstate?.map((item) => {
                return <RealEstateCard key={item._id} {...item} />;
              })}
            </main>
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

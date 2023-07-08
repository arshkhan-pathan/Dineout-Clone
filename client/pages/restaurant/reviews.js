import * as React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/slices/auth";
import withAuth from "@/utils/withAuth";
import ReviewSummmary from "@/sections/restaurant/home/ReivewSummary";
import { useGetReviewsQuery } from "@/store/api/restaurant";
import RestaurantLayout from "@/layouts/restaurant";
import Loading from "@/components/Loading";

const Reviews = () => {
  const user = useSelector(selectCurrentUser);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState("");

  const onFilterChange = (filter) => {
    setSelectedFilters(filter);
  };

  const { data, isError, isLoading, refetch } = useGetReviewsQuery(
    { id: user?.id, pageNumber, selectedFilters },
    { refetchOnMountOrArgChange: true }
  );

  const onPageChange = (event, value) => {
    setPageNumber(value);
  };

  return (
    <div>
      <RestaurantLayout title="Reviews">
        {isLoading ? (
          <Loading></Loading>
        ) : (
          <ReviewSummmary
            reviews={data?.results}
            count={data?.count}
            onPageChange={onPageChange}
            selectedFilters={selectedFilters}
            onFilterChange={onFilterChange}
          />
        )}
      </RestaurantLayout>
    </div>
  );
};

export default withAuth(Reviews, [2], "/restaurant/login");

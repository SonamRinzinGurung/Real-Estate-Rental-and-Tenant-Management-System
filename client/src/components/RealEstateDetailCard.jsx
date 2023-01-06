import React from "react";
import { format, dateFormatter } from "../utils/valueFormatter";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { ImageCarousal } from "../components";

const RealEstateDetailCard = ({
  title,
  address,
  price,
  realEstateImages,
  createdAt,
  category,
}) => {
  return (
    <>
      <section className="flex flex-col max-w-3xl m-4 py-4 px-6 gap-4 shadow-md">
        <div className="flex justify-between p-1 rounded-md">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">{title}</h3>
            <p className="-ml-1 text-base tracking-tight">
              <LocationOnOutlinedIcon color="secondary" />
              {address?.location}, {address?.streetName} ,Kathmandu
            </p>
            <div className="">
              <p className="font-robotoNormal text-xs font-semibold tracking-tight">
                Posted on: {dateFormatter(createdAt)}
              </p>
            </div>
          </div>
          <div className="self-start p-1 rounded-md  hover:shadow-inner transition-all ease-out duration-300">
            <p className="font-roboto text-primaryDark -mb-2">RENT per month</p>
            <span className="font-semibold text-lg text-primaryDark">
              NPR. {format(price)}
            </span>
            <div>
              <p className="font-roboto text-primaryDark">{category}</p>
            </div>
          </div>
        </div>
        <ImageCarousal realEstateImages={realEstateImages} />
      </section>
    </>
  );
};

export default RealEstateDetailCard;

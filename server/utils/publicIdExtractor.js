// Utility function to extract public IDs from Cloudinary image objects

const publicId = (imageUrl) => {
    const part = imageUrl.split("real-estate-system");
    if (part.length > 1) {
        return "real-estate-system" + part[1].split(".")[0];
    }
    return null;
}


export default publicId;
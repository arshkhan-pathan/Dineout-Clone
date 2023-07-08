const convertToString = (array) => {
    return array.slice(0, -1).join(",") + (array.length > 1 ? "," : "") + array.slice(-1);
};

export default convertToString;
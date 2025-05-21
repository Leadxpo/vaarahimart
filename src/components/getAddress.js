export const extractAddressDetails = (geocodeData) => {
    let address = {
        addressline_one: "",
        addressline_two: "",
        city: "",
        state: "",
        pincode: "",
    };
    // Loop through the results and find relevant data
    geocodeData.forEach(result => {
        result.address_components.forEach(component => {
            const types = component.types;

            if (types.includes("street_number")) {
                address.addressline_one = component.long_name;
            }

            if (types.includes("route")) {
                address.addressline_two = component.long_name;
            }

            if (types.includes("locality")) {
                address.city = component.long_name;
            }

            if (types.includes("administrative_area_level_1")) {
                address.state = component.long_name;
            }

            if (types.includes("postal_code")) {
                address.pincode = component.long_name;
            }
        });
    });

    return address;
};

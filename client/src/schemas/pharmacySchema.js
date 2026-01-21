import * as yup from "yup";

export const pharmacySchema = yup.object().shape({
  pharmacy_name: yup
    .string()
    .required("Pharmacy Name is required")
    .min(3, "Pharmacy Name must be at least 3 characters"),
  license_no: yup
    .string()
    .required("License Number is required")
    .min(5, "License Number must be valid"),
  contact_no: yup
    .string()
    .required("Contact Number is required")
    .matches(/^[0-9]{10}$/, "Contact Number must be exactly 10 digits"),
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),
  city: yup.string().required("City is required"),
  pincode: yup
    .string()
    .required("Pincode is required")
    .matches(/^[0-9]{6}$/, "Pincode must be exactly 6 digits"),
});

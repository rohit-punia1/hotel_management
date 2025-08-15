"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaUser, FaBed } from "react-icons/fa";
import useDebounce from "@/hooks/useDebounce";
import useSWR from "swr";
import { getDestinations } from "@/lib/DestinationApis";
import DestinationAutocomplete from "@/components/common/Autocomplete";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";

export default function SearchForm() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const debouncedDestination = useDebounce(destination, 1000);

  const { data: destinations = [] } = useSWR(
    ["/destinations", debouncedDestination],
    () => getDestinations(debouncedDestination),
    { revalidateOnFocus: false, dedupingInterval: Infinity }
  );

  const initialValues = {
    destination: "",
    fromDate: "",
    toDate: "",
    rooms: 1,
    adults: 2,
    children: 0,
    childrenAges: [],
  };

  const validationSchema = Yup.object().shape({
    destination: Yup.object().required("Destination is required"),
    fromDate: Yup.date().required("From date is required"),
    toDate: Yup.date()
      .required("To date is required")
      .min(Yup.ref("fromDate"), "To date cannot be before From date"),
    rooms: Yup.number().min(1, "At least 1 room is required").required(),
    adults: Yup.number().min(1, "At least 1 adult is required").required(),
    children: Yup.number().min(0).required(),
    childrenAges: Yup.array().of(
      Yup.number()
        .min(0, "Age must be 0 or more")
        .max(17, "Age must be 17 or less")
        .required("Required")
    ),
  });

  const handleSearch = (values) => {
  const query = new URLSearchParams({
    destination: selectedDestination?.name,
    destinationId: selectedDestination?.id,
    fromDate: values.fromDate,
    toDate: values.toDate,
    rooms: values.rooms.toString(),
    adults: values.adults.toString(),
    children: values.children.toString(),
    childrenAges: JSON.stringify(values.childrenAges),
  }).toString();

  const newUrl = `/results?${query}`;
  
  if (window.location.pathname + window.location.search === newUrl) {
    // Same route, force reload
    window.location.reload();
  } else {
    // Different route, navigate normally
    router.push(newUrl);
  }
};


  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSearch}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form className="bg-white rounded-xl shadow-lg p-5 grid gap-4 md:grid-cols-3 lg:grid-cols-4 border border-gray-100">
          
          {/* Destination Autocomplete */}
          <div className="md:col-span-2 relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">Destination</label>
            <DestinationAutocomplete
              value={destination}
              onInputChange={setDestination}
              options={destinations?.data?.data || []}
              label="Destination"
              onChange={(val) => {
                setSelectedDestination(val);
                setFieldValue("destination", val);
              }}
            />
            {errors.destination && touched.destination && (
              <div className="text-red-500 text-xs mt-1 absolute">{errors.destination}</div>
            )}
          </div>

          {/* From Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">From</label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <Field
                type="date"
                name="fromDate"
                className="bg-transparent py-2 outline-none text-sm w-full"
                min={today}
              />
            </div>
            {errors.fromDate && touched.fromDate && (
              <div className="text-red-500 text-xs mt-1 absolute">{errors.fromDate}</div>
            )}
          </div>

          {/* To Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">To</label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <Field
                type="date"
                name="toDate"
                min={values.fromDate || today}
                className="bg-transparent py-2 outline-none text-sm w-full"
              />
            </div>
            {errors.toDate && touched.toDate && (
              <div className="text-red-500 text-xs mt-1 absolute">{errors.toDate}</div>
            )}
          </div>

          {/* Adults */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">Adults</label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2">
              <FaUser className="text-gray-400 mr-2" />
              <Field
                type="number"
                name="adults"
                min="1"
                className="w-16 bg-transparent py-2 outline-none text-sm"
              />
            </div>
            {errors.adults && touched.adults && (
              <div className="text-red-500 text-xs mt-1 absolute">{errors.adults}</div>
            )}
          </div>

          {/* Children */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">Children</label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2">
              <FaUser className="text-gray-400 mr-2" />
              <Field
                type="number"
                name="children"
                min="0"
                className=" bg-transparent py-2 outline-none text-sm"
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setFieldValue("children", val);
                  const ages = [...values.childrenAges];
                  if (val > ages.length) {
                    for (let i = ages.length; i < val; i++) ages.push("");
                  } else {
                    ages.length = val;
                  }
                  setFieldValue("childrenAges", ages);
                }}
              />
            </div>
            {errors.children && touched.children && (
              <div className="text-red-500 text-xs mt-1 absolute top-2">{errors.children}</div>
            )}
          </div>

          {/* Children Ages */}
          {values.children > 0 && (
            <FieldArray name="childrenAges">
              {() => (
                <div className="md:col-span-3 lg:col-span-4 w-full">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Children Ages
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {values.childrenAges.map((age, idx) => (
                      <div key={idx} className="relative">
                        <Field
                          type="number"
                          min="0"
                          max="17"
                          placeholder={`Age ${idx + 1}`}
                          name={`childrenAges.${idx}`}
                          className="w-full border border-gray-200 rounded-lg p-2 outline-none text-sm"
                        />
                        {errors.childrenAges?.[idx] && touched.childrenAges?.[idx] && (
                          <div className="text-red-500 text-xs mt-1 absolute">{errors.childrenAges[idx]}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </FieldArray>
          )}

          {/* Rooms */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">Rooms</label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2">
              <FaBed className="text-gray-400 mr-2" />
              <Field
                type="number"
                name="rooms"
                min="1"
                className="w-16 bg-transparent py-2 outline-none text-sm"
              />
            </div>
            {errors.rooms && touched.rooms && (
              <div className="text-red-500 text-xs mt-1">{errors.rooms}</div>
            )}
          </div>

          {/* Search Button */}
          <div className="md:col-span-3 lg:col-span-4">
            <button
              type="submit"
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm shadow-sm"
            >
              Search
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

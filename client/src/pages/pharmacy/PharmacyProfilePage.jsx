import React, { useEffect, useState } from "react";
import Container from "../../components/utils/Container";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "../../redux/slices/authSlice";
import {
    selectPharmacyProfile,
    setPharmacyProfile,
} from "../../redux/slices/pharmacySlice";
import { User, Mail, MapPin, Store, Phone, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { pharmacySchema } from "../../schemas/pharmacySchema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "../../utils/instance";
import message from "../../utils/message";

const PharmacyProfilePage = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const pharmacyProfile = useSelector(selectPharmacyProfile);
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(pharmacySchema),
        mode: "onChange", // Enable real-time validation
    });

    // Fetch Pharmacy Profile via /users/me
    const {
        data: profileData,
        isLoading,
        // isError,
    } = useQuery({
        queryKey: ["pharmacyProfile"],
        queryFn: async () => {
            const response = await instance.get("/users/me");
            const profile = response.data?.user || null;
            // Update Redux store with fetched profile
            dispatch(setPharmacyProfile(profile));
            return profile;
        },
    });

    // Populate form when data is loaded from Redux or query
    useEffect(() => {
        const profile = pharmacyProfile || profileData;
        if (profile) {
            setValue("pharmacy_name", profile.pharmacy_name || "");
            setValue("license_no", profile.license_no || "");
            setValue("contact_no", profile.contact_no || "");
            setValue("address", profile.address || "");
            setValue("city", profile.city || "");
            setValue("pincode", profile.pincode || "");
        }
    }, [pharmacyProfile, profileData, setValue]);

    // Mutation to Upsert Profile
    const mutation = useMutation({
        mutationFn: async (data) => {
            // Upsert Endpoint
            return await instance.post("/pharmacies", {
                ...data,
                user_id: user?.id, // Ensure user_id is sent
            });
        },
        onSuccess: (response) => {
            // Use backend message from response
            message.success(response?.message || "Profile saved successfully!");
            setIsEditing(false);
            // Invalidate query to refetch and update Redux
            queryClient.invalidateQueries(["pharmacyProfile"]);
        },
        onError: (error) => {
            console.error(error);
            const errorMsg = error?.response?.data?.message || "Failed to save profile";
            message.error(errorMsg);
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    /**
     * Helper to restrict input to numbers only
     */
    const handleNumericInput = (e, maxLength) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
        if (e.target.value.length > maxLength) {
            e.target.value = e.target.value.slice(0, maxLength);
        }
    };

    if (isLoading) {
        return (
            <Container>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                </div>
            </Container>
        );
    }

    // Use Redux profile as primary source, fallback to query data
    const currentProfile = pharmacyProfile || profileData;
    const hasProfile = !!currentProfile;

    // Determine if we should show the form (Edit mode or No Profile) or View mode
    const showForm = isEditing || !hasProfile;





    return (
        <Container>
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Banner */}
                <div className="bg-teal-600 h-32 relative">
                    {hasProfile && !isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition text-sm font-medium"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="px-8 pb-8">
                    {/* Avatar / Icon */}
                    <div className="relative -mt-16 mb-6">
                        <div className="h-32 w-32 bg-white rounded-full p-2 inline-block shadow-md">
                            <div className="h-full w-full bg-teal-50 rounded-full flex items-center justify-center text-4xl font-bold text-teal-700 border-2 border-teal-100">
                                {user?.email?.[0]?.toUpperCase() || <Store />}
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            {hasProfile ? currentProfile.pharmacy_name : "Complete Your Profile"}
                        </h1>
                        <p className="text-gray-500 flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4" /> {user?.email}
                        </p>
                    </div>

                    {showForm ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Pharmacy Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pharmacy Name
                                    </label>
                                    <div className="relative">
                                        <Store className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            className={`pl-10 w-full rounded-lg border ${errors.pharmacy_name
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-teal-500"
                                                } focus:border-teal-500 focus:ring-1 p-2.5 outline-none transition`}
                                            placeholder="Sanjivani Medico"
                                            {...register("pharmacy_name")}
                                        />
                                    </div>
                                    {errors.pharmacy_name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.pharmacy_name.message}
                                        </p>
                                    )}
                                </div>

                                {/* License No */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        License Number
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            className={`pl-10 w-full rounded-lg border ${errors.license_no
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-teal-500"
                                                } focus:border-teal-500 focus:ring-1 p-2.5 outline-none transition`}
                                            placeholder="MH-123456"
                                            {...register("license_no")}
                                        />
                                    </div>
                                    {errors.license_no && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.license_no.message}
                                        </p>
                                    )}
                                </div>

                                {/* Contact No */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            className={`pl-10 w-full rounded-lg border ${errors.contact_no
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-teal-500"
                                                } focus:border-teal-500 focus:ring-1 p-2.5 outline-none transition`}
                                            placeholder="9876543210"
                                            maxLength={10}
                                            onInput={(e) => handleNumericInput(e, 10)}
                                            {...register("contact_no")}
                                        />
                                    </div>
                                    {errors.contact_no && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.contact_no.message}
                                        </p>
                                    )}
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            className={`pl-10 w-full rounded-lg border ${errors.city
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-teal-500"
                                                } focus:border-teal-500 focus:ring-1 p-2.5 outline-none transition`}
                                            placeholder="Kopargaon"
                                            {...register("city")}
                                        />
                                    </div>
                                    {errors.city && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.city.message}
                                        </p>
                                    )}
                                </div>

                                {/* Pincode */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pincode
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            className={`pl-10 w-full rounded-lg border ${errors.pincode
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-teal-500"
                                                } focus:border-teal-500 focus:ring-1 p-2.5 outline-none transition`}
                                            placeholder="423601"
                                            maxLength={6}
                                            onInput={(e) => handleNumericInput(e, 6)}
                                            {...register("pincode")}
                                        />
                                    </div>
                                    {errors.pincode && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.pincode.message}
                                        </p>
                                    )}
                                </div>

                                {/* Address (Full Width) */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address
                                    </label>
                                    <textarea
                                        rows="3"
                                        className={`w-full rounded-lg border ${errors.address
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-teal-500"
                                            } focus:border-teal-500 focus:ring-1 p-2.5 outline-none transition`}
                                        placeholder="Shop No. 1, Main Market..."
                                        {...register("address")}
                                    ></textarea>
                                    {errors.address && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.address.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                {hasProfile && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            // Reset to original profile data from Redux
                                            const profile = pharmacyProfile || profileData;
                                            reset({
                                                pharmacy_name: profile?.pharmacy_name || "",
                                                license_no: profile?.license_no || "",
                                                contact_no: profile?.contact_no || "",
                                                address: profile?.address || "",
                                                city: profile?.city || "",
                                                pincode: profile?.pincode || "",
                                            });
                                        }}
                                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium shadow-sm flex items-center gap-2"
                                >
                                    {mutation.isPending ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Profile"
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        // View Mode
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">
                                        License Number
                                    </label>
                                    <div className="font-medium text-gray-900 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-teal-600" />
                                        {currentProfile.license_no}
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">
                                        Contact Number
                                    </label>
                                    <div className="font-medium text-gray-900 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-teal-600" />
                                        {currentProfile.contact_no}
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 md:col-span-2">
                                    <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">
                                        Address
                                    </label>
                                    <div className="font-medium text-gray-900 flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-teal-600 mt-1 shrink-0" />
                                        <div>
                                            {currentProfile.address}, {currentProfile.city} -{" "}
                                            {currentProfile.pincode}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default PharmacyProfilePage;

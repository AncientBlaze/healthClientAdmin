import { create } from "zustand";
import toast, { Toaster } from 'react-hot-toast';
import axios from "../utils/axios";

const useUserStore = create((set, get) => ({
    user: null,
    transactions: null,

    login: async (userDetails) => {
        try {
            const res = await axios.post('/api/users/login', {
                phone: userDetails.number,
                password: userDetails.password
            });
            if (res.data.status === 200) {
                set({ user: res.data.user });
                toast.success(res.data.message);
                return res.data.user;
            }
            toast.error(res.data.message);
            return false;
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
            return false;
        }
    },

    signup: async (id, userDetails) => {
        console.log(userDetails);
        try {
            const res = await axios.put(`/api/users/register/${id}`, {
                name: userDetails.name,
                gender: userDetails.gender,
                dateOfBirth: userDetails.dateOfBirth,
                password: userDetails.password,
                profilePicture: userDetails.profilePicture
            });
            
            toast.success(res.data.message);
            return true;
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
            return false;
        }
    },

    sendOTP: async (phoneNumber) => {
        try {
            const res = await axios.post(`/api/users/sendOTP`, { phone: phoneNumber });
            toast.success(res.data.message);
            set({ user: res.data.User });
            return res.data.User;
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
            return false;
        }
    },

    verifyOTP: async (id, otp) => {
        try {
            const res = await axios.post(`/api/users/verifyOTP/${id}`, { OTP: otp });
            console.log(res);
            toast.success(res.data.message);
            set({ user: res.data.User });
            return true;
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
            return false;
        }
    },

    transactionsById: async (id) => {
        try {
            const transactionsCollected = await axios.post(`/api/transaction/getTransactionByID/${id}`);
            set({ transactions: transactionsCollected.data.data });
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    },

    fetchUserByID: async (id) => {
        console.log('id : ', id);
        try {
            const userDetails = await axios.post(`/api/users/getUserByID/${id}`);
            console.log(userDetails);
            set({ user: userDetails.data.user });
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    },

    setUpdatedProfileImage: async (image) => {
        try {
            const response = await axios.put(`/api/users/updateProfileImage/${get().user._id}`, { profilePicture: image });
            set({ user: response.data.user });
            toast.success(response.data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    },

    forgatePass: async (phoneNumber) => {
        try {
            const res = await axios.put('/api/users/forgotPassword', {
                phone: phoneNumber
            });
            toast.success(res.data.message);
            return res.data;
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    },

    verifyOTPForPassword: async (id, otp, password) => {
        try {
            const res = await axios.put(`/api/users/forgotPasswordOTP/${id}`, {
                otp: otp,
                password: password
            });
            toast.success(res.data.message);
            return true;
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
}));

export default useUserStore;
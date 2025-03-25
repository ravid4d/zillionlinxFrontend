import React, { useState } from 'react';
import Textfield from '../Textfield';
import { useFormik } from 'formik';
import * as YUP from "yup";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogin } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import PasswordField from '../PasswordField';

const AdminLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
   
    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: YUP.object({
            email: YUP.string().email('Invalid email format').required("Email is required"),
            password: YUP.string()
                .required("Password is required"),
        }),
        onSubmit: async(values) => {
            let loginType="admin";
            try {
                const result = await dispatch(handleLogin({ values, loginType })).unwrap();
                formik.resetForm();
                toast.success(result.message || "Login successfully!");
                navigate('/admin');
            } catch (error) {
                console.error("Login Error:", error);
                toast.error(error.message || "Login failed!");
            }
        }
    });
  return (
        <div className="flex flex-col rounded-[30px] pointer-events-auto w-full relative h-screen flex-wrap items-center justify-center">
            <div className='w-full py-20 px-10'>
                <div className="flex justify-between items-center">
                    <h3 id="hs-slide-down-animation-modal-label" className="uppercase text-dark-blue text-center w-full text-7xl mb-12">
                        Login
                    </h3>
                </div>
                <div className="max-w-[400px] mx-auto">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-5">
                            <Textfield id="email" name="email" label="Email" type="email" placeholder="Enter email" iconPlacement="left" fieldValue={formik.values.email} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                            ) : null}
                        </div>
                        <div className="mb-5">
                            <PasswordField id="password" setShowPassword={setShowPassword} showPassword={showPassword} name="password" label="Password" type="password" placeholder="" iconPlacement="right" fieldValue={formik.values.password} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} />
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                            ) : null}
                        </div>
                        <button disabled={loading} type="submit" className={`btn dark-btn w-full justify-center h-12 ${loading ? 'disabled:bg-light-blue disabled:text-dark-blue disabled:pointer-events-none' : ''}`}>login</button>
                    </form>
                </div>
            </div>
        </div>
  )
}

export default AdminLogin

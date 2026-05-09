import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom"
import Textbox from "../components/Textbox"
import Button from "../components/Button"
import { useSelector } from "react-redux"
import { useRegisterMutation } from "../redux/slices/api/authApiSlice"
import { toast } from "sonner"

import Loading from "../components/Loader"

const ROLES = ["Developer", "Designer", "Manager", "Admin"]

const Signup = () => {
    const { user } = useSelector((state) => state.auth)
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: {
            isAdmin: false,
        },
    })

    const navigate = useNavigate()
    const [registerUser, { isLoading }] = useRegisterMutation()

    const password = watch("password")

    const submitHandler = async (data) => {
        try {
            await registerUser({
                name: data.name,
                email: data.email,
                password: data.password,
                title: data.title,
                role: data.role,
                isAdmin: false,
            }).unwrap()

            toast.success("Account created successfully! Please login.")
            navigate("/log-in")
        } catch (error) {
            console.log(error)
            toast.error(error?.data?.message || error.message || "An error occurred during signup")
        }
    }

    useEffect(() => {
        user && navigate("/dashboard")
    }, [user])

    return (
        <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
            <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
                {/* left side */}
                <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
                    <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
                        <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-300 text-gray-600">
                            Join our team and manage tasks efficiently!
                        </span>
                        <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700">
                            <span>Create Your</span>
                            <span>Account</span>
                        </p>

                        <div className="cell">
                            <div className="circle rotate-in-up-left"></div>
                        </div>
                    </div>
                </div>

                {/* right side */}
                <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
                    <form
                        onSubmit={handleSubmit(submitHandler)}
                        className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14"
                    >
                        <div className="">
                            <p className="text-blue-600 text-3xl font-bold text-center">
                                Welcome!
                            </p>
                            <p className="text-center text-base text-gray-700 ">
                                Create your account to get started.
                            </p>
                        </div>

                        <div className="flex flex-col gap-y-5">
                            <Textbox
                                placeholder="John Doe"
                                type="text"
                                name="name"
                                label="Full Name"
                                className="w-full rounded-full"
                                register={register("name", {
                                    required: "Full Name is required!",
                                })}
                                error={errors.name ? errors.name.message : ""}
                            />

                            <Textbox
                                placeholder="email@example.com"
                                type="email"
                                name="email"
                                label="Email Address"
                                className="w-full rounded-full"
                                register={register("email", {
                                    required: "Email Address is required!",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Invalid email format",
                                    },
                                })}
                                error={errors.email ? errors.email.message : ""}
                            />

                            <Textbox
                                placeholder="Senior Developer"
                                type="text"
                                name="title"
                                label="Job Title"
                                className="w-full rounded-full"
                                register={register("title", {
                                    required: "Job Title is required!",
                                })}
                                error={errors.title ? errors.title.message : ""}
                            />

                            <div className="w-full">
                                <label className="block text-sm font-semibold text-gray-600 mb-2">
                                    Role
                                </label>
                                <select
                                    {...register("role", {
                                        required: "Role is required!",
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">Select a role</option>
                                    {ROLES.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                                {errors.role && (
                                    <span className="text-red-500 text-sm">
                                        {errors.role.message}
                                    </span>
                                )}
                            </div>

                            <Textbox
                                placeholder="your password"
                                type="password"
                                name="password"
                                label="Password"
                                className="w-full rounded-full"
                                register={register("password", {
                                    required: "Password is required!",
                                    minLength: {
                                        value: 6,
                                        message:
                                            "Password must be at least 6 characters",
                                    },
                                })}
                                error={
                                    errors.password
                                        ? errors.password.message
                                        : ""
                                }
                            />

                            <Textbox
                                placeholder="confirm password"
                                type="password"
                                name="confirmPassword"
                                label="Confirm Password"
                                className="w-full rounded-full"
                                register={register("confirmPassword", {
                                    required: "Please confirm your password!",
                                    validate: (value) =>
                                        value === password ||
                                        "Passwords do not match",
                                })}
                                error={
                                    errors.confirmPassword
                                        ? errors.confirmPassword.message
                                        : ""
                                }
                            />
                        </div>

                        {isLoading ? (
                            <Loading />
                        ) : (
                            <Button
                                type="submit"
                                label="Sign Up"
                                className="w-full h-10 bg-blue-700 text-white rounded-full"
                            />
                        )}

                        <div className="text-center">
                            <p className="text-gray-600">
                                Already have an account?{" "}
                                <Link
                                    to="/log-in"
                                    className="text-blue-600 font-semibold hover:underline"
                                >
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup

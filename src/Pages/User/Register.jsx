import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { userLogin } from "../../userSlice";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState("");
    const [next, setNext] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                `https://aresuno-server.vercel.app/api/${role}/register`,
                formData
            );

            console.log(res.data);
            const token = res.data.token
            localStorage.setItem("token", token)
            toast.success("success")
            if (role === 'user') {
                navigate("/user/dashboard");
            } else {
                navigate("/business/register");
            }
        } catch (err) {
            setErrors(err.response.data);
            toast.error("User Registration Failed");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            {!next &&

                <div className="flex flex-col">
                    <div className="mb-4">
                        <div className="flex items-center mb-4">
                            <input
                                type="radio"
                                id="client"
                                name="role"
                                value="user"
                                checked={role === "user"}
                                onChange={(e) => setRole(e.target.value)}
                                className="mr-2"
                            />
                            <label htmlFor="client" className="text-lg">
                                I'm a User
                            </label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center mb-4">
                            <input
                                type="radio"
                                id="vendor"
                                name="role"
                                value="vendor"
                                checked={role === "vendor"}
                                onChange={(e) => setRole(e.target.value)}
                                className="mr-2"
                            />
                            <label htmlFor="vendor" className="text-lg">
                                I'm a vendor
                            </label>
                        </div>
                    </div>
                    <div>
                        <button
                            disabled={!role}
                            onClick={() => { setNext(true); console.log(role) }}
                            className={`bg-gray-400 group flex justify-center items-center py-2 px-4 text-white font-medium rounded-md text-base`}
                        >
                            {
                                !role ?
                                    "Please Select"

                                    : (
                                        <div className="flex items-center">
                                            Continue as {role}
                                            <img
                                                src="/assets/images/arrow-right.svg"
                                                alt=""
                                                className="h-4 w-4 mr-2 "
                                            />
                                        </div>
                                    )
                            }
                        </button>
                    </div>
                </div>


            }

            {next &&
                <section className="w-full max-w-md">
                    <div className={` login w-full`}>
                        <div className="shadow-lg w-full p-8 bg-white rounded-xl">
                            <div>
                                <button
                                    onClick={() => { setNext(!next); console.log(role) }}
                                    className=""
                                >
                                    <img
                                        src="/assets/images/arrow-left-dark.svg"
                                        alt=""
                                        className="h-5 w-5"
                                    />
                                </button>
                            </div>
                            <p className="text-3xl font-bold mb-6 text-center text-blue-500">
                                Aresuno
                            </p>

                            <h2 className="text-2xl font-bold mb-4 text-center">Get Started as {role}</h2>
                            <form onSubmit={handleSubmit} className="w-full max-w-md">




                                <div className="field input-field mb-4 relative">
                                    <input
                                        className={`${errors.name ? "border-red-500" : ""
                                            }  rounded-lg input border border-gray-300 w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500`}
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Name"
                                    />
                                    <img
                                        src="./assets/images/user.svg"
                                        alt="mail"
                                        className="bx bx-hide eye-icon absolute top-1/2 transform -translate-y-1/2 right-0 mr-4 text-sm cursor-pointer text-gray-600 w-5 h-5"
                                    ></img>
                                    {errors.name && (
                                        <p className="text-red-500 text-xs italic">{errors.name}</p>
                                    )}
                                </div>

                                <div className="field input-field mb-4 relative">
                                    <input
                                        className={`${errors.email ? "border-red-500" : ""
                                            }  rounded-lg input border border-gray-300 w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500`}
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs italic">{errors.email}</p>
                                    )}
                                    <img
                                        src="./assets/images/mail.svg"
                                        alt="mail"
                                        className="bx bx-hide eye-icon absolute top-1/2 transform -translate-y-1/2 right-0 mr-4 text-sm cursor-pointer text-gray-600 w-5 h-5"
                                    ></img>
                                </div>

                                <div className="field input-field mb-4 relative">
                                    <input
                                        className={`${errors.password ? "border-red-500" : ""
                                            }  rounded-lg input border border-gray-300 w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500`}
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                    />
                                    <img
                                        src={
                                            !showPassword
                                                ? "./assets/images/eye-off.svg"
                                                : "./assets/images/eye.svg"
                                        }
                                        alt="eye"
                                        className="bx bx-hide eye-icon absolute top-1/2 transform -translate-y-1/2 right-0 mr-4 text-sm cursor-pointer text-gray-600 w-5 h-5"
                                        onClick={() => setShowPassword(!showPassword)}
                                    ></img>
                                    {errors.password && (
                                        <p className="text-red-500 text-xs italic">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="field button-field">
                                    <button
                                        className=" bg-blue-700 text-white font-bold w-full py-3  px-4 rounded-lg focus:outline-none"
                                        type="submit"
                                    >
                                        {isLoading ? "Loading..." : "Register"}
                                    </button>
                                </div>
                            </form>

                            <div className="form-link text-center mt-4">
                                <span>
                                    Already have an account?{" "}

                                    <Link to="/login" className="link text-blue-500 underline">
                                        Login
                                    </Link>
                                </span>
                            </div>

                            <div className="line h-[1.4px] w-full mt-9 mb-9 bg-gray-300 relative">
                                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-gray-400 text-sm font-light">
                                    Or
                                </span>
                            </div>

                            <div className="media-options mb-4">
                                <a
                                    href="#"
                                    className="field facebook w-full flex items-center justify-center text-white  bg-[#1877F2] py-2 px-4 rounded focus:outline-none"
                                >
                                    <img
                                        src="./assets/images/facebook.svg"
                                        alt=""
                                        className="bx bxl-facebook facebook-icon text-blue-500 rounded-full flex items-center justify-center w-8 h-8 mr-2"
                                    ></img>
                                    <span>Signpu with Facebook</span>
                                </a>
                            </div>

                            <div className="media-options">
                                <a
                                    href="#"
                                    className="field google w-full flex items-center justify-center border border-gray-300 py-2 px-4 rounded focus:outline-none"
                                >
                                    <img
                                        src="./assets/images/google.svg"
                                        alt=""
                                        className="google-img h-8 w-8 object-cover mr-2"
                                    />
                                    <span>Signup with Google</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <ToastContainer />


                </section>
            }
        </div>
    );
};

export default Register;

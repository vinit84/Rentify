import React, { useState } from "react";
import firebase from "../firebase/firebaseconfig";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { getDatabase, ref, get } from "firebase/database";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    let errors = { email: "", password: "" };

    if (!email) {
      errors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
      valid = false;
    }

    if (!password) {
      errors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await signInWithEmailAndPassword(
        firebase.auth(),
        email,
        password
      );
      if (response.user) {
        const db = getDatabase();
        const roleRef = ref(db, `users/${response.user.uid}/role`);
        const roleSnapshot = await get(roleRef);
        const userRole = roleSnapshot.val();

        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        if (userRole === "buyer") {
          navigate("/");
        } else if (userRole === "seller") {
          navigate("/seller");
        }
      }
    } catch (error) {
      console.error("Login error", error);
      toast.error("User doesn't exist. Please get registered first.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col justify-center py-10 sm:px-6 lg:px-8 font-['Gilroy'] bg-[#f1f1f1] h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-md border-[#27272a] ">
          <div className="pb-5">
            <h2 className=" text-center text-3xl font-extrabold text-emerald-500">
              Sign in to your account
            </h2>
            <div className="mt-3 space-y-2 justify-center flex items-center">
              <p className="font-medium">
                Don't have an account? Simply{" "}
                <Link to="/register" className="text-emerald-500">
                  Register
                </Link>{" "}
                on a single click.
              </p>
            </div>
          </div>
          <div className="bg-white py-10 px-4 sm:rounded-2xl sm:px-10 border-[1px] border-white rounded-2xl shadow-lg">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 text-black"
              action="#"
              method="POST"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm Gilroy-SemiBold"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm Gilroy-SemiBold"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-x-3">
                  <input
                    type="checkbox"
                    id="remember-me-checkbox"
                    className="checkbox-item peer hidden"
                  />
                  <label
                    htmlFor="remember-me-checkbox"
                    className="relative flex w-5 h-5 bg-white peer-checked:bg-emerald-600 rounded-md border ring-offset-2 ring-emerald-600 duration-150 peer-active:ring cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
                  ></label>
                  <span>Remember me</span>
                </div>
                <a
                  href="javascript:void(0)"
                  className="text-center text-emerald-600 hover:text-emerald-500 font-semibold "
                >
                  Forgot password?
                </a>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

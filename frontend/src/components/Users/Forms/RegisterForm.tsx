import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, ErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../../redux/api/auth";
import { setCredentials } from "../../../redux/features/auth/authSlice";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import LoadingComponent from "../../LoadingComp/LoadingComponent";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const { userInfo } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo?.role === "admin") {
      navigate("/admin");
    } else if (userInfo?.role === "customer") {
      navigate("/customer-profile");
    }
  }, [userInfo, navigate]);

  //---Destructuring---
  const { name, email, password } = formData;
  //---onchange handler----
  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  //---onsubmit handler----
  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await register(formData).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Successfully registered");
      navigate("/");
    } catch (error) {
      const err = error as ErrorResponse;
      console.log(err);
      toast.error(err.data.message);
    }
  };
  return (
    <>
      <section className="relative overflow-x-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="w-full px-4 mb-12 lg:w-2/6 lg:mb-0">
              <div className="py-20 text-center">
                <h3 className="mb-8 text-4xl font-bold md:text-5xl font-heading">
                  Signing up with social is super quick
                </h3>
                <p className="mb-10">Please, do not hesitate</p>
                <form onSubmit={onSubmitHandler}>
                  <input
                    name="name"
                    value={name}
                    onChange={onChangeHandler}
                    className="w-full px-12 py-6 mb-4 border border-gray-200 rounded-md focus:ring-blue-300 focus:border-blue-300"
                    type="text"
                    placeholder="Full Name"
                  />
                  <input
                    name="email"
                    value={email}
                    onChange={onChangeHandler}
                    className="w-full px-12 py-6 mb-4 border border-gray-200 rounded-md focus:ring-blue-300 focus:border-blue-300"
                    type="text"
                    placeholder="Enter your email"
                  />
                  <input
                    name="password"
                    value={password}
                    onChange={onChangeHandler}
                    className="w-full px-12 py-6 mb-4 border border-gray-200 rounded-md focus:ring-blue-300 focus:border-blue-300"
                    type="password"
                    placeholder="Enter your password"
                  />
                  <button
                    // disable the button if loading is true
                    disabled={isLoading}
                    className="px-8 py-5 mt-12 font-bold text-white uppercase bg-blue-800 rounded-md md:mt-16 hover:bg-blue-900 font-heading"
                  >
                    {isLoading ? <LoadingComponent /> : "Register"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          className="top-0 bottom-0 right-0 hidden bg-center bg-no-repeat bg-cover lg:block lg:absolute lg:w-3/6"
          style={{
            backgroundImage:
              'url("https://cdn.pixabay.com/photo/2017/03/29/04/47/high-heels-2184095_1280.jpg")',
          }}
        />
      </section>
    </>
  );
};

export default RegisterForm;

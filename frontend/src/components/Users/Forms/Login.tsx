import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useLoginMutation } from "../../../redux/api/auth";
import { setCredentials } from "../../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ErrorResponse } from "../../../utils/types";
import LoadingComponent from "../../LoadingComp/LoadingComponent";

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "jnienow@example.org",
    password: "password",
  });
  const { userInfo } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo?.role === "admin") {
      navigate("/admin");
    } else if (userInfo?.role === "customer") {
      navigate("/customer-profile");
    }
  }, [userInfo, navigate]);

  //---Destructuring---
  const { email, password } = formData;
  //---onchange handler----
  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //---onsubmit handler----
  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await login(formData).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Successfully logged in");
      navigate("/");
    } catch (error) {
      const err = error as ErrorResponse;
      console.log(err);
      toast.error(err.data.message);
    }
  };

  return (
    <>
      <section className="py-20 overflow-x-hidden bg-gray-100">
        <div className="container relative px-4 mx-auto">
          <div className="absolute inset-0 my-24 -ml-4 bg-blue-200" />
          <div className="relative flex flex-wrap bg-white">
            <div className="w-full px-4 md:w-4/6">
              <div className="px-4 py-20 mx-auto lg:max-w-3xl md:px-10 lg:px-20">
                <h3 className="mb-8 text-4xl font-bold md:text-5xl font-heading">
                  Login to your account
                </h3>
                <p className="mb-10 font-semibold font-heading">
                  Happy to see you again
                </p>
                <form
                  className="flex flex-wrap -mx-4"
                  onSubmit={onSubmitHandler}
                >
                  <div className="w-full px-4 mb-8 md:w-1/2 md:mb-12">
                    <label>
                      <h4 className="mb-5 font-bold text-gray-400 uppercase font-heading">
                        Your Email
                      </h4>
                      <input
                        name="email"
                        value={email}
                        onChange={onChangeHandler}
                        className="w-full p-5 border border-gray-200 rounded-md focus:ring-blue-300 focus:border-blue-300"
                        type="text"
                      />
                    </label>
                  </div>
                  <div className="w-full px-4 mb-12 md:w-1/2">
                    <label>
                      <h4 className="mb-5 font-bold text-gray-400 uppercase font-heading">
                        Password
                      </h4>
                      <input
                        name="password"
                        value={password}
                        onChange={onChangeHandler}
                        className="w-full p-5 border border-gray-200 rounded-md focus:ring-blue-300 focus:border-blue-300"
                        type="password"
                        // minLength={6}
                      />
                    </label>
                  </div>

                  <div className="w-full px-4">
                    <button
                      className="px-8 py-5 font-bold text-white uppercase bg-blue-800 rounded-md hover:bg-blue-900 font-heading"
                      disabled={isLoading}
                    >
                      {isLoading ? <LoadingComponent /> : "Login"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div
              className="flex items-center w-full px-4 pb-20 bg-no-repeat bg-cover md:w-2/6 h-128 md:h-auto lg:items-end"
              style={{
                backgroundImage:
                  'url("https://cdn.pixabay.com/photo/2017/03/29/04/47/high-heels-2184095_1280.jpg")',
              }}
            ></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;

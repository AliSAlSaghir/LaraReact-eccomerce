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
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
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
      <section className="py-20 bg-gray-100 overflow-x-hidden">
        <div className="relative container px-4 mx-auto">
          <div className="absolute inset-0 bg-blue-200 my-24 -ml-4" />
          <div className="relative flex flex-wrap bg-white">
            <div className="w-full md:w-4/6 px-4">
              <div className="lg:max-w-3xl mx-auto py-20 px-4 md:px-10 lg:px-20">
                <h3 className="mb-8 text-4xl md:text-5xl font-bold font-heading">
                  Login to your account
                </h3>
                <p className="mb-10 font-semibold font-heading">
                  Happy to see you again
                </p>
                <form
                  className="flex flex-wrap -mx-4"
                  onSubmit={onSubmitHandler}
                >
                  <div className="w-full md:w-1/2 px-4 mb-8 md:mb-12">
                    <label>
                      <h4 className="mb-5 text-gray-400 uppercase font-bold font-heading">
                        Your Email
                      </h4>
                      <input
                        name="email"
                        value={email}
                        onChange={onChangeHandler}
                        className="p-5 w-full border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                        type="text"
                      />
                    </label>
                  </div>
                  <div className="w-full md:w-1/2 px-4 mb-12">
                    <label>
                      <h4 className="mb-5 text-gray-400 uppercase font-bold font-heading">
                        Password
                      </h4>
                      <input
                        name="password"
                        value={password}
                        onChange={onChangeHandler}
                        className="p-5 w-full border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                        type="password"
                        // minLength={6}
                      />
                    </label>
                  </div>

                  <div className="w-full px-4">
                    <button
                      className="bg-blue-800 hover:bg-blue-900 text-white font-bold font-heading py-5 px-8 rounded-md uppercase"
                      disabled={isLoading}
                    >
                      {isLoading ? <LoadingComponent /> : "Login"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div
              className="w-full md:w-2/6 h-128 md:h-auto flex items-center lg:items-end px-4 pb-20 bg-cover bg-no-repeat"
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

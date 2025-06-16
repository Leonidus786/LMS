import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { setUser, setToken } from "@/features/authSlice";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Login = () => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "signup" ? "signup" : "login";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [signupErrors, setSignupErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
      isError: registerIsError,
    },
  ] = useRegisterUserMutation();
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
      isError: loginIsError,
    },
  ] = useLoginUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((store) => store.auth);

  const validateSignupForm = () => {
    const errors = { name: "", email: "", password: "" };
    let isValid = true;

    if (!signupInput.name || signupInput.name.length < 2) {
      errors.name = "Name must be at least 2 characters long";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(signupInput.name)) {
      errors.name = "Name can only contain letters and spaces";
      isValid = false;
    }

    if (!signupInput.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupInput.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!signupInput.password || signupInput.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    setSignupErrors(errors);
    return isValid;
  };

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
      setSignupErrors({ ...signupErrors, [name]: "" });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const handleRegistration = async (type, e) => {
    e.preventDefault();

    if (type === "signup") {
      if (!validateSignupForm()) {
        return;
      }
    }

    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    try {
      console.log(`Submitting ${type} data:`, {
        email: inputData.email,
      });
      const response = await action(inputData).unwrap();
      console.log(`${type} response:`, response);

      if (type === "signup") {
        toast.success(
          response?.message || "✅ Your account has been successfully created!"
        );
        setActiveTab("login");
        setSignupInput({ name: "", email: "", password: "" });
        setSignupErrors({ name: "", email: "", password: "" });
      } else if (type === "login") {
        const username = response?.user?.name || "User";
        toast.success(`✅ Login successful! Welcome back, ${username}!`);
        dispatch(setToken(response.token));
        dispatch(setUser(response.user));
        localStorage.setItem("token", response.token); // Fixed key to "token"
        console.log("Login.jsx: Stored token and user in Redux:", {
          token: response.token,
          user: response.user,
        });
        navigate("/"); // Removed setTimeout, let ProtectedRoutes handle redirect
      }
    } catch (error) {
      console.error(`Error during ${type}:`, error);
      const errorMessage =
        error?.data?.message ||
        (type === "signup"
          ? "🚨 Registration unsuccessful. Try again later."
          : "⚠️ Invalid credentials. Please check your email and password.");
      const newErrors = { name: "", email: "", password: "" };

      if (errorMessage.toLowerCase().includes("email")) {
        newErrors.email = errorMessage;
      } else if (errorMessage.toLowerCase().includes("password")) {
        newErrors.password = errorMessage;
      } else {
        newErrors.email = errorMessage;
      }

      setSignupErrors(newErrors);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    console.log("Login.jsx: Current authentication state", { isAuthenticated });
  }, [isAuthenticated]);

  return (
    <div className="flex items-center w-full justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          console.log("Switching to tab:", value);
          setActiveTab(value);
        }}
        className="w-[400px]"
      >
        <TabsList className="grid gap-2 w-full grid-cols-2">
          <TabsTrigger
            className="bg-[#C70039] text-white hover:bg-black"
            value="signup"
          >
            Signup
          </TabsTrigger>
          <TabsTrigger
            className="bg-[#C70039] text-white hover:bg-black"
            value="login"
          >
            Login
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signup">
          {console.log("Rendering signup tab content")}
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Create a new account and click signup when you're done.
              </CardDescription>
            </CardHeader>
            <form onSubmit={(e) => handleRegistration("signup", e)}>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={signupInput.name}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    name="name"
                    placeholder="Enter your name here."
                    required
                    disabled={registerIsLoading}
                    className={signupErrors.name ? "border-red-500" : ""}
                  />
                  {signupErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupErrors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    value={signupInput.email}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    name="email"
                    placeholder="Enter your email here."
                    required
                    disabled={registerIsLoading}
                    className={signupErrors.email ? "border-red-500" : ""}
                  />
                  {signupErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input
                    id="password-signup"
                    type="password"
                    value={signupInput.password}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    name="password"
                    placeholder="Create your password."
                    required
                    disabled={registerIsLoading}
                    className={signupErrors.password ? "border-red-500" : ""}
                  />
                  {signupErrors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupErrors.password}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-[#C70039] text-white hover:bg-black"
                  disabled={registerIsLoading}
                  type="submit"
                >
                  {registerIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      Wait
                    </>
                  ) : (
                    "Signup"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="login">
          {console.log("Rendering login tab content")}
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login with your password here. After signup, you'll be logged
                in.
              </CardDescription>
            </CardHeader>
            <form onSubmit={(e) => handleRegistration("login", e)}>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email-login">Email</Label>
                  <Input
                    id="email-login"
                    type="email"
                    value={loginInput.email}
                    onChange={(e) => changeInputHandler(e, "login")}
                    name="email"
                    placeholder="Enter your email here."
                    required
                    disabled={loginIsLoading}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password-login">Password</Label>
                  <Input
                    id="password-login"
                    type="password"
                    value={loginInput.password}
                    onChange={(e) => changeInputHandler(e, "login")}
                    name="password"
                    placeholder="Eg. xyz"
                    required
                    disabled={loginIsLoading}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-[#C70039] text-white hover:bg-black"
                  disabled={loginIsLoading}
                  type="submit"
                >
                  {loginIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      Wait
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;

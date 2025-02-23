import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner"
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { loginUser } from "@/Store/User";
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// ✅ Validation Schema
const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
    const Navigation = useNavigate();
    const [loading, setLoading] = useState(false);
    const { setUser } = useUser();
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: { email: string; password: string }) => {
        setLoading(true);
        try {
            const user = await loginUser(data);
            if (user) {
                setUser(user); // Context me user ko set karna
                localStorage.setItem("userToken", user.token);
                Navigation("/");
                toast("Login successful")
            }
        } catch (error) {
            console.error("Login failed:", error);
            toast("Invalid email or password")
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <Card className="w-full max-w-md shadow-lg p-6 rounded-lg">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Email</Label>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="example@gmail.com"
                                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => {
                                    const [showPassword, setShowPassword] = useState(false);
                                    return (
                                        <FormItem className="relative">
                                            <Label>Password</Label>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? "text" : "password"} // Toggle type
                                                        placeholder="Enter your password"
                                                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                                    >
                                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            {/* Login Button */}
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-all"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div role="status" className="flex items-center gap-2">
                                        <svg
                                            aria-hidden="true"
                                            className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"
                                            />
                                        </svg>
                                        <span>Logging in...</span>
                                    </div>
                                ) : (
                                    "Login"
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* Register Link */}
                    <div className="mt-4 text-center">
                        <p className="text-gray-600 text-sm">
                            Don't have an account?{" "}
                            <span
                                className="text-blue-600 cursor-pointer hover:underline"
                                onClick={() => Navigation("/register")}
                            >
                                Register here
                            </span>
                        </p>
                        <Link to="/" className="inline-block mt-2 text-gray-500 hover:text-gray-800 text-sm">← Back to Home</Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;

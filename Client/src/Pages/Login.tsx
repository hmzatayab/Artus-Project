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
import { loginUser } from "@/APIs/User";
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import LoadingIcon from "@/utils/Loading";

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
                setUser(user);
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
                                        <LoadingIcon></LoadingIcon>
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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { useUser } from "../Context/UserContext";
import { registerUser } from "../Store/User";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import PasswordStrengthMeter from "@/utils/PasswordMeter";

const formSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const Register = () => {
    const Navigation = useNavigate();
    const [loading, setLoading] = useState(false);
    const { setUser } = useUser();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            const user = await registerUser(values);
            toast("Account Created Successfully", {
                description: "You can now log in to your account.",
                action: {
                    label: "Login",
                    onClick: () => Navigation("/login"),
                },
            });
            setUser(user);
            Navigation("/")
        } catch (error) {
            toast(`Registration failed`, {
                description: `${(error as Error).message}`,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <Card className="w-full max-w-md shadow-lg rounded-xl p-6">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Username</Label>
                                        <FormControl>
                                            <Input placeholder="@username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Name</Label>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Email</Label>
                                        <FormControl>
                                            <Input type="email" placeholder="example@gmail.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                                        type={showPassword ? "text" : "password"} // Toggle password visibility
                                                        placeholder="6+ characters"
                                                        {...field}
                                                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    {/* 👁️ Eye Icon for Show/Hide Password */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                                    >
                                                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                            <PasswordStrengthMeter password={field.value || ""} /> {/* Strength Meter */}
                                        </FormItem>
                                    );
                                }}
                            />
                            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg cursor-pointer" disabled={loading}>
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
                                        <span>Registering...</span>
                                    </div>
                                ) : (
                                    "Register"
                                )}
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?
                            <Link to="/login" className="text-blue-500 font-semibold ml-1 hover:underline">Login</Link>
                        </p>
                        <Link to="/" className="inline-block mt-2 text-gray-500 hover:text-gray-800 text-sm">← Back to Home</Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;

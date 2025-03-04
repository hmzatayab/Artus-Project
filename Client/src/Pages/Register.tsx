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
import { registerUser } from "../APIs/User";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import PasswordStrengthMeter from "@/utils/PasswordMeter";
import LoadingIcon from "@/utils/Loading";

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
                                        <LoadingIcon></LoadingIcon>
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

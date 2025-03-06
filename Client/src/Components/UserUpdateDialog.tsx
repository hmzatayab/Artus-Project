import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiCameraLine } from "@remixicon/react";
import { getUser, saveUser } from "@/utils/storage";
import { userUpdate } from "@/APIs/User";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { AppError } from "@/Types/error";
import LoadingIcon from "@/utils/Loading";

function UserUpdateDialog() {
    const [user, setUser] = useState(getUser() || {});
    const [username, setUsername] = useState(user?.username || "");
    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(user?.image || "");

    useEffect(() => {
        setUsername(user?.username || user?.user?.username || "");
        setName(user?.name || user?.user?.name || "");
        setBio(user?.bio || user?.user?.bio || "");
        setPreviewImage(user?.image || user?.user?.image || "");
    }, [user]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImage(file);
            const imageURL = URL.createObjectURL(file);
            setPreviewImage(imageURL);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        const token = getUser()?.token;
        if (!token) {
            toast("You need to be logged in to update your profile.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("username", username);
        formData.append("bio", bio);
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = (await userUpdate(formData, token)) as any;
            if (response) {
                toast("Profile updated successfully!");
                
                const updatedImageURL = response.user?.image || previewImage;

                const updatedUser = {
                    ...user,
                    user: {
                        ...user.user,
                        name,
                        username,
                        bio,
                        image: updatedImageURL,
                    },
                };

                saveUser(updatedUser);
                setUser(updatedUser);
                setPreviewImage(updatedImageURL);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            const err = error as AppError;
            toast(err.response?.data?.message || "Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger>
                <div className="relative w-32 h-32">
                    <img
                        src={user?.image || user.user.image}
                        alt="User Profile"
                        className="w-32 h-32 rounded-full outline-3 border-4 dark:border-gray-950 border-white outline-green-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm rounded-full opacity-0 hover:opacity-100 transition-all duration-300 cursor-pointer">
                        <RiCameraLine size={24} />
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden">
                        <img
                            src={previewImage}
                            alt="User Profile"
                            className="w-24 h-24 rounded-full object-cover"
                        />
                        <label className="absolute bottom-2 right-2 bg-gray-800 p-1 rounded-full cursor-pointer">
                            <RiCameraLine size={18} className="text-white" />
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                    <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <Input placeholder="Display Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <Textarea
                        placeholder="Bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="resize-none h-24"
                    />
                    <Button onClick={handleSubmit} disabled={loading} className="mt-4">
                        {loading ? <span className="flex items-center gap-2"><LoadingIcon /> Saving...</span> : "Save Changes"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default UserUpdateDialog;
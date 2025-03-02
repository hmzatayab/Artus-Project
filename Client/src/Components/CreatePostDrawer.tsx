import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { uploadImage } from "@/Store/User";
import { Checkbox } from "./ui/checkbox";
import LoadingIcon from "@/utils/Loading";

const UploadDrawer: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [tags, setTags] = useState<string>("");
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem("userToken");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            const { width, height } = img;

            if (
                !(
                    (width === 1080 && height === 1920) ||
                    (width === 720 && height === 1280) 
                )
            ) {
                toast("Image size must be 1080x1920 px or 720x1280 px.");
                return;
            }

            const aspectRatio = width / height;
            if (Math.abs(aspectRatio - 9 / 16) > 0.01) {
                toast("Image aspect ratio must be 9:16.");
                return;
            }

            setImageFile(file);
        };

        img.onerror = () => {
            toast("Invalid image file.");
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (!imageFile) {
            toast("Please upload an image file!");
            setLoading(false);
            return;
        }

        if (title.length < 15 || title.length > 25) {
            toast("Title must be between 15 and 25 characters");
            setLoading(false);
            return;
        }

        const descriptionCharCount = description.length; 
        if (descriptionCharCount < 100) {
            toast("Description must be at least 100 characters");
            setLoading(false);
            return;
        }
        if (descriptionCharCount > 250) {
            toast("Description cannot exceed 250 characters");
            setLoading(false);
            return;
        }


        const tagsArray = tags
            .split(",") 
            .map((tag) => tag.trim()) 
            .filter((tag) => tag !== ""); 

        if (tagsArray.length < 3) {
            toast("You must add at least 3 tags");
            setLoading(false);
            return;
        }
        if (tagsArray.length > 10) {
            toast("You can add a maximum of 10 tags");
            setLoading(false);
            return;
        }

        if (!agreeToTerms) {
            toast("You must agree to the Terms & Conditions and Privacy Policy before uploading.");
            setLoading(false);
            return;
        }

        for (let tag of tagsArray) {
            if (tag.length < 3 || tag.length > 15) {
                toast("Each tag must be between 3 and 15 characters");
                setLoading(false);
                return;
            }
        }

        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("tags", JSON.stringify(tagsArray));

        try {
            if (!token) {
                toast("You must be logged in to upload an image.");
                setLoading(false);
                return;
            }

            const response = await uploadImage(formData, token);

            if (response) {
                toast("Image uploaded successfully!");
                setLoading(false);
                navigate("/"); 
            }
        } catch (error) {
            toast("An error occurred while uploading the image.");
        }

        setImageFile(null);
        setTitle("");
        setDescription("");
        setTags("");
    };

    const removeImage = () => {
        setImageFile(null);
    };

    return (
        <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
                <DialogTitle className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    UPLOAD IMAGE
                </DialogTitle>
                <DialogDescription>Upload your image with a 9:16 aspect ratio and size of 1080x1920 px or 720x1280 px.</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Section: Image Upload */}
                <Card className="flex flex-col items-center justify-center p-4">
                    {!imageFile ? (
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full lg:h-96 sm:h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-900 transition-all duration-500"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg
                                        className="w-8 h-8 mb-4 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-400">
                                        <span className="font-semibold">Click to upload</span>
                                    </p>
                                    <p className="text-xs text-gray-400">SVG, PNG, or JPG (Ratio 9:16, Size 1080x1920 px)</p>
                                </div>
                                
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    ) : (
                        <div className="relative">
                            <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Preview"
                                className="w-80 lg:w-full h-40 lg:h-96 object-cover rounded-lg shadow-lg"
                            />
                            <Button
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-300"
                            >
                                &times;
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Right Section: Form Inputs */}
                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                        {/* Title */}
                        <div>
                            <Label className="dark:text-white block text-sm mb-2">Title</Label>
                            <Input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full"
                                placeholder="Enter a title"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <Label className="dark:text-white block text-sm mb-2">Description</Label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full"
                                rows={4}
                                placeholder="Describe your image (max 250 characters)"
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <Label className="dark:text-white block text-sm mb-2">Tags (separate with commas)</Label>
                            <Input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full"
                                placeholder="Enter tags separated by commas"
                            />
                        </div>

                        {/* Terms & Conditions Checkbox */}
                        <div className="flex items-center space-x-2 ">
                            <Checkbox id="terms" checked={agreeToTerms} onCheckedChange={(checked) => setAgreeToTerms(!!checked)} />
                            <Label htmlFor="terms" className="text-sm">
                                I agree to the <a href="/terms" className="text-blue-400 underline">Terms & Conditions</a> and <a href="/privacy" className="text-blue-400 underline">Privacy Policy</a>.
                            </Label>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                            <Button type="submit" className="w-full cursor-pointer" disabled={!agreeToTerms}>
                                {/* Upload */}
                                {loading ? (
                                    <div role="status" className="flex items-center gap-2">
                                        <LoadingIcon></LoadingIcon>
                                        <span>Uploading...</span>
                                    </div>
                                ) : (
                                    "Upload"
                                )}
                            </Button>                            
                        </div>
                    </form>
                </Card>
            </div>
        </DialogContent>
    );
};

export default UploadDrawer;
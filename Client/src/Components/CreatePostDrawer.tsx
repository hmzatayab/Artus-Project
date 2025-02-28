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

const UploadDrawer: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [tags, setTags] = useState<string>("");
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem("userToken");

    // Handle image upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check image dimensions and aspect ratio
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            const { width, height } = img;

            // Check dimensions
            if (
                !(
                    (width === 1080 && height === 1920) || // 1080x1920 px
                    (width === 720 && height === 1280) // 720x1280 px
                )
            ) {
                toast("Image size must be 1080x1920 px or 720x1280 px.");
                return;
            }

            // Check aspect ratio (9:16)
            const aspectRatio = width / height;
            if (Math.abs(aspectRatio - 9 / 16) > 0.01) {
                toast("Image aspect ratio must be 9:16.");
                return;
            }

            // If everything is valid, set the image file
            setImageFile(file);
        };

        img.onerror = () => {
            toast("Invalid image file.");
        };
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (!imageFile) {
            toast("Please upload an image file!");
            setLoading(false);
            return;
        }

        // Title validation
        if (title.length < 15 || title.length > 25) {
            toast("Title must be between 15 and 25 characters");
            setLoading(false);
            return;
        }

        // Description validation (Character count: Min 100, Max 250)
        const descriptionCharCount = description.length; // Count characters in description
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

        // Tags validation
        const tagsArray = tags
            .split(",") // Split by commas
            .map((tag) => tag.trim()) // Trim spaces
            .filter((tag) => tag !== ""); // Remove empty tags

        // Validate tag count (min 3 tags, max 10 tags)
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

        // Validate each tag length (min 3, max 15 characters)
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

            // Use the uploadImage function from the store
            const response = await uploadImage(formData, token);

            if (response) {
                toast("Image uploaded successfully!");
                setLoading(false);
                navigate("/"); // Redirect after upload
            }
        } catch (error) {
            toast("An error occurred while uploading the image.");
        }

        // Reset form fields
        setImageFile(null);
        setTitle("");
        setDescription("");
        setTags("");
    };

    // Handle image removal
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
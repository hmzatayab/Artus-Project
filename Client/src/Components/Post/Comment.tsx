import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/Components/ui/card";
import { SendHorizonal, ChevronDown, ChevronUp } from "lucide-react";
import { RiHeartFill, RiHeartLine, RiVerifiedBadgeFill } from "@remixicon/react";
import { getPostComments, createComment, createReply, likeComment, likeCommentReply } from "@/APIs/Post";
import { getUser } from "@/utils/Storage";
import { Comment, ReplyType, CommentCardProps } from "@/Types/Comment";
import { useNavigate } from "react-router-dom";
import { CommentSkeleton } from "../Other/Skeleton/Comment";

const CommentCard: React.FC<CommentCardProps> = ({ postId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [comment, setComment] = useState("");
    const [replyingTo, setReplyingTo] = useState<{ username: string; commentId: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const Navigate = useNavigate();

    const data = getUser();

    useEffect(() => {
        const fetchPostComment = async () => {
            try {
                if (!postId) return;
                const data = await getPostComments(postId);
                setComments(data);
            } catch (err) {
                setError("Failed to fetch post comments");
            } finally {
                setIsLoading(false)
            }
        };
        fetchPostComment();
    }, [postId]);

    // Handle comment submission
    const handleCommentSubmit = async () => {
        if (!comment.trim() || !postId) return;

        // Validation: Comment max 200 characters hona chahiye
        if (comment.length > 200) {
            toast("Comment cannot exceed 200 characters.");
            return;
        }

        // Validation: Sirf '@' allowed, baki special characters block
        const specialCharRegex = /[^a-zA-Z0-9\s@\p{Emoji}]/u;
        if (specialCharRegex.test(comment)) {
            toast("Only '@' is allowed in comments. No other special characters.");
            return;
        }

        try {
            const token = data?.token;
            if (!token) {
                toast("You need to login first", {
                    action: {
                        label: "Login",
                        onClick: () => Navigate("/login"),
                    },
                });
            }
            setLoading(true);

            const newComment = await createComment(postId, comment, token);

            const updatedComment: Comment = {
                ...(newComment.comment as Comment),
                user: {
                    name: data.user.name,
                    image: data.user.image,
                },
            };

            setComments((prevComments) => [...prevComments, updatedComment]);
            setComment("");
            setReplyingTo(null);
        } catch (error) {
            console.error("Failed to create comment");
        } finally {
            setLoading(false);
        }
    };

    // Handle reply submission
    const handleReplySubmit = async () => {
        if (!comment.trim() || !replyingTo) return;

        try {
            const token = data?.token; // Get user token
            if (!token) {
                toast("You need to login first", {
                    action: {
                        label: "Login",
                        onClick: () => Navigate("/login"),
                    },
                });
            }

            setLoading(true);

            const newReply = await createReply(replyingTo.commentId, comment, token);


            // Ensure newReply has the correct structure with user data
            const updatedReply: ReplyType = {
                ...(newReply.reply as ReplyType), // Spread newReply object
                user: {
                    name: data.user.name, // Add user name from current user data
                    image: data.user.image, // Add user image from current user data
                },
            };


            // Update comments state with the new reply
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === replyingTo.commentId
                        ? {
                            ...comment,
                            replies: [...(comment.replies ?? []), updatedReply], // Ensure replies is always an array
                        }
                        : comment
                )
            );


            setComment(""); // Clear input after submission
            setReplyingTo(null); // Clear replyingTo state
        } catch (error) {
            console.error("Failed to create reply");
        } finally {
            setLoading(false);
        }
    };

    // Handle like button click
    const handleLikeComment = async (commentId: string) => {
        try {
            const token = data?.token; // Get user token
            if (!token) {
                toast("You need to login first", {
                    action: {
                        label: "Login",
                        onClick: () => Navigate("/login"),
                    },
                });
            }

            // Call the likeComment API
            await likeComment(commentId, token);

            // Update the UI to reflect the like
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === commentId
                        ? {
                            ...comment,
                            isLikedByCurrentUser: !comment.isLikedByCurrentUser, // Toggle like status
                            likes: comment.isLikedByCurrentUser
                                ? comment.likes.filter((userId) => userId !== data.user.id) // Remove like
                                : [...comment.likes, data.user.id], // Add like
                        }
                        : comment
                )
            );
        } catch (error) {
            console.error("Failed to like comment:", error);
        }
    };

    // Handle reply like button click
    const handleLikeCommentReply = async (replyId: string, commentId: string) => {
        try {
            const token = data?.token; // Get user token
            if (!token) {
                toast("You need to login first", {
                    action: {
                        label: "Login",
                        onClick: () => Navigate("/login"),
                    },
                });
            }

            // Call the likeCommentReply API
            await likeCommentReply(replyId, token);

            // Update the UI to reflect the like
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === commentId
                        ? {
                            ...comment,
                            replies: comment.replies?.map((reply) =>
                                reply.id === replyId
                                    ? {
                                        ...reply,
                                        isLikedByCurrentUser: !reply.isLikedByCurrentUser, // Toggle like status
                                        likes: reply.isLikedByCurrentUser
                                            ? reply.likes.filter((userId) => userId !== data.user.id) // Remove like
                                            : [...reply.likes, data.user.id], // Add like
                                    }
                                    : reply
                            ),
                        }
                        : comment
                )
            );
        } catch (error) {
            console.error("Failed to like reply:", error);
        }
    };
    // Handle reply button click
    const handleReplyClick = (username: string, commentId: string) => {
        const token = data?.token; // Get user token
        if (!token) {
            toast("You need to login first", {
                action: {
                    label: "Login",
                    onClick: () => Navigate("/login"),
                },
            });
        }
        const firstWord = username.split(" ")[0]; // Extract the first word of the username
        setReplyingTo({ username, commentId }); // Set the user being replied to
        setComment(`@${firstWord} `); // Pre-fill the input with @firstWord
    };

    // Handle expand/collapse replies
    const toggleExpandReplies = (commentId: string) => {
        setExpandedComments((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    if (error) return <p>{error}</p>;


    return (
        <div className="relative flex flex-col h-[450px]">
            {/* Comments Section (Top) */}
            <div className="flex-1 overflow-y-auto space-y-2">
                {isLoading ? (
                    <>
                        <CommentSkeleton />
                    </>

                ) : comments.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">No Comments Yet</div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-4 p-4 dark:bg-[#050c1c] bg-white border shadow rounded-lg">
                            <Avatar className="w-10 h-10 border-2 border-gray-700 cursor-pointer">
                                <AvatarImage src={comment.user.image} alt={comment.user.name} />
                                <AvatarFallback>
                                    {comment.user.name
                                        .split(" ")
                                        .map((word: string) => word[0])
                                        .join("")
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-semibold ">
                                        {(() => {
                                            const words = comment.user.name.split(" ");
                                            const firstWord = words[0] || "";
                                            const secondWord = words[1] || "";

                                            if (firstWord.length > 5) {
                                                return `${firstWord.slice(0, 5)}...`;
                                            } else if (secondWord) {
                                                return `${firstWord} ${secondWord[0]}.`;
                                            } else {
                                                return firstWord;
                                            }
                                        })()}
                                    </h4>
                                    {comment.user.identityVerified && (
                                        <RiVerifiedBadgeFill size={14} color="#089dea" />
                                    )}
                                    <span className="text-xs text-gray-400">• {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                                </div>
                                <p className="text-sm dark:text-gray-300 leading-relaxed">{comment.content}</p>

                                <div className="flex gap-3">

                                    {/* Like Button */}
                                    <button
                                        onClick={() => handleLikeComment(comment.id)}
                                        className="flex items-center gap-1 mt-2 text-sm hover:text-blue-500 transition-colors cursor-pointer"
                                    >
                                        {data?.user?.id && comment?.likes?.includes(data.user.id) ? (
                                            <RiHeartFill className="w-4 h-4 text-red-500" />
                                        ) : (
                                            <RiHeartLine className="w-4 h-4 dark:text-gray-400 text-gray-600" />
                                        )}
                                        <span className={data?.user?.id && comment?.likes?.includes(data.user.id) ? "text-red-500" : "text-gray-400"}>
                                            {comment.likes.length}
                                        </span>
                                    </button>

                                    {/* Reply Button */}
                                    <div className="flex items-center gap-4 mt-2">
                                        <button
                                            onClick={() => handleReplyClick(comment.user.name, comment.id)}
                                            className="text-sm dark:text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>

                                {/* Replies Section */}
                                {comment.replies && comment.replies.length > 0 && (
                                    <div className="mt-4 lg:pl-10 lg:border-l dark:border-gray-700 border-gray-300">
                                        {(expandedComments[comment.id]
                                            ? comment.replies
                                            : comment.replies.slice(0, 3)
                                        ).map((reply) => (
                                            <div key={reply.id} className="flex items-start gap-4 mt-4">
                                                <Avatar className="w-8 h-8 border-2 cursor-pointer">
                                                    <AvatarImage src={reply.user.image} alt={reply.user.name} />
                                                    <AvatarFallback>
                                                        {reply.user.name
                                                            .split(" ")
                                                            .map((word: string) => word[0])
                                                            .join("")
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="text-sm font-semibold ">
                                                            {(() => {
                                                                const words = reply.user.name.split(" ");
                                                                const firstWord = words[0] || "";
                                                                const secondWord = words[1] || "";

                                                                if (firstWord.length > 5) {
                                                                    return `${firstWord.slice(0, 5)}...`;
                                                                } else if (secondWord) {
                                                                    return `${firstWord} ${secondWord[0]}.`;
                                                                } else {
                                                                    return firstWord;
                                                                }
                                                            })()}
                                                        </h4>
                                                        {reply.user.identityVerified && (
                                                            <RiVerifiedBadgeFill size={14} color="#089dea" />
                                                        )}
                                                        <span className="text-xs text-gray-400">• {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}</span>
                                                    </div>
                                                    <p className="text-sm dark:text-gray-300 leading-relaxed">
                                                        {reply.content.split(" ").map((word, index) =>
                                                            word.startsWith("@") ? (
                                                                <span key={index} className="font-bold text-blue-500">
                                                                    {word}{" "}
                                                                </span>
                                                            ) : (
                                                                <span key={index}>{word} </span>
                                                            )
                                                        )}
                                                    </p>

                                                    <div className="flex gap-3">
                                                        {/* Like Button */}
                                                        <button
                                                            onClick={() => handleLikeCommentReply(reply.id, comment.id)}
                                                            className="flex items-center gap-1 mt-2 text-sm hover:text-blue-500 transition-colors cursor-pointer"
                                                        >
                                                            {data?.user?.id && reply?.likes?.includes(data.user.id) ? (
                                                                <RiHeartFill className="w-4 h-4 text-red-500" />
                                                            ) : (
                                                                <RiHeartLine className="w-4 h-4 dark:text-gray-400 text-gray-600" />
                                                            )}
                                                            <span className={data?.user?.id && reply?.likes?.includes(data.user.id) ? "text-red-500" : "text-gray-400"}>
                                                                {reply.likes.length}
                                                            </span>
                                                        </button>

                                                        {/* Reply Button for Nested Replies */}
                                                        <div className="flex items-center gap-4 mt-2">
                                                            <button
                                                                onClick={() => handleReplyClick(reply.user.name, comment.id)}
                                                                className="text-sm text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                                                            >
                                                                Reply
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Expand/Collapse Button */}
                                        {comment.replies.length > 3 && (
                                            <button
                                                onClick={() => toggleExpandReplies(comment.id)}
                                                className="flex items-center gap-1 mt-2 text-sm text-blue-500 hover:text-blue-700 transition-colors"
                                            >
                                                {expandedComments[comment.id] ? (
                                                    <>
                                                        <ChevronUp className="w-4 h-4 cursor-pointer" />
                                                        <span className="cursor-pointer">Collapse</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDown className="w-4 h-4 cursor-pointer" />
                                                        <span className="cursor-pointer">View {comment.replies.length - 3} more replies</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Box (Fixed at Bottom) */}
            <div className="sticky bottom-0 pt-2">
                <Card className="px-1 py-3 lg:p-3 dark:bg-[#050c1c] bg-white">
                    <CardContent className="flex items-center gap-3">
                        <Avatar className="hidden lg:block">
                            <AvatarImage src={data?.user.image} alt="User" />
                            <AvatarFallback>
                                {data?.user.name
                                    .split(" ")
                                    .map((word: string) => word[0])
                                    .join("")
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        {/* Input Field */}
                        <Input
                            placeholder="Write a comment..."
                            className="dark:bg-black bg-gray-300 flex-1 rounded-full px-4 py-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />

                        {/* Submit Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={replyingTo ? handleReplySubmit : handleCommentSubmit}
                        >
                            {loading ? (
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
                            ) : (
                                <SendHorizonal className="w-5 h-5 text-blue-500 hover:text-blue-700 transition" />
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CommentCard;
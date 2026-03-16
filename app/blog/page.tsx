"use client";
import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react"; // Added Suspense import
import type { BlogPost } from "../components/database-parse-type";
import Desktop from "../components/desktop";
import Window from "../components/window";
import { FetchBlogPosts, UploadBlogPost } from "../database";
import { DiscordLogIn } from "../discord";
import { ParseText } from "../text-parser";

function formatDate(date: Date): string {
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour12: true,
	};

	return date.toLocaleString("en-US", options);
}

function BlogContent() {
	const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
	const [userID, setUserID] = useState<null | string>(null);

	const { data: discordData, status } = useSession();
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		async function grabBlogPosts() {
			setBlogPosts((await FetchBlogPosts()).reverse());
		}
		grabBlogPosts();
	}, []);

	useEffect(() => {
		const login = async () => {
			try {
				if (!discordData) return;
				var userData = await DiscordLogIn(discordData);
				if (userData == null) return;
				setUserID(userData._id as string);
			} catch (error) {
				console.error("Error fetching data from discord:", error);
			}
		};
		login();
	}, [discordData]);

	function ButtonPane({ post, id }: { post: BlogPost; id: number }) {
		return (
			<button
				className="window text-black min-w-[5px] w-full mb-5"
				onClick={() => router.push(`/blog?id=${id}`)}
			>
				<p className="text-lg mx-3">{post.title}</p>
				<p className="text-sm mx-3">{post.description}</p>
				<p className="text-gray-500 text-right text-xs mx-3">
					{formatDate(post.datetime)}
				</p>
			</button>
		);
	}

	function DisplayBlogPost({ id }: { id: number }) {
		const post = blogPosts.filter((p) => p.post_id == id)[0];

		if (post == undefined) {
			return (
				<div className=" text-black min-w-[5px]">
					<p className="text-2xl">...</p>
					<br />
					<div className="window mb-5">
						<div className="text-sm mx-5 my-2">...</div>
						<br />
						<p className="text-xs text-right m-2 my-[-10px]">...</p>
						<br />
					</div>
					<button onClick={() => router.push("/blog")}>Back To Posts</button>
				</div>
			);
		}

		return (
			<div className=" text-black min-w-[5px]">
				<Head>
					<title>Proxot System</title>
					<meta name="description" content={post.description} />
					<meta property="og:title" content={post.title} />
					<meta property="og:description" content={post.description} />
					<meta property="og:url" content="https://www.theworldmachine.xyz/" />
				</Head>
				<div className="window mb-5">
					<div className="text-sm mx-5 my-2">
						<p className="text-2xl mt-5 text-center">{post.title}</p>
						<br />
						<ParseText>{post.content}</ParseText>
					</div>
					<br />
					<p className="text-xs text-right m-2 my-[-10px]">
						Posted: {formatDate(post.datetime)}
					</p>
					<br />
				</div>
				<button onClick={() => router.push("/blog")}>Back To Posts</button>
			</div>
		);
	}

	function CreateBlogPost() {
		const [title, setTitle] = useState("");
		const [desc, setDesc] = useState("");
		const [content, setContent] = useState("");
		const [isUploading, setIsUploading] = useState(false);

		async function handleUpload() {
			if (!title || !content) {
				alert("Title and Content are required.");
				return;
			}

			setIsUploading(true);
			try {
				const blog: BlogPost = {
					title: title,
					description: desc,
					content: content,
					datetime: new Date(Date.now()),
					post_id: blogPosts.length,
				};

				await UploadBlogPost(blog);
				alert("Post uploaded successfully!");
				window.location.reload(); // Refresh to show new post
			} catch (e) {
				alert("Failed to upload post.");
			} finally {
				setIsUploading(false);
			}
		}

		return (
			<div className=" text-black min-w-[5px]">
				<textarea
					placeholder="Blog title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				></textarea>
				<br />
				<textarea
					className="w-1/2"
					placeholder="Small description goes here"
					value={desc}
					onChange={(e) => setDesc(e.target.value)}
				></textarea>
				<br />
				<textarea
					className="w-full"
					placeholder="Blog content goes here"
					value={content}
					onChange={(e) => setContent(e.target.value)}
				></textarea>
				<button className="mb-5" onClick={handleUpload} disabled={isUploading}>
					{isUploading ? "Uploading..." : "Post"}
				</button>
			</div>
		);
	}

	if (!blogPosts.length) {
		return (
			<Window title="Blog Posts" className="max-w-[800px]">
				{userID !== null &&
					["744276454946242723", "302883948424462346"].includes(userID) && (
						<CreateBlogPost />
					)}
				<div className="text-black">Loading...</div>
			</Window>
		);
	}

	if (searchParams.size > 0) {
		return (
			<Window title="Blog Posts" className="max-w-[800px]">
				<DisplayBlogPost id={Number(searchParams.get("id") || "0")} />
			</Window>
		);
	}

	return (
		<Window title="Blog Posts" className="max-w-[800px]">
			{userID !== null &&
				["744276454946242723", "302883948424462346"].includes(userID) && (
					<CreateBlogPost />
				)}
			{blogPosts.map((post) => (
				<ButtonPane key={post.post_id} post={post} id={post.post_id} />
			))}
		</Window>
	);
}

export default function Page() {
	return (
		<Desktop>
			<Suspense fallback={<div className="text-black">Loading...</div>}>
				<BlogContent />
			</Suspense>
		</Desktop>
	);
}

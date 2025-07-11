import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({feedType, username, userId}) => {

	const getPostEndpoint = ()=>{
		switch (feedType){
			case "forYou":
				return "/api/posts/all";
			case "following":
				return "/api/posts/followerPosts";
			// posts made by authUser
			case "posts":
				return `/api/posts/user/${username}`;
			// posts liked byauthUser
			case  "likes":
				return `/api/posts/liked/${userId}`;
			default :
				return "/api/posts/all";
		}
	}
	const POST_ENDPOINT  =  getPostEndpoint();

	const {data : posts, isLoading, refetch, isRefetching}  = useQuery({
		queryKey : ['posts'],
		queryFn: async()=>{

			try {
				const res = await fetch(POST_ENDPOINT);
				const data  = await res.json();
				if(!res.ok){
					throw new Error(data.error || "Something went wrong");
				}
				return data;
				
			} catch (error) 
			{
				throw new Error(error);	
			}

		},
	})

	//Whenever feedType or refetch changes, call the refetch() function.

	// refetch() is a function provided by React Query’s useQuery() hook to manually 
	// re-run the query and fetch fresh data.

	useEffect(()=>{
		refetch()
	}, [feedType,  refetch])

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;
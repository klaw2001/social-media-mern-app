import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VerifiedIcon from "@mui/icons-material/Verified";
import DeleteIcon from "@mui/icons-material/Delete";
const GetPost = () => {
  const userDetail = localStorage.getItem("userDetails");

  const [posts, setPosts] = useState([]);
  const [singleUser, setSingleUser] = useState([]);

  useEffect(() => {
    const fetchSingleUser = async () => {
      const singleUser = await axios.get(
        `http://localhost:8000/users/get-single-user/${userDetail}`
      );
      if (singleUser.status === 200) {
        setSingleUser(singleUser.data.data);
      }
    };
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/posts/get-posts/${userDetail}`
        );
        if (response.status === 200) {
          const sortedPosts = response.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setPosts(sortedPosts);
          console.log(sortedPosts.length);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
    fetchSingleUser();
  }, [userDetail]);

  const handleDeletePost = async (postId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/posts/delete-post/${postId}`
      );

      if (response.status === 200) {
        console.log("Post deleted successfully!");

        const updatedPosts = posts.filter((post) => post._id !== postId);
        setPosts(updatedPosts);
      } else {
        console.error("Error deleting the post:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/posts/like-post/${postId}`,
        {
          userID: userDetail,
        }
      );

      if (response.status === 200) {
        console.log("Post liked successfully!");

        // Update the post's like count
        const updatedPosts = posts.map((post) => {
          if (post._id === postId) {
            return { ...post, likes: [...post.likes, userDetail] };
          }
          return post;
        });

        setPosts(updatedPosts);
      } else {
        console.error("Error liking the post:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleUnlikePost = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/posts/unlike-post/${postId}`,
        {
          userID: userDetail,
        }
      );

      if (response.status === 200) {
        console.log("Post unliked successfully!");

        // Update the post's like count
        const updatedPosts = posts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              likes: post.likes.filter((userId) => userId !== userDetail),
            };
          }
          return post;
        });

        setPosts(updatedPosts);
      } else {
        console.error("Error unliking the post:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };


  return (
    <Box>
      {posts.map((post) => (
        <Paper key={post._id} sx={{ padding: 2, marginBottom: 2 }}>
          <div className="d-flex align-items-center">
            <Avatar
              alt="a"
              src={`http://localhost:8000/uploads/users/${singleUser?.profilepicture}`}
              className="img-fluid me-2"
            />
            <Typography variant="h6" component="div" className="">
              <span className="fw-bold">
                {singleUser?.firstname} {singleUser?.lastname}{" "}
              </span>
              <span className="fs-6 fw-normal">({singleUser?.username})</span>
              <VerifiedIcon className="text-primary fs-5 ms-1" />
            </Typography>
          </div>
          <div className="text-start">
            <Typography variant="body2" color="">
              <p className="my-3">{post.textContent}</p>
            </Typography>
            {post.contentType === "image" && (
              <img
                src={`http://localhost:8000/uploads/posts/${post.image}`}
                alt="Post Image"
                width={500}
                className="mb-3 rounded"
              />
            )}
            <Typography variant="body2" color="" className="text-start">
              {post.caption}
            </Typography>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-between align-items-center mt-2">
                {post.likes.includes(userDetail) ? (
                <button className="bg-transparent" onClick={() => handleUnlikePost(post._id)}>
                  <FavoriteIcon className="text-danger me-1" />
                </button>
              ) : (
                <button className="bg-transparent" onClick={() => handleLikePost(post._id)}>
                  <FavoriteBorderIcon className="text-danger me-1" />
                </button>
              )}
                  {post.likes.length}
                </div>
              </div>
              <div>
                <button
                  className="bg-transparent"
                  onClick={() => handleDeletePost(post._id)}
                >
                  <DeleteIcon className="text-danger" />
                </button>
              </div>
            </div>
          </div>
        </Paper>
      ))}
    </Box>
  );
};

export default GetPost;

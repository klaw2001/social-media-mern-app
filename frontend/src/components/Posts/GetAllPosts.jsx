import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import TextField from "@mui/material/TextField";
import CommentIcon from "@mui/icons-material/Comment";
import Grid from "@mui/material/Unstable_Grid2";
import SendIcon from "@mui/icons-material/Send";

const GetAllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [singleUser, setSingleUser] = useState({});
  const [commentInput, setCommentInput] = useState("");
  const [userDetail, setUserDetail] = useState(
    localStorage.getItem("userDetails")
  );
  const [editMode, setEditMode] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [showComments, setShowComments] = useState({ postId: null });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/posts/get-posts"
        );
        if (response.status === 200) {
          const sortedPosts = response.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setPosts(sortedPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [posts]);

  useEffect(() => {
    const getSingleUser = () => {
      const response = axios
        .get(`http://localhost:8000/users/get-single-user/${userDetail}`)
        .then((res) => {
          setSingleUser(res.data.data);
        });
    };
    getSingleUser();
  }, []);

  const handleEditClick = (postId, initialContent) => {
    setEditedContent(initialContent);
    setEditMode(postId);
  };

  const handleEditChange = (event) => {
    setEditedContent(event.target.value);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/posts/update-post/${editMode}`,
        {
          content: editedContent,
        }
      );

      if (response.status === 200) {
        alert("Post Edited");
        const updatedPosts = posts.map((post) => {
          if (post._id === editMode) {
            return { ...post, textContent: editedContent };
          }
          return post;
        });

        setPosts(updatedPosts);
        setEditMode(null);
        setEditedContent("");
      } else {
        console.error("Error editing the post:", response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleCommentChange = (event) => {
    setCommentInput(event.target.value);
  };

  const handleCommentSubmit = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/posts/add-comment/${postId}`,
        {
          userID: userDetail,
          comment: commentInput,
        }
      );

      if (response.status === 200) {
        alert("Comment added successfully!");

        const updatedPosts = posts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              comments: [
                ...post.comments,
                { user: { _id: userDetail }, comment: commentInput },
              ],
            };
          }
          return post;
        });

        setPosts(updatedPosts);
        setCommentInput("");
      } else {
        console.error("Error adding comment:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const toggleComments = (postId) => {
    setShowComments((prevState) => ({
      ...prevState,
      postId: prevState.postId === postId ? null : postId,
    }));
  };

  const onFollowHandler = (userid) => {
    const response = axios.put(
      `http://localhost:8000/users/follow-user/${userid}`,
      {
        userID: userDetail,
      }
    );

    if (response.status === 200) {
      console.log("User Followed");
    }
  };
  const onUnFollowHandler = (userid) => {
    const response = axios.put(
      `http://localhost:8000/users/unfollow-user/${userid}`,
      {
        userID: userDetail,
      }
    );

    if (response.status === 200) {
      console.log("User Followed");
    }
  };

  const toggleHandler = (userid, post) => {
    const isFollowing = post?.users?.followers.includes(userDetail);
    if (!isFollowing) {
      onFollowHandler(userid);
    } else {
      onUnFollowHandler(userid);
    }
  };

  return (
    <Box>
      {posts.map((post) => (
        <Paper
          key={post._id}
          sx={{
            padding: 2,
            marginBottom: 2,
          }}
        >
          <div className="d-flex align-items-center">
            <Avatar
              alt="a"
              src={`http://localhost:8000/uploads/users/${post?.users?.profilepicture}`}
              className="img-fluid me-2"
            />
            <Typography variant="h6" component="div" className="">
              <span className="fw-bold">
                {post.users?.firstname} {post.users?.lastname}
              </span>
              <span className="fs-6 fw-normal">({post.users?.username})</span>
              {post.users._id !== userDetail && (
                <button
                  className="btn btn-primary py-0 fs-6 ms-2"
                  onClick={() => toggleHandler(post.users._id, post)}
                >
                  {post.users.followers.includes(userDetail)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              )}
            </Typography>
          </div>

          <div className="text-start">
            {editMode === post._id ? (
              <TextField
                multiline
                fullWidth
                variant="outlined"
                label="Edit Post"
                value={editedContent}
                className="my-3"
                onChange={handleEditChange}
              />
            ) : (
              <Typography variant="body2" color="">
                <p className="my-3">{post.textContent}</p>
              </Typography>
            )}
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
                <div className="d-flex justify-content-between align-items-center mt-2 me-2">
                  {post.likes.includes(userDetail) ? (
                    <button
                      className="bg-transparent"
                      onClick={() => handleUnlikePost(post._id)}
                    >
                      <FavoriteIcon className="text-danger me-1" />
                    </button>
                  ) : (
                    <button
                      className="bg-transparent"
                      onClick={() => handleLikePost(post._id)}
                    >
                      <FavoriteBorderIcon className="text-danger me-1" />
                    </button>
                  )}
                  {post.likes.length}
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <button
                    className="bg-transparent"
                    onClick={() => toggleComments(post._id)}
                  >
                    <CommentIcon className="text-primary me-1" />
                    {showComments.postId === post._id}
                  </button>
                </div>
              </div>
              <div>
                {post.users._id === userDetail && (
                  <div>
                    {editMode === post._id ? (
                      <div>
                        <button
                          className="bg-transparent me-1"
                          onClick={handleEditSubmit}
                        >
                          Save
                        </button>
                        <button
                          className="bg-transparent"
                          onClick={() => {
                            setEditedContent("");
                            setEditMode(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="bg-transparent me-1"
                        onClick={() =>
                          handleEditClick(post._id, post.textContent)
                        }
                      >
                        <EditNoteIcon className="text-primary fs-3" />
                      </button>
                    )}
                    <button
                      className="bg-transparent"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      <DeleteIcon className="text-danger" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            {showComments.postId === post._id && (
              <div className="py-3">
                {post.comments.map((comment, index) => (
                  <div key={index} className="py-1">
                    <Typography variant="body2" color="">
                      <span className="fs-6 fw-normal pe-1">
                        {singleUser.username}
                      </span>
                       : {comment.comment}
                    </Typography>
                  </div>
                ))}
                <Box sx={{ paddingTop: 3 }}>
                  <Grid container spacing={2} sx={{ position: "relative" }}>
                    <Grid xs={12}>
                      {/* <TextField
                        style={{ borderRadius: "20px" }}
                        multiline
                        fullWidth
                        variant="outlined"
                        placeholder="Add a Comment"
                        value={commentInput}
                        // className="rounded-pill"
                        onChange={handleCommentChange}
                      /> */}
                      <input
                        type="text"
                        value={commentInput}
                        onChange={handleCommentChange}
                        className="p-3 w-100 rounded-pill border-1"
                        placeholder="Add a Comment"
                      />
                      <button
                        style={{
                          backgroundColor: "#0288d1",
                          height: 53,
                          width: 64,
                          right: 0,
                          border: "none",
                          borderTopRightRadius: "50%",
                          borderBottomRightRadius: "50%",
                          position: "absolute",
                        }}
                        // className="bg-transparent"
                        onClick={() => handleCommentSubmit(post._id)}
                      >
                        <SendIcon
                          sx={{ fill: "white" }}
                          color="white"
                          style={{ fill: "white" }}
                        />
                      </button>
                    </Grid>
                    {/* <Grid xs={1}>
                      
                    </Grid> */}
                  </Grid>
                </Box>
              </div>
            )}
          </div>
        </Paper>
      ))}
    </Box>
  );
};

export default GetAllPosts;

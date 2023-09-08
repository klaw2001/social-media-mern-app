import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function AddPost() {
  const userDetail = localStorage.getItem("userDetails");

  const [postContent, setPostContent] = useState("");
  const [contentType, setContentType] = useState("text");
  const [imageFile, setImageFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [refreshPosts, setRefreshPosts] = useState(false);

  const handlePostSubmit = async (event) => {
    event.preventDefault();

    if (postContent.trim() === "") {
      alert("Post content cannot be empty.");
      return;
    }

    const formData = new FormData();
    formData.append("userID", userDetail);
    formData.append("contentType", contentType);
    formData.append("textContent", postContent);

    if (contentType === "image" && imageFile) {
      formData.append("image", imageFile);
      formData.append("caption", caption);
    }

    try {
      const response = await fetch("http://localhost:8000/posts/add-post", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Post created successfully!");

        setPostContent("");
        setContentType("text");
        setImageFile(null);
        setCaption("");
        setRefreshPosts(true);

      } else {
        console.error("Error creating the post:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          width: 1000,
          maxWidth: "100%",
        }}
      >
        <form onSubmit={handlePostSubmit} className="add-post-form">
          <TextField
            fullWidth
            label="What's Happening?"
            id="fullWidth"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              "& > *": {
                m: 1,
              },
            }}
          >
            <ButtonGroup variant="text" aria-label="text button group">
              {/* Remove the "Text" button */}
              <Button onClick={() => setContentType("image")}>
                <AddPhotoAlternateIcon />
              </Button>
            </ButtonGroup>
            {contentType === "image" && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                <TextField
                  fullWidth
                  label="Caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
            )}
            <Button type="submit" variant="contained" className="post-btn">
              Post
            </Button>
          </Box>
        </form>
      </Box>
      <hr />
    </>
  );
}

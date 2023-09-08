import axios from "axios";
import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import ListGroup from "react-bootstrap/ListGroup";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import EmailIcon from "@mui/icons-material/Email";
import HandshakeIcon from "@mui/icons-material/Handshake";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
const LoggedUser = () => {
  const userDetail = localStorage.getItem("userDetails");
  const [singleUser, setSingleUser] = useState([]);
  const [posts, setPosts] = useState([]);

  //   const [user, setUser] = useState([]);
  const getSingleUser = () => {
    axios
      .get(`http://localhost:8000/users/get-single-user/${userDetail}`)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data.data)
          setSingleUser(response.data.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
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

  useEffect(() => {
    getSingleUser();
    fetchPosts()
  }, [singleUser]);

  const formatCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleDateString();
  };
  return (
    <div>
      <div className="d-flex justify-content-center">
        <Avatar
          alt=""
          src={`http://localhost:8000/uploads/users/${singleUser.profilepicture}`}
          sx={{ width: 200, height: 200, textAlign: "center" }}
          className="img-fluid"
        />
      </div>
      <div className="profile-text my-3 text-dark">
        <h2 className="fw-bold text-dark">
          {singleUser?.firstname} {singleUser?.lastname}{" "}
        </h2>
        <span className="fs-6">Username: {singleUser?.username}</span>
        <div className="followers d-flex justify-content-around align-items-center my-4">
            <span><span className="fw-bold">{posts.length}</span> Posts</span>
            <span><span className="fw-bold">{singleUser?.followers?.length}</span> Followers</span>
            <span><span className="fw-bold">{singleUser?.following?.length}</span> Following</span>
        </div>
        <ListGroup className="text-start my-3">
          <ListGroup.Item>
            <NoteAltIcon className="text-primary" /> {singleUser.bio}
          </ListGroup.Item>
          <ListGroup.Item>
            <EmailIcon className="text-primary" /> {singleUser.email}
          </ListGroup.Item>
          <ListGroup.Item>
            <HandshakeIcon className="text-primary" /> Joined on{" "}
            {formatCreatedAt(singleUser.createdAt)}
          </ListGroup.Item>
        </ListGroup>
        <div className="d-flex justify-content-center align-items-center btn-group">
          <Button>
            <Link to='/view-profile' className="text-decoration-none text-light">
         View Profile</Link>
         </Button>
        </div>
      </div>
    </div>
  );
};

export default LoggedUser;

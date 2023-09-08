import { Button, Container, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
const EditProfileComp = () => {
  const userDetail = localStorage.getItem("userDetails");
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    bio: "",
    profilepicture: null,
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8000/users/get-single-user/${userDetail}`)
      .then((res) => {
        setProfile(res.data.data);
        setFormData({
          firstname: res.data.data.firstname || "",
          lastname: res.data.data.lastname || "",
          username: res.data.data.username || "",
          bio: res.data.data.bio || "",
          profilepicture: null,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userDetail]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profilepicture: file,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataObject = new FormData();

    formDataObject.append("firstname", formData.firstname);
    formDataObject.append("lastname", formData.lastname);
    formDataObject.append("username", formData.username);
    formDataObject.append("bio", formData.bio);

    if (formData.profilepicture) {
      formDataObject.append("profilepicture", formData.profilepicture);
    }

    axios
      .put(
        `http://localhost:8000/users/update-user/${userDetail}`,
        formDataObject
      )
      .then((res) => {
        if (res.status === 200) {
          navigate("/view-profile");
        }
      })
      .catch((err) => console.log(err));
  };

  function toggleVisibility() {
    const imageContainer = document.getElementById("image-container");
    if (imageContainer.style.display === "none") {
      imageContainer.style.display = "block";
    } else {
      imageContainer.style.display = "none";
    }
  }

  return (
    <div className="edit-profile">
      <Container>
        <div className="">
          <h1>Edit Your Profile</h1>
          <form onSubmit={handleSubmit} className="my-4">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  type="text"
                  label="Firstname"
                  name="firstname"
                  placeholder="firstname"
                  onChange={handleInputChange}
                  value={formData.firstname}
                  className="form-control mt-2"
                />
                <TextField
                  type="text"
                  label="Lastname"
                  name="lastname"
                  placeholder="lastname"
                  onChange={handleInputChange}
                  value={formData.lastname}
                  className="form-control mt-2"
                />
                <TextField
                  type="text"
                  label="Username"
                  name="username"
                  placeholder="username"
                  onChange={handleInputChange}
                  value={formData.username}
                  className="form-control mt-2"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="text"
                  label="Bio"
                  name="bio"
                  placeholder="bio"
                  onChange={handleInputChange}
                  value={formData.bio}
                  className="form-control mt-2"
                />
                <Button
                  variant="contained"
                  className="btn btn-primary mt-3"
                  onClick={toggleVisibility}
                >
                  Change Profile Picture
                </Button>
                <div id="image-container" style={{ display: "none" }}>
                  <img
                    src={`http://localhost:8000/uploads/users/${profile.profilepicture}`}
                    alt=""
                    width={100}
                    className="img-fluid my-3"
                  />
                  <TextField
                    type="file"
                    name="profilepicture"
                    placeholder="profile picture"
                    onChange={handleFileChange}
                    className="form-control mt-2"
                  />
                </div>
              </Grid>
            </Grid>
            <div className="d-flex justify-content-center align-items-center mt-3 profile-btns">
              <Button
                type="submit"
                variant="contained"
                className="bg-success text-center"
              >
                Save
              </Button>
              <Button variant="contained">
                <Link
                  to="/view-profile"
                  className="text-decoration-none text-light"
                >
                  BACK TO PROFILE
                </Link>
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default EditProfileComp;

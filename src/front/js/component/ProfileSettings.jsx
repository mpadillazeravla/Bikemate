import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const ProfileSettings = () => {
  const [uploadImages, setUploadImages] = useState("");
  const [uploadImages1, setUploadImages1] = useState("");
  const { store, actions } = useContext(Context);
  const [user, setUser] = useState({});
  useEffect(() => {
    actions.userInfo();
  }, []);
  return (
    <>
      <div className="container">
        <h1 className="pt-3">Edit Profile</h1>
        <hr />
        <div className="row">
          {/* <!-- left column --> */}
          <div className="col-md-3">
            <div className="text-center">
              {/* aqui comienza la foto de perfil */}

              <div className="py-2">
                <img
                  src={
                    store.user.photo
                      ? store.user.photo
                      : "https://res.cloudinary.com/bikem8/image/upload/v1659604933/nullprofile_dk2zrr.jpg"
                  }
                  style={{
                    width: "10rem",
                    height: "10rem",
                    objectFit: "cover",
                  }}
                  className="img border-2 border border-warning rounded-3"
                  alt="..."
                />
              </div>
              <div className="py-2">
                <button
                  type="button"
                  className="btn-primary p-1 rounded"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  data-bs-whatever="@mdo"
                  data-backdrop="false"
                >
                  Edit Profile Img
                </button>
                <div
                  className="modal fade modal-dialog-scrollable"
                  id="exampleModal"
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                  data-backdrop="false"
                >
                  <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                          Profile Img
                        </h5>
                        <button
                          type="button"
                          className="btn-close btnHeader"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <form>
                          <div className="mb-3">
                            <input
                              className="form-control input-foto"
                              type="file"
                              id="formFile"
                              onChange={(e) =>
                                setUploadImages(e.target.files[0])
                              }
                            />
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn-primary fw-bold"
                          data-bs-dismiss="modal"
                          onClick={(e) => actions.pictureProfile(uploadImages)}
                        >
                          Upload Image
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aqui esta la parte de la foto de cover */}

              <div className="py-2">
                <img
                  src={
                    store.user.cover
                      ? store.user.cover
                      : "https://res.cloudinary.com/bikem8/image/upload/c_scale,w_668/v1659546812/photo-1616963248328-6b7bea589840_siwuq4.avif"
                  }
                  style={{
                    width: "10rem",
                    height: "10rem",
                    objectFit: "cover",
                  }}
                  className="img border-2 border border-warning rounded-3"
                  alt="..."
                />
              </div>
              <div className="py-2">
                <button
                  type="button"
                  className="btn-primary p-1 rounded"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal2"
                  data-bs-whatever="@mdo"
                  data-backdrop="false"
                >
                  Edit Cover Img
                </button>
                <div
                  className="modal fade modal-dialog-scrollable"
                  id="exampleModal2"
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                  data-backdrop="false"
                >
                  <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                          Cover Image
                        </h5>
                        <button
                          type="button"
                          className="btn-close btnHeader"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <form>
                          <div className="mb-3">
                            <input
                              className="form-control input-foto"
                              type="file"
                              id="formFile"
                              onChange={(e) =>
                                setUploadImages1(e.target.files[0])
                              }
                            />
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn-primary fw-bold"
                          data-bs-dismiss="modal"
                          onClick={(e) => actions.pictureCover(uploadImages1)}
                        >
                          Upload Img
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- edit form column --> */}
          <div className="col-md-9 personal-info">
            <h3>Personal info</h3>

            <form className="form-horizontal" role="form">
              <div className="form-group">
                <label className="col-lg-3 control-label">UserName:</label>
                <div className="col-lg-8">
                  <input
                    className="form-control"
                    type="text"
                    defaultValue={store.user.name}
                    onChange={(e) => {
                      setUser({ ...user, name: e.target.value });
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="col-lg-3 control-label">Email:</label>
                <div className="col-lg-8">
                  <input
                    className="form-control"
                    type="e-mail"
                    defaultValue={store.user.email}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="col-md-3 control-label">Speed Km/h:</label>
                <div className="col-md-8">
                  <input
                    className="form-control"
                    type="text"
                    defaultValue={store.user.speed}
                    onChange={(e) => {
                      setUser({ ...user, speed: e.target.value });
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="col-md-3 control-label">
                  Distance in Km:
                </label>
                <div className="col-md-8">
                  <input
                    className="form-control"
                    type="text"
                    defaultValue={store.user.distance}
                    onChange={(e) => {
                      setUser({ ...user, distance: e.target.value });
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="col-md-3 control-label">City:</label>
                <div className="col-md-8">
                  <input
                    className="form-control"
                    type="text"
                    defaultValue={store.user.city}
                    onChange={(e) => {
                      setUser({ ...user, city: e.target.value });
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="col-md-3 control-label">Bikemodel:</label>
                <div className="col-md-8">
                  <input
                    className="form-control"
                    type="text"
                    defaultValue={store.user.bikemodel}
                    onChange={(e) => {
                      setUser({ ...user, bikemodel: e.target.value });
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="col-md-3 control-label">Route Type:</label>
                <div className="col-md-8">
                  <input
                    className="form-control"
                    type="text"
                    defaultValue={store.user.routetype}
                    onChange={(e) => {
                      setUser({ ...user, routetype: e.target.value });
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="col-md-3 control-label"></label>
                <div className="col-md-8">
                  <Link to={"/dashboard"}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        actions.userUpdate(user);
                        console.log(user);
                      }}
                    >
                      Save Changes
                    </button>
                  </Link>
                  <span></span>
                  <Link to={"/dashboard"}>
                    <input
                      type="reset"
                      className="btn btn-default"
                      value="Cancel"
                    />
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

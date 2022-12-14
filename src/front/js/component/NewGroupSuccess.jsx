import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const NewGroupSuccess = ({ groupId }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  return (
    <div
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div className="container-fluid display-newroute d-flex justify-content-center">
        <div className="cookiesContent" id="cookiesPopup">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5716/5716716.png"
            alt="cookies-img"
          />
          <p>Group created successfully!</p>
          <div className="d-flex justify-content-evenly">
            <button
              className="viewgroup"
              onClick={() => navigate(`/group/${groupId}`)}
            >
              View Group
            </button>
            <button
              className="backtodash"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

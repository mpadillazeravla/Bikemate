const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
      auth: false,
      userDetails: {},
      userList: null,
      groupsInfo: [],
      currentGroup: {},
      mygroupsInfo: [],
      profile: {},
      user: {},
      comment: [],
      groupRoutes: [],
      nextRoute: [],
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      loginUser: async (values) => {
        try {
          const logUser = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
            }),
          };
          const response = await fetch(
            process.env.BACKEND_URL + "/api/login",
            logUser
          );
          const data = await response.json();
          if (response.ok) {
            sessionStorage.setItem("token", data.access_token);
            sessionStorage.setItem("name", data.name);
            sessionStorage.setItem("city", data.city);
            sessionStorage.setItem("speed", data.speed);
            sessionStorage.setItem("auth", true);
            setStore({
              auth: true,
            });
            return data;
          } else {
            return false;
          }
        } catch (error) {
          console.log("There is an error with the server", error);
        }
      },

      logout: () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("auth");
        sessionStorage.removeItem("name");
        setStore({
          auth: false,
        });
      },

      getMessage: async () => {
        try {
          // fetching data from the backend
          const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
          const data = await resp.json();
          setStore({
            message: data.message,
          });
          // don't forget to return something, that is how the async resolves
          return data;
        } catch (error) {
          console.log("Error loading message from backend", error);
        }
      },
      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({
          demo: demo,
        });
      },

      createGroup: async (values) => {
        try {
          const newGroup = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: values.groupName,
              city: values.groupCity,
              distance: values.groupDistance,
              speed: values.groupSpeed,
              routetype: values.groupRoutetype,
            }),
          };

          const response = await fetch(
            process.env.BACKEND_URL + "/api/new_group",
            newGroup
          );
          const data = await response.json();
          if (response.ok) {
            return data;
          } else {
            alert("Seems like this group already exists!");
          }
        } catch (error) {
          console.log("There is an error with the server", error);
        }
      },

      //fetch GET para traer info usuario para editar perfil
      //Fetch para traer info grupos
      groupsInfo: () => {
        fetch(process.env.BACKEND_URL + "/api/dashboard_info")
          .then((response) => response.json())
          .then((data) => {
            setStore({
              groupsInfo: data,
            });
            // sessionStorage.setItem("groupName", data.name);
            // .catch((err) => console.error(err));
          });
      },

      //Fetch PUT para actualizar datos de un grupo

      groupUpdate: (group, groupid) => {
        const accesToken = sessionStorage.getItem("token");
        console.log(accesToken);
        fetch(process.env.BACKEND_URL + `/api/group_edit/${groupid}`, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accesToken,
          },
          body: JSON.stringify(group),
        })
          .then((response) => response.json())
          .then((data) => {
            setStore({
              currentGroup: data,
            });
          });
      },

      //Fetch para traer info grupos a los que pertenezco
      mygroupsInfo: () => {
        const accesToken = sessionStorage.getItem("token");
        fetch(process.env.BACKEND_URL + "/api/get_usergroups", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accesToken,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setStore({
              mygroupsInfo: data,
            });
            // sessionStorage.setItem("groupName", data.name);
            // .catch((err) => console.error(err));
          });
      },

      getUserList: () => {
        fetch(process.env.BACKEND_URL + "/api/all_users")
          .then((response) => response.json())
          .then((data) => {
            setStore({
              userList: data,
            });
            // sessionStorage.setItem("groupName", data.name);
            // .catch((err) => console.error(err));
          });
      },

      registerUser: async (values) => {
        try {
          const newUser = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
              name: values.name,
              city: values.city,
              distance: values.distance,
              speed: values.speed,
              routetype: values.routes,
              bikemodel: "",
            }),
          };
          const response = await fetch(
            process.env.BACKEND_URL + "/api/register",
            newUser
          );
          const data = await response.json();
          if (response.ok) {
            sessionStorage.setItem("token", data.access_token);
            sessionStorage.setItem("auth", true);
            sessionStorage.setItem("name", values.name);
            setStore({
              auth: true,
            });
            return data;
          } else {
            alert("Can't create this user");
          }
        } catch (error) {
          console.log("There is an error with the server", error);
        }
      },

      userInfo: () => {
        const accesToken = sessionStorage.getItem("token");
        console.log(accesToken);
        fetch(process.env.BACKEND_URL + "/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accesToken,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setStore({
              user: data,
            });
            // sessionStorage.setItem("groupName", data.name);
            // .catch((err) => console.error(err));
          });
      },

      //Fetch PUT para actualizar datos de perfil

      userUpdate: (user) => {
        const accesToken = sessionStorage.getItem("token");
        console.log(accesToken);
        fetch(process.env.BACKEND_URL + "/api/user/edit", {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accesToken,
          },
          body: JSON.stringify(user),
        })
          .then((response) => response.json())
          .then((data) => {
            setStore({
              user: data,
            });
            console.log(getStore().user);
          });
      },

      //Fetch POST para crear comentarios

      addComment: (group_id, data) => {
        const { text } = data;
        const accesToken = sessionStorage.getItem("token");

        fetch(process.env.BACKEND_URL + "/api/comment/" + group_id, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accesToken,
          },
          body: JSON.stringify({
            text: text,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            getActions().getComment(group_id);
          });
      },

      //Fetch GET para traer comentarios

      getComment: (id) => {
        //const accesToken = sessionStorage.getItem("token");
        //console.log(accesToken);
        fetch(process.env.BACKEND_URL + "/api/get_comment/" + id, {
          method: "GET",
          //headers: {
          //Authorization: "Bearer " + accesToken,
          //},
        })
          .then((response) => response.json())
          .then((data) => {
            setStore({
              comment: data,
            });
            // sessionStorage.setItem("groupName", data.name);
            // .catch((err) => console.error(err));
          });
      },

      //Fetch POST para subir foto de perfil con Cloudinary

      pictureProfile: async (uploadImages) => {
        const cloud_name = "inelan"; //"pluggedin";
        const preset = "oeytztqo"; //"icnpftra";
        const url_claudinari = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

        const formData = new FormData();
        formData.append("file", uploadImages);
        formData.append("upload_preset", `${preset}`);

        try {
          const response = await fetch(url_claudinari, {
            method: "POST",
            body: formData,
          });
          if (response.ok) {
            const store = getStore();
            const data = await response.json();
            const token = sessionStorage.getItem("token");
            const response2 = await fetch(
              process.env.BACKEND_URL + "/api/user/edit",
              {
                method: "PUT",
                body: JSON.stringify({
                  photo: data.url,
                }),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token,
                },
              }
            );

            const data2 = await response2.json();
            // setStore({
            //   user: data2,
            // });

            getActions().userInfo();
          }
        } catch (error) {
          console.log("message", error);
        }
      },

      //Fetch POST para subir foto de Cover de Perfil con Cloudinary

      pictureCover: async (uploadImages) => {
        const cloud_name = "inelan"; //"pluggedin";
        const preset = "oeytztqo"; //"icnpftra";
        const url_claudinari = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

        const formData = new FormData();
        formData.append("file", uploadImages);
        formData.append("upload_preset", `${preset}`);

        try {
          const response = await fetch(url_claudinari, {
            method: "POST",
            body: formData,
          });
          if (response.ok) {
            const store = getStore();
            const data = await response.json();
            const token = sessionStorage.getItem("token");
            const response2 = await fetch(
              process.env.BACKEND_URL + "/api/user/edit",
              {
                method: "PUT",
                body: JSON.stringify({
                  cover: data.url,
                }),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token,
                },
              }
            );

            const data2 = await response2.json();
            // setStore({
            //   user: data2,
            // });
            console.log(data2);
            getActions().userInfo();
          }
        } catch (error) {
          console.log("message", error);
        }
      },

      //Fetch POST para subir foto de GRUPO con Cloudinary

      pictureGroup: async (uploadImages, groupid) => {
        const cloud_name = "inelan"; //"pluggedin";
        const preset = "oeytztqo"; //"icnpftra";
        const url_claudinari = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

        const formData = new FormData();
        formData.append("file", uploadImages);
        formData.append("upload_preset", `${preset}`);
        console.log(groupid);
        try {
          const response = await fetch(url_claudinari, {
            method: "POST",
            body: formData,
          });
          if (response.ok) {
            const store = getStore();
            const data = await response.json();
            const token = sessionStorage.getItem("token");
            const response2 = await fetch(
              process.env.BACKEND_URL + `/api/group_edit/${groupid}`,
              {
                method: "PUT",
                body: JSON.stringify({
                  photo: data.url,
                }),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token,
                },
              }
            );

            const data2 = await response2.json();
            setStore({
              currentGroup: data2,
            });
          }
        } catch (error) {
          console.log("message", error);
        }
      },

      //Fetch POST para subir foto de COVER DE GRUPO con Cloudinary

      pictureGroupCover: async (uploadImages, groupid) => {
        const cloud_name = "inelan"; //"pluggedin";
        const preset = "oeytztqo"; //"icnpftra";
        const url_claudinari = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

        const formData = new FormData();
        formData.append("file", uploadImages);
        formData.append("upload_preset", `${preset}`);
        console.log(groupid);
        try {
          const response = await fetch(url_claudinari, {
            method: "POST",
            body: formData,
          });
          if (response.ok) {
            const store = getStore();
            const data = await response.json();
            const token = sessionStorage.getItem("token");
            const response2 = await fetch(
              process.env.BACKEND_URL + `/api/group_edit/${groupid}`,
              {
                method: "PUT",
                body: JSON.stringify({
                  cover: data.url,
                }),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token,
                },
              }
            );

            const data2 = await response2.json();
            setStore({
              currentGroup: data2,
            });
          }
        } catch (error) {
          console.log("message", error);
        }
      },

      // unirse a un grupo
      joinGroup: async (groupid) => {
        try {
          const accessToken = sessionStorage.getItem("token");
          const joinGroup = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessToken,
            },
            body: JSON.stringify({
              groupId: groupid,
            }),
          };
          const response = await fetch(
            process.env.BACKEND_URL + `/api/add_group/${groupid}`,
            joinGroup
          );

          if (response.ok) {
            const data = await response.json();
            console.log(data);
            return true;
          } else {
            alert("Not able to join group");
          }
        } catch (error) {
          console.log("There is an error with the server", error);
        }
      },

      // obtener información de un solo grupo
      getOneGroupInfo: async (groupid) => {
        try {
          const getGroupInfo = {
            method: "GET",
          };
          const response = await fetch(
            // process.env.BACKEND_URL + api/group/${groupid},
            process.env.BACKEND_URL + `/api/group/${groupid}`,
            getGroupInfo
          );

          if (response.ok) {
            const data = await response.json();
            setStore({
              currentGroup: data,
            });
          } else {
            alert("Can't load group info");
          }
        } catch (error) {
          console.log("There is an error with the server", error);
        }
      },

      // crear ruta
      createNewRoute: async (groupid, values) => {
        try {
          const accessToken = sessionStorage.getItem("token");
          const createRoute = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessToken,
            },
            body: JSON.stringify({
              address: values.location,
              info: values.info,
              date: values.dateTime,
            }),
          };
          const response = await fetch(
            process.env.BACKEND_URL + `/api/new_route/${groupid}`,
            createRoute
          );

          if (response.ok) {
            const data = await response.json();
            return data;
          } else {
            alert("Location can't be found");
          }
        } catch (error) {
          console.log("There is an error with the server", error);
        }
      },

      // traer rutas de grupo
      getGroupRoutes: async (groupid) => {
        try {
          const getRoutes = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };
          const response = await fetch(
            process.env.BACKEND_URL + `/api/routes/${groupid}`,
            getRoutes
          );

          if (response.ok) {
            const data = await response.json();
            const allRoutes = data;
            const firstRoute = data.shift();
            let firstRouteArray = [];
            firstRouteArray.push(firstRoute);
            setStore({
              nextRoute: firstRouteArray,
              groupRoutes: allRoutes,
            });
          } else {
            log("No routes in this group");
          }
        } catch (error) {
          console.log("There is an error with the server", error);
        }
      },
    },
  };
};

export default getState;

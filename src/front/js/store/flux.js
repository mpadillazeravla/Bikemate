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
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      registerUser: (values) => {
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
            }),
          };
          fetch(process.env.BACKEND_URL + "/api/register", newUser).then(
            (response) => {
              if (response.ok) {
                {
                  response
                    .json()
                    .then((response) =>
                      localStorage.setItem("token", response.access_token)
                    );
                  setStore({
                    auth: true,
                  });
                  console.log(getStore().auth);
                }
              } else {
                //lo que ocurre cuando la respuesta del endpoint no es OK
                {
                  alert("Parece que ese usuario ya existe"); //aquí habria que meter algo mas bonito que una alerta, pero de momento MVP
                }
              }
            }
          );
        } catch (error) {
          console.log("There is an error with the server", error);
        }
      },

      loginUser: (values) => {
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
          fetch(process.env.BACKEND_URL + "/api/login", logUser).then(
            (response) => {
              if (response.ok) {
                {
                  response
                    .json()
                    .then((response) =>
                      localStorage.setItem("token", response.access_token)
                    );
                  setStore({
                    auth: true,
                  });
                  console.log(getStore().auth);
                }
              } else {
                //lo que ocurre cuando la respuesta del endpoint no es OK
                {
                  alert("Las credenciales no son correctas"); //aquí habria que meter algo mas bonito que una alerta, pero de momento MVP
                }
              }
            }
          );
        } catch (error) {
          console.log("There is an error with the server", error);
        }
      },

      logout: () => {
        localStorage.removeItem("token");
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
    },
  };
};

export default getState;

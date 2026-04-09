const API_URL = process.env.PUBLIC_API_URL;

export const loginService = async (userData) => {
  // console.log("user dara in service: ", userData)
  try {
    const data = {
      email: userData.email,
      password: userData.password,
    };
    const res = await fetch(`${API_URL}/auths/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const loggedInUser = await res.json();

    if (loggedInUser.status != "200 OK"){
        console.log("Error: ", loggedInUser)
    }

    return loggedInUser;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const registerService = async (userData) => {
  try {
    console.log("user data in service: ", JSON.stringify(userData))
    const res = await fetch(`${API_URL}/auths/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const registeredUser = await res.json();
    
    if (registeredUser.status != "200 CREATED"){
        console.log("Error: ", registeredUser)
    }

    return registeredUser;
  } catch (error) {
    console.log("Error: ", error);
  }
};

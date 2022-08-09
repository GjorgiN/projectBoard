import LoginForm from "../Components/LoginForm";

import { useState, useEffect } from "react";
import MyProjects from "../Components/MyProjects";
import axios from 'axios'

const url = 'http://localhost:8080/api/auth/signin'

const Home = ({ isLoggedIn, setIsLoggedIn }) => {


    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            username: e.target.username.value,
            password: e.target.password.value
        }

        const config = {
            data: data,
            url: url,
            method: 'post',
        }

        // console.log(JSON.stringify(config));

        try {
            const res = await axios(config);
            console.log("PRINTING FROM RES: ", res);
            localStorage.setItem("user", res.data.token)
            e.target.username.value = '';
            e.target.password.value = '';
            setIsLoggedIn(true);
        } catch (error) {
            // console.log("cathed error", error.response.status)
            setIsLoggedIn(false);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('user');
        if (token) {
            setIsLoggedIn(true);
        }
    }, [isLoggedIn])

    console.log('isLoggedIn', isLoggedIn);

    return (
        <>
            {isLoggedIn ? <MyProjects isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> : <LoginForm handleSubmit={handleSubmit} />}
        </>
    )
}

export default Home
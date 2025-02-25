import {useNavigate, userNavigate} from "react-router-dom";

function LoginPage()
{
    const navigate = useNavigate();

    const handleLogin = () =>
    {
        navigate("/home");
    }
}

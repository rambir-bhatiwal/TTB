import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

import GuestLayout from '../../Layouts/GuestLayout';
import Button from '../../Components/Button';
import Input from '../../Components/Input';

export default function Login() {
    const  flash  = usePage();

    const [formData, setFormData] = useState({
        email: 'a@a.a',
        password: 'adsfa',
    });

    function handleInputChange(e) {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
        console.log(name, value, 'handleInputChange');
        flash.props.errors.name = ''; // Clear the error message but it's an anti-pattern to mutate props directly. Consider using a state variable for errors instead.
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log(formData);
        router.post('/login', formData);
    }

    return (
        <GuestLayout>
            <div className="p-6 text-center">
                <h1 className="mb-4 text-2xl font-bold">
                    Login Page
                </h1>

                <p className="text-gray-600">
                    This is the login page. You can add your login form here.
                </p>

                <form method="POST" onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value= {formData.email}
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                        onInvalid={(e) => {
                            e.target.setCustomValidity(
                                'Please enter a valid email address.'
                            );
                        }}
                        onInput={(e) => {
                            e.target.setCustomValidity('');
                        }}
                    />

                    {/* <p>{errors.email}</p> */}
                    {/* <p>{errors.email || flash.props.errors.email}</p> */}
                    <p>{ flash.props.errors.email}</p>

                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />

                    {/* <p>{errors.password}</p> */}
                    {/* <p>{errors.password || flash.props.errors.password}</p> */}
                    <p>{ flash.props.errors.password}</p>

                    <Button type="submit">
                        Login
                    </Button>
                </form>
            </div>
        </GuestLayout>
    );
}
import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';

import GuestLayout from '../../Layouts/GuestLayout';
import Button from '../../Components/Button';
import Input from '../../Components/Input';

export default function Login() {
    const { flash } = usePage();

    console.log('Flash message:', flash);

    const [formData, setFormData] = useState({
        email: 'hlaksdf@ldkjf.lakjdf',
        password: 'adsfa',
    });

    function handleInputChange(e) {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
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

                    {/* <p>{flash.email}</p> */}

                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />

                    {/* <p>{flash.password}</p> */}

                    <Button type="submit">
                        Login
                    </Button>
                </form>
            </div>
        </GuestLayout>
    );
}
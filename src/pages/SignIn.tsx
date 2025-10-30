import React from 'react';
import { PasswordField } from 'your-project-components'; // Adjust the import based on your project structure
import { Checkbox, FormControlLabel } from '@mui/material';

const SignIn = () => {
    return (
        <div>
            <h2>Sign In</h2>
            <form>
                {/* ...existing form fields... */}

                {/* Replace password input with <PasswordField /> */}
                <PasswordField
                    name="password"
                    label="Password"
                    aria-label="Enter your password"
                    required
                />

                {/* Ensure preferred contact checkboxes default: chat checked */}
                <FormControlLabel
                    control={<Checkbox defaultChecked name="contactMethod" />}
                    label="Chat"
                />
                <FormControlLabel
                    control={<Checkbox name="contactMethod" />}
                    label="Email"
                />

                {/* ...existing form fields... */}
            </form>
        </div>
    );
};

export default SignIn;
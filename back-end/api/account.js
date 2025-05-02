const pool = require("../database");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const crypto = require("crypto");
dotenv.config({ path: "../process.env" });


const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000); // Ensures a 6-digit number between 100000 and 999999
    return otp.toString(); // Convert OTP to string (if needed)
}


exports.register = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM USERS WHERE email = $1',
            [email]
        );

        if (result.rows.length > 0) {
            return res.status(400).json({
                status: "error",
                message: "Email is already used to create an account.",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await pool.query(
            `INSERT INTO USERS(fullname, email, password) VALUES($1, $2, $3)`, [name, email, hashedPassword]
        );
        // res.json(newUser.rows[0]);
        return res.status(200).json({
            status: "success",
            message: "Account created successfully!"
        });
    } catch (err) {
        console.error("Error during registration:", err.message);
        return res.status(500).json({
            status: "error",
            message: "An error occurred while processing your request.",
        });
    }
};


exports.sendOTP = async (req, res, next) => {
        
};
exports.verifyOTP = async (req, res, next) => {

};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Both email and password are required",
        });
    }
    try {
        // Query user by email
        const userDoc = await pool.query(
            "SELECT password FROM USERS WHERE email = $1",
            [email]
        );
        // Check if user exists
        if (userDoc.rows.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "Email or password is incorrect",
            });
        }
        // Extract the hashed password
        const hashedPassword = userDoc.rows[0].password;
        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                status: "error",
                message: "Email or password is incorrect",
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Login successful",
        });
    } catch (err) {
        console.error("Error during login:", err.message);
        return res.status(500).json({
            status: "error",
            message: "An error occurred while processing your request.",
        });
    }
};


exports.protect = async (req, res, next) => {

};

exports.forgotPassword = async (req, res, next) => {
    const {email} = req.body;
    if (!email) {
        return res.status(400).json({
            status: "error",
            message: "Email is required",
        });
    }
    const user = await pool.query("SELECT * FROM USERS WHERE USERS.email = $1",[email]);
    if (user.rows.length===0) {
        return res.status(404).json({
            status: "error",
            message: "There is no user with the given email address",
        });
    }
    //generate token
    // const resetToken = crypto.randomBytes(32).toString("hex");
    // const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const otp = generateOTP();
    const tokenExpiration = new Date(Date.now() + 10 * 60 * 1000);
    //save token in USERS.token
    await pool.query(
        `UPDATE USERS 
         SET password_reset_token = $1, password_reset_expires = $2 
         WHERE email = $3`,
        [otp, tokenExpiration, email]
    );

    try {
        //could send email here
        // const resetURL = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/new-password?token=${resetToken}`;
        console.log(`Reset Token: ${otp}`);
        res.status(200).json({
            status: "success",
            message: "Reset link sent",
        });
    }
    catch (error) {
        await pool.query(
            `UPDATE USERS 
             SET password_reset_token = NULL, password_reset_expires = NULL 
             WHERE email = $1`,
            [email]
        );
        return res.status(500).json({
            status: "error",
            message: "There was an error while sending Email, please try again",
        });
    }
};
exports.verifyResetPasswordToken = async (req, res, next) => {
    const { verificationCode } = req.body;
    if (!verificationCode) {
        return res.status(400).json({
            status: "error",
            message: "Token is required",
        });
    }
    try {
        const user = await pool.query(
            `SELECT * FROM USERS 
             WHERE password_reset_token = $1 
             AND password_reset_expires > $2`,
            [verificationCode, new Date()]
        );
        // If no user found or token expired
        if (user.rows.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "Token is invalid or has expired",
            });
        }
        // Token is valid
        return res.status(200).json({
            status: "success",
            message: "Token is valid",
        });
    } catch (error) {
        console.error("Error during token verification:", error.message);
        return res.status(500).json({
            status: "error",
            message: "An error occurred while verifying the token. Please try again.",
        });
    }
};

exports.resetPassword = async (req, res, next) => {
    const { email, newPassword, passwordConfirm } = req.body;
    // Check if required fields are provided
    if (!email || !newPassword || !passwordConfirm) {
        return res.status(400).json({
            status: "error",
            message: "Email, password, and password confirmation are required.",
        });
    }
    // Check if passwords match
    if (newPassword !== passwordConfirm) {
        return res.status(400).json({
            status: "error",
            message: "Passwords do not match.",
        });
    }
    try {
        // Query the database to find the user by email
        const user = await pool.query("SELECT * FROM USERS WHERE email = $1", [email]);
        // If user is not found
        if (user.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No user found with the provided email address.",
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        // Update the user's password in the database
        await pool.query(
            `UPDATE USERS 
             SET password = $1, password_reset_token = NULL, password_reset_expires = NULL 
             WHERE email = $2`,
            [hashedPassword, email]
        );

        // Respond with success
        return res.status(200).json({
            status: "success",
            message: "Password has been reset successfully.",
        });
    } catch (error) {
        console.error("Error during password reset:", error.message);
        // Handle unexpected errors
        return res.status(500).json({
            status: "error",
            message: "An error occurred while resetting the password. Please try again.",
        });
    }
};
const User = require("../model/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cloudinary = require('../middleware/cloudinary.js')


// Create a nodemailer transporter object configured with Gmail SMTP settings
const transporter = nodemailer.createTransport({
  // Specify the email service provider
  service: "gmail",
  // Provide authentication credentials for the sender email address
  auth: {
    // The email address that will send the emails
    user: "sengarparth2318.lpu@gmail.com",
    // The App Password generated from Google for secure SMTP access
    pass: "cqpe kftw epax zgzq",
  },
});

// Export the register function to handle new user sign-ups
exports.register = async (req, res) => {
  try {
    // Extract name, email, password, and role from the incoming request body
    const { name, email, password, role } = req.body;

    // Query the database to check if a user with this email already exists
    const emailExist = await User.findOne({ email });
    // If the email is already in the database, return a 400 Bad Request error
    if (emailExist) {
      return res.status(400).json({ messgae: "Email already exist" });
    }

    // Hash the plain-text password using bcrypt with a salt round of 10 for security
    const hashPassword = await bcrypt.hash(password, 10);
    
    // Create a new User document instance with the provided details and hashed password
    const user = new User({
      name,
      email,
      password: hashPassword,
      // Assign the provided role, or default to 'user' if none was provided
      role: role || "user",
    });

    // Save the newly created user document to the MongoDB database
    await user.save();

    // Respond to the client with a successful registration message
    res.json({ msg: "User register Successfully" });
  } catch (err) {
    // If any error occurs, catch it and send a 500 Internal Server Error status
    res.status(500).send(err);
  }
};

// Export the login function to authenticate returning users
exports.login = async (req, res) => {
  try {
    // Log the incoming request body for debugging purposes
    console.log(req.body);
    // Extract the email and password submitted by the user
    const { email, password } = req.body;

    // Search the database for a user matching the provided email address
    const emailCheck = await User.findOne({ email });
    // If no user is found with that email, return a 401 Unauthorized error
    if (!emailCheck) {
      return res.status(401).json({ msg: "Email does not Exist!" });
    }

    // Securely compare the plaintext password with the hashed password in the DB
    const passMatch = await bcrypt.compare(password, emailCheck.password);
    // If the passwords do not match, return a 401 Unauthorized error
    if (!passMatch) {
      return res.status(401).json({ msg: "Paasword not match!" });
    }

    // Generate a JWT containing the user's ID and role as the payload
    const token = jwt.sign(
      { id: emailCheck._id, role: emailCheck.role },
      process.env.JWT_TOKEN, // Sign the token using the secret key from environment variables
      { expiresIn: "1d" }, // Set the token to automatically expire after 1 day
    );

    // Attach the generated JWT to the user's browser as a secure HTTP-Only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents XSS attacks by blocking client-side JavaScript from reading the cookie
      secure: process.env.NODE_ENV === "production", // Only transmit cookie over HTTPS in production
      sameSite: "strict", // Restrict the cookie to first-party/same-site requests to prevent CSRF
      maxAge: 24 * 60 * 60 * 1000, // Make the cookie expire in 1 day (calculated in milliseconds)
    });

    // Send a JSON response verifying success, along with the token and user details
    res.json({
      token,
      emailCheck: {
        id: emailCheck._id,
        email: emailCheck.email,
        role: emailCheck.role,
      },
    });
  } catch (err) {
    // Catch any unexpected runtime errors and return a 500 status code
    res.status(500).send(err);
  }
};

// Export the profile function to fetch the currently logged-in user's details
exports.profile = async (req, res) => {
  try {
    // Find the user in the database using the ID encoded in their verification token (from req.user)
    // The .select("-password") modifier ensures the heavy/sensitive password hash is excluded from the result
    const user = await User.findById(req.user.id).select("-password");
    
    // Return the sanitized user object back to the client as JSON
    res.status(200).json(user);
  } catch (err) {
    // Log the error to the console and return a stable 500 error message to the client
    console.log("Profile fetch error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Export the logout function to destroy the user's active session
exports.logout = async (req, res) => {
  try {
    // Tell the user's browser to immediately delete the 'token' cookie
    res.clearCookie("token");
    // Send a success response confirming the logout action
    res.status(200).json({ msg: "Successfuly logout" });
  } catch (err) {
    // Log any errors that might occur during the logout process
    console.log(err);
  }
};

// Export the function to initiate the password recovery process
exports.forgetPassword = async (req, res) => {
  try {
    // Extract the email provided by the user requesting a reset
    const { email } = req.body;

    // Search the database to ensure an account exists with this email
    const user = await User.findOne({ email });
    // If no user exists, halt execution and return a 401 status
    if (!user) return res.status(401).json({ msg: "User not found" });

    // Generate 32 bytes of cryptographically secure random data and convert to a hex string
    const token = crypto.randomBytes(32).toString("hex");
    
    // Assign the generated unique token to the user document
    user.resetToken = token;
    // Set an expiration deadline for the token (current time + 10 minutes)
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;

    // Save the document updates (the new token and expiration) to the database
    await user.save();

    // Construct the full URL the user must click to reset their password
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    // Use the nodemailer transporter to dispatch the recovery email
    await transporter.sendMail({
      to: user.email, // Send to the matching user's email address
      subject: "Password Reset", // Email subject line
      html: `
      <h3>Password Reset</h3>
      <p>Click below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
    `, // HTML formatted email body containing the clickable reset link
    });

    // Send a success JSON response confirming the email was dispatched
    res.json({
      msg: "Token send to email: ",
      token: token,
    });
  } catch (err) {
    // Log any errors (like SMTP failures) to the server console
    console.log(err);
  }
};

// Export the function to finalize the password reset with a new password
exports.resetpassword = async (req, res) => {
  try {
    // Extract the new password from the incoming request body
    const { password } = req.body;
    // Extract the reset token from the dynamic URL parameter (e.g. /resetPassword/:token)
    const { token } = req.params;

    // Search the database for a user matching the token who ALSO has an unexpired token timer
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Token expiration must be greater than current time
    });

    // If no match is found (or token expired), return a 400 Bad Request error
    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    // Hash the newly provided password securely
    const hashPassword = await bcrypt.hash(password, 10);

    // Overwrite the user's old password with the new hashed password
    user.password = hashPassword;

    // Wipe the reset token and expiration fields to prevent reuse of the recovery link
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    // Commit the password change and token wipes to the database
    await user.save();

    // Send a success verification to the frontend
    res.json({ msg: "Password reset Successfully" });
  } catch (err) {
    // Log compilation or runtime errors to the console
    console.log(err);
  }
};

// Export the function responsible for handling user profile image uploads
exports.uploadImage = async(req,res)=>{
    try{
        // Check if the Multer middleware successfully attached a file to the request
        if(!req.file) return res.status(400).json({msg: "Image not uploaded"});
    
        // Extract the file object from the request
        const file = req.file;
        // Convert the raw file memory buffer into a Base64 encoded string format
        const base64 = file.buffer.toString('base64');

        // Construct a standard Data URI format string containing the mime type and base64 string
        const dataUri= `data:${file.mimetype};base64,${base64}`;

        // Upload the formatted Data URI string securely to your Cloudinary storage bucket
        const result = await cloudinary.uploader.upload(dataUri);

        // Fetch the active user's document from the database using their decoded token ID
        const user = await User.findById(req.user?.id)

        // If the user document was successfully found
        if(user){
            // Update the user's image property to contain the newly generated Cloudinary URLs
            user.image = {
                url: result.secure_url, // The secure HTTPS public URL to the hosted image
                public_id: result.public_id // Cloudinary's internal tracker ID for the image
            };
            // Save the newly attached image data to the MongoDB database
            await user.save();
        }

        // Return a JSON response confirming the upload, passing back the live URL
        res.json({
            msg: "image successfully uploaded",
            url: result.secure_url
        })

    }catch(err){
        // Log the exact upload error and alert the client if the server crashes during processing
        console.log("Upload error", err);
        res.status(500).json({msg: "Server error during upload"});
    }
}

// Export the function to blast out live Socket.io notifications
exports.sendNotification = async(req,res)=>{
    // Extract the notification message from the incoming HTTP request body
    const {message} = req.body;

    // Interface with the global Express app instance to grab the attached Socket.io 'io' server object
    const io = req.app.get("io");

    // Emit a 'notification' event globally to ALL connected websocket clients containing the message
    io.emit("notification", message);

    // Send an HTTP response back confirming the broadcast was successfully fired
    res.json({msg:"message sent"});
}





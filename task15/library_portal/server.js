const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: "library_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://harmit:878787@newcluster.ohliefv.mongodb.net/library_portal",
      collectionName: "sessions",
      touchAfter: 24 * 3600 
    }),
    cookie: { 
      maxAge: 30 * 60 * 1000, 
      httpOnly: true,
      secure: false 
    },
  })
);


mongoose.connect("mongodb+srv://harmit:878787@newcluster.ohliefv.mongodb.net/library_portal")
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });


mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🚫 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📡 Mongoose disconnected from MongoDB');
});


const activitySchema = new mongoose.Schema({
  email: String,
  action: String, 
  time: String,
});

const Activity = mongoose.model("Activity", activitySchema);


const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
};


const users = {
  "john@example.com": { name: "John Doe", password: "1234" },
  "alice@example.com": { name: "Alice Smith", password: "abcd" },
};


app.get("/", (req, res) => {

  if (req.session.user) {
    return res.redirect("/profile");
  }
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/profile", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "profile.html"));
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  
  if (!email || !password) {
    return res.send("<h3>Please provide both email and password. <a href='/'>Try again</a></h3>");
  }

 
  const loginTime = new Date().toLocaleString();
  

  const userName = email.includes('@') ? email.split('@')[0] : email;

  req.session.user = {
    name: userName.charAt(0).toUpperCase() + userName.slice(1),
    email,
    loginTime,
  };

  console.log(`🔐 Session created for user: ${email} at ${loginTime}`);


  await Activity.create({ email, action: "login", time: loginTime });

  return res.redirect("/profile");
});


app.get("/profile-data", requireAuth, (req, res) => {
  res.json(req.session.user);
});


app.get("/logout", async (req, res) => {
  if (req.session.user) {
    const email = req.session.user.email;
    await Activity.create({
      email,
      action: "logout",
      time: new Date().toLocaleString(),
    });
    console.log(`🚪 Session destroyed for user: ${email}`);
  }

  req.session.destroy(err => {
    if (err) return res.send("Error logging out.");
    res.redirect("/");
  });
});


app.get("/activity", requireAuth, async (req, res) => {
  try {

    const logs = await Activity.find({ email: req.session.user.email }).sort({ _id: -1 }).limit(20);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
});


app.get("/session-status", (req, res) => {
  res.json({ 
    isLoggedIn: !!req.session.user,
    user: req.session.user || null,
    sessionID: req.sessionID
  });
});


app.get("/debug/sessions", async (req, res) => {
  try {

    const sessions = await mongoose.connection.db.collection("sessions").find({}).toArray();
    res.json({
      totalSessions: sessions.length,
      sessions: sessions.map(session => ({
        sessionID: session._id,
        expires: session.expires,
        hasUserData: !!session.session && !!JSON.parse(session.session).user
      }))
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});


app.listen(PORT, () => {
  console.log("🚀 Library Portal Server Started");
  console.log(`📍 Server running at: http://localhost:${PORT}`);
  console.log("🔄 Attempting to connect to MongoDB...");
});

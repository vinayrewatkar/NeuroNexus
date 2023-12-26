const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const QuizQ = require("./models/quizQuestion");



require("./db/conn");
const port = process.env.PORT || 3003
const staticpath = path.join(__dirname, "../public");
const templatepath = path.join(__dirname, "../templates/views");
const partialpath = path.join(__dirname, "../templates/partials");


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/css", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use("/jq", express.static(path.join(__dirname, "../node_modules/jquery/dist")));



app.use(express.static(staticpath));
app.set("view engine", "hbs");
app.set("views", templatepath);
hbs.registerPartials(partialpath)


app.get("/", (req, res) => {
    res.render("index");
})

app.get("/contact", (req, res) => {
    res.render("contact");
})

app.get("/create", (req, res) => {
    res.render("create");
})
app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/quiz", (req, res) => {
    res.render("quiz");
});
app.get("/quiz-result", (req, res) => {
    res.render("quiz-result");
});


app.post("/contact", async (req, res) => {
    try {
        const userData = new User(req.body);
        await userData.save();
        res.status(201).render("index");
    } catch (error) {
        res.status(500).send(error);
    }


})

app.post("/create", async (req, res) => {
    try {
        const totalQuestions = req.body["total-questions"];
        const questions = [];

        for (let i = 0; i < totalQuestions; i++) {
            const question = {
                description: req.body[`questions.${i}.description`],
                option1: req.body[`questions.${i}.option1`],
                option2: req.body[`questions.${i}.option2`],
                option3: req.body[`questions.${i}.option3`],
                option4: req.body[`questions.${i}.option4`],
                correctAns: req.body[`questions.${i}.correctAns`]
            };
            questions.push(question);
        }
        const quiz = new QuizQ({ totalQuestions, questions });
        await quiz.save();

        res.status(201).render("index");
    } catch (error) {
        res.status(500).send(error);
    }
});


app.get("/api/get-quiz", async (req, res) => {
    try {
        const quiz = await QuizQ.findOne(); // Assuming you have only one quiz in the database
        res.json({ success: true, questions: quiz.questions });
    } catch (error) {
        res.json({ success: false, error: "Failed to fetch quiz questions." });
    }
});

app.post("/Submit Quiz", (req, res) => {
    try {
        const quiz = req.body.quiz; // Assuming you pass the entire quiz object in the request

        // Process submitted quiz answers and calculate the result
        const submittedAnswers = req.body.answers;
        let score = 0;

        quiz.questions.forEach((question, index) => {
            if (submittedAnswers[`answer${index}`] === question.correctAns) {
                score++;
            }
        });

        // Render the result page with the score
        res.render("quiz-result", { success: true, score });
    } catch (error) {
        res.render("quiz-result", { success: false, error: "Failed to process quiz submission." });
    }
});






app.listen(port, () => {
    console.log(`server is running at port ${port}`);
});
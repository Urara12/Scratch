const express = require("express");
const app = express();
const morgan = require("morgan");
const config = require("./config");
const knex = require("knex")(config.db);
const cors = require("cors");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => res.redirect("/public"));

let db;

const getUsers = (knex) => {
    return knex
        .select()
        .table("results")
        .then((results) =>
            results.map((results) => {
                return new Result(results);
            })
        );
};

const Result = function (dbresults) {
    this.username = dbresults.name;
    this.result = dbresults.result;
};

const deleteResult = (knex, name) => {
    return knex("results").where("name", name).del();
};

// const addUser = (user) => {
//     console.log("addUser");
//     console.log(user);
//     return db("results")
//         .insert(user)
//         .then(() => {
//             return db("results").where("name", user.name).select();
//         })
//         .then((results) => results.pop());
// };
const addScore = (user, score) => {
    console.log("addUser");
    console.log(user);
    return db("results").insert({ name: user, result: score });
    // .then(() => {
    //     return db("results").where("name", user.name).select();
    // })
    // .then((results) => results.pop());
};

const changeScore = (user, score) => {
    console.log("score : ", score);
    console.log("user : ", user);
    return db("results")
        .where({ name: user })
        .update({ result: score }, ["name", "result"]);
};

const setupServer = (knex) => {
    db = knex;
    app.use(express.json());
    app.use(morgan("dev"));

    app.get("/", (req, res) => {
        console.log(knex);
        res.send("Hello!!!");
    });

    app.get("/result", async (req, res) => {
        let users = [];
        await getUsers(knex).then((results) =>
            results.forEach((result) => {
                users.push(result);
            })
        );

        console.log("result", users);
        res.send(users);
    });

    // app.post("/result", async (req, res) => {
    //     console.log("post");
    //     console.log(req.params);
    //     // const User = {
    //     //   username: req.params.username,
    //     //   result: Number(req.params.result),
    //     // };
    //     const newUser = req.body;
    //     console.log("newUser : ", newUser);
    //     newUser.result = Number(newUser.result);
    //     console.log(newUser);
    //     await addUser(newUser);
    //     res.status(201).send(newUser);
    // });

    app.post("/result/:name/:score", async (req, res) => {
        const newUser = req.params.name;
        const newScore = req.params.score;

        console.log("score!", newScore);
        await addScore(newUser, newScore);

        res.send("seved");
    });

    app.delete("/result/:name", async (req, res) => {
        console.log("!!");
        const targetUser = req.params.name;
        await deleteResult(knex, targetUser);
        res.status(204).send();
    });

    app.patch("/result/:name/:score", async (req, res) => {
        console.log("s of patch");
        const targetUser = req.params.name;
        let updatedUser;
        const newScore = req.params.score;

        console.log("score!", newScore);
        await changeScore(targetUser, newScore).then((user) => {
            updatedUser = user[0];
        });
        res.send(updatedUser);
    });

    return app;
};

module.exports = { setupServer };

const server = setupServer(knex);
server.listen(config.express.port, () => {
    console.log(`Server up and listening on port ${config.express.port}`);
});

var child = require("child_process");
const express = require("express");
const app = express();
const fs = require("fs");
var cors = require("cors")({ origin: true });
// console.log(process.cwd());
const bodyParser = require('body-parser');
const port = 80;
app.use(cors);
app.use(express.static(__dirname + "/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


function errorHandler(error, stdout, stderr) {
    if (stderr) {
        res.status(400);
        res.send(stderr);
    }
    if (error) {
        res.status(400);
        res.send(error);
    }
}



app.post("/compile", function (req, res) {
    var body;
    try {
        body = JSON.parse(req.body);
    } catch (err) {
        body = req.body;
    }

    var stdin = "";
    var ip = req.header("x-forwarded-for") || req.connection.remoteAddress;
    console.log("Request made by:", ip);
    var codeBody = body.input_text;

    function fileWriting() {
        switch (body.language) {
            case "python":
                try {
                    fs.writeFile("temp.py", codeBody, (err) => {
                        if (err) console.log(err);
                        console.log("Successfully Written to File.");
                        compile();
                    });
                }
                catch {
                    child.execSync(
                        "rm -rf ./temp.py"
                    );
                    res.status(400);
                    res.send({ error: error.message });

                    return;
                }

                break;

            case "C":
                try {
                    fs.writeFile("temp.c", codeBody, (err) => {
                        if (err) console.log(err);
                        console.log("Successfully Written to File.");
                        compile();
                    });
                }
                catch {
                    child.execSync(
                        "rm -rf ./temp.c"
                    );
                    res.status(400);
                    res.send({ error: error.message });

                    return;
                }
                break;

            case "C++":
                try {
                    fs.writeFile("temp.cpp", codeBody, (err) => {
                        if (err) console.log(err);
                        console.log("Successfully Written to File.");
                        compile();
                    });
                }
                catch {
                    child.execSync(
                        "rm -rf ./temp.cpp"
                    );
                    res.status(400);
                    res.send({ error: error.message });

                    return;
                }
                break;

            case "java":
                try {
                    fs.writeFile("temp.java", codeBody, (err) => {
                        if (err) console.log(err);
                        console.log("Successfully Written to File.");
                        compile();
                    });
                }
                catch {
                    child.execSync(
                        "rm -rf ./temp.java"
                    );
                    res.status(400);
                    res.send({ error: error.message });

                    return;
                }
                break;
        }

    }

    function compile() {
        var stdout;
        switch (body.language) {
            case "python":
                try {
                    stdout = child
                        .execSync(
                            "python3 ./temp.py"
                        )
                        .toString();
                    console.log(stdout)
                } catch (error) {
                    child.execSync(
                        "rm -rf ./temp.py"
                    );
                    res.status(400);
                    res.send({ error: error.message });

                    return;
                }

                break;
            case "C":
                try {
                    child.execSync(
                        "gcc -o Ccode ./temp.c"
                    );
                } catch (error) {
                    child.execSync(
                        "rm ./temp.c"
                    );
                    res.status(400);
                    res.send({ error: error.message });
                    return;
                }

                try {
                    stdout = child
                        .execSync("./Ccode", {
                            input: stdin,
                            timeout: 60000
                        })
                        .toString();
                } catch (error) {
                    child.execSync(
                        "rm ./temp.c"
                    );
                    res.status(400);
                    res.send({ error: error.message });
                    return;
                }

                break;
            case "C++":
                try {
                    child.execSync(
                        "g++ -o Ccode ./temp.cpp"
                    );
                } catch (error) {
                    child.execSync(
                        "rm ./temp.cpp"
                    );
                    res.status(400);
                    res.send({ error: error.message });
                    return;
                }

                try {
                    stdout = child
                        .execSync("./Ccode", {
                            input: stdin,
                            timeout: 60000
                        })
                        .toString();
                } catch (error) {
                    child.execSync("rm -r data");
                    child.execSync(
                        "rm ./temp.cpp"
                    );
                    res.status(400);
                    res.send({ error: error.message });
                    return;
                }

                break;
            case "java":
                try {
                    child.execSync("javac ./temp.java");
                } catch (error) {
                    child.execSync(
                        "rm ./temp.java"
                    );
                    res.status(400);
                    res.send({ error: error.message });
                    return;
                }
                try {
                    stdout = child
                        .execSync(
                            "java temp",
                            {
                                input: stdin,
                                timeout: 60000
                            }
                        )
                        .toString();
                } catch (error) {
                    child.execSync(
                        "rm ./temp.java"
                    );
                    res.status(400);
                    res.send({ error: error.message });
                    return;
                }

                break;
        }
        var result = {
            stdout: stdout
        };
        res.status(200);
        res.send(result);
    }

    fileWriting();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

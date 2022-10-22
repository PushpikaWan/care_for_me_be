const express = require("express"),
    bodyParser = require("body-parser"),
    swaggerUi = require("swagger-ui-express"),
    YAML = require('yamljs'),
    swaggerDocument = YAML.load('./swagger.yaml'),
    OpenApiValidator = require('express-openapi-validator'),
    path = require('path'),
    fs = require("fs");

//firebase init
require('./authorization/firebase-admin');
const posts = require("./services/posts");
const common = require("./util/common");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: '20mb'
    })
);
app.use(bodyParser.json({limit: '20mb'}));

const pathToIndex = path.join(__dirname, "client/build/index.html")
app.get("/care/:postId", async (req, res) => {
  try {
    const options = {
      postId: req.params['postId']
    };
    const result = await posts.getPost(options);
    const post = result.data;

    const raw = fs.readFileSync(pathToIndex, 'utf8');
    const pageTitle = "Care for Me"
    const updated = raw.replace("__PAGE_META__", `<title>${pageTitle}</title>
    <meta name="description" content= "${post.description}"/>
    <meta name="og:title" content="${common.getAnimalNeedLabel(
        post.animalNeed)} - ${post.district}"/>
    <meta name="og:description" content="${post.description}"/>
    <meta name="og:image" content= "${post.imageUrl}"/>`)
    res.send(updated)
  } catch (ex) {
    return res.status(500);
  }
})

app.use(express.static(path.join(__dirname, "client/build")))
// app.get("", (req, res) =>
//     res.sendFile(path.join(__dirname, "client/build/index.html"))
// )

//use requested additional routes before validator
app.use('/api-docs', swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {explorer: true}));
app.use(
    OpenApiValidator.middleware({
      apiSpec: './swagger.yaml',
      validateRequests: true, // (default)
      validateResponses: false, // false by default
    }),
);

app.use((err, req, res, next) => {
  // format error
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

app.listen(PORT);
console.debug('Server listening on port: ' + PORT);

/*
 * Routes
 */
app.use('/user', require('./routes/user'));
app.use('/posts', require('./routes/posts'));
app.use('/metadata', require('./routes/metadata'));
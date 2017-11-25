import * as express from "express";
// import * as path from "path";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
// import * as root from "app-root-path";
// import * as cookieParser from "cookie-parser";
import * as routes from "./server/routes";
import * as pgPromise from "pg-promise";

const app = express();

const pgp = pgPromise();
const cn = {
  host: "localhost",
  port: 5432,
  database: "ubermo",
  user: "ubermo",
  password: "ubermo"
};

const db = pgp(cn);

// db
//   .any("SELECT * FROM UBERMO.TIPO")
//   .then(console.log)
//   .catch(console.error);

// view engine setup
// app.set("views", `${root}/server/views/`);
// app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.json());
// app.use(
//   bodyParser.urlencoded({
//     extended: false
//   })
// );

// app.use(cookieParser());

app.use(
  "/",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const handleError = (err: Error) => {
      res.status(500);
      console.log(err);
      res.json({ message: err.message });
    };
    res.locals.handleError = handleError;
    res.locals.db = db;
    next();
  }
);

app.use("/", routes);

// catch 404 and forward to error handler
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let err: any = new Error("Not Found");
    err.status = 404;
    next(err);
  }
);

// error handlers
// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: err
      });
    }
  );
}

app.use(function(
  err: any,
  req: express.Request,
  res: express.Response,
  next: Function
) {
  res.status(err.status || 500);
  res.json({ message: err.message });
});

export = app;
